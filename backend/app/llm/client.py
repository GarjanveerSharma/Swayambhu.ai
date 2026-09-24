"""
Ollama se baat karne wala code.
Ollama ka /api/chat har token ko ek JSON line (NDJSON) me bhejta hai.
"""
import json
from collections.abc import AsyncIterator

import httpx

from app.core.config import get_settings


class LLMError(Exception):
    """Ollama se jude errors, jo user ko dikhane layak hon."""


# In models ka jawab kabhi-kabhi bina "<think>" tag ke thinking se shuru hota hai
THINKING_MODELS = ("qwen3", "deepseek-r1")


def is_thinking_model(model: str) -> bool:
    return any(name in model.lower() for name in THINKING_MODELS)


class ThinkFilter:
    """
    qwen3 jaise models jawab se pehle <think>...</think> me sochte hain.
    Ye filter streaming ke beech wo hissa hata deta hai.

    Do case sambhalta hai:
    1. "<think> soch... </think> jawab"
    2. "soch... </think> jawab"  (opening tag prompt me hi laga hota hai)
       Iske liye thinking model me shuru ka text tab tak rok ke rakhte hain
       jab tak "</think>" na mile. Stream khatam ho jaye aur "</think>" na mile
       to poora text jawab maana jata hai.
    """
    OPEN, CLOSE = "<think>", "</think>"

    def __init__(self, maybe_untagged: bool = False) -> None:
        self._buf = ""
        self._maybe_untagged = maybe_untagged
        # start -> (thinking | maybe_thinking) -> after_think -> answer
        self._state = "start"

    def feed(self, token: str) -> str:
        self._buf += token
        out = ""
        while True:
            if self._state == "start":
                stripped = self._buf.lstrip()
                if not stripped:
                    return out
                if stripped.startswith(self.OPEN):
                    self._buf = stripped[len(self.OPEN):]
                    self._state = "thinking"
                    continue
                if self.OPEN.startswith(stripped):
                    return out  # "<thi" jaisa adhoora tag, aur text ka wait karo
                self._state = "maybe_thinking" if self._maybe_untagged else "answer"
                continue
            if self._state == "maybe_thinking":
                idx = self._buf.find(self.CLOSE)
                if idx == -1:
                    return out  # "</think>" ka wait, text roke rakho
                self._buf = self._buf[idx + len(self.CLOSE):]
                self._state = "after_think"
                continue
            if self._state == "thinking":
                idx = self._buf.find(self.CLOSE)
                if idx == -1:
                    # closing tag ke adhoore hisse ko rakh lo, baaki phenk do
                    self._buf = self._buf[-(len(self.CLOSE) - 1):]
                    return out
                self._buf = self._buf[idx + len(self.CLOSE):]
                self._state = "after_think"
                continue
            if self._state == "after_think":
                # </think> ke baad wali khali lines hatao
                self._buf = self._buf.lstrip()
                if not self._buf:
                    return out
                self._state = "answer"
                continue
            out += self._buf
            self._buf = ""
            return out

    def flush(self) -> str:
        # "</think>" kabhi nahi aaya: roka hua poora text asli jawab tha
        rest = self._buf if self._state in ("answer", "maybe_thinking") else ""
        self._buf = ""
        return rest


def _disable_thinking(messages: list[dict]) -> list[dict]:
    """qwen3 ko sochne se roko: aakhri user message ke end me /no_think lagao."""
    msgs = [dict(m) for m in messages]
    for m in reversed(msgs):
        if m["role"] == "user":
            if "/no_think" not in m["content"]:
                m["content"] = m["content"].rstrip() + "\n\n/no_think"
            break
    return msgs


async def stream_chat(model: str, messages: list[dict]) -> AsyncIterator[str]:
    """
    messages: [{"role": "system"|"user"|"assistant", "content": "..."}]
    Har token (text ka tukda) yield karta hai.
    Ye generator beech me band kar diya jaye to Ollama ka request bhi band ho jata hai.
    """
    s = get_settings()
    thinking_model = is_thinking_model(model)
    if thinking_model:
        messages = _disable_thinking(messages)
    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
        "think": False,          # qwen3 ka "thinking" text band, sirf final jawab
        "keep_alive": "30m",     # model 30 minute tak RAM me rahe
        "options": {"num_ctx": s.llm_num_ctx},  # documents ke liye badi context window
    }
    timeout = httpx.Timeout(connect=5.0, read=300.0, write=30.0, pool=5.0)
    think_filter = ThinkFilter(maybe_untagged=thinking_model)

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            async with client.stream("POST", f"{s.ollama_url}/api/chat", json=payload) as r:
                if r.status_code == 404:
                    raise LLMError(f"Model '{model}' installed nahi hai. Chalao: ollama pull {model}")
                if r.status_code >= 400:
                    body = (await r.aread()).decode(errors="ignore")
                    raise LLMError(f"Ollama error {r.status_code}: {body[:200]}")

                async for line in r.aiter_lines():
                    if not line.strip():
                        continue
                    data = json.loads(line)
                    if data.get("error"):
                        raise LLMError(data["error"])
                    token = data.get("message", {}).get("content", "")
                    if token:
                        text = think_filter.feed(token)  # <think>...</think> hatao
                        if text:
                            yield text
                    if data.get("done"):
                        break
                rest = think_filter.flush()
                if rest:
                    yield rest
    except httpx.ConnectError as exc:
        raise LLMError("Ollama se connect nahi ho paya. Check karo Ollama chal raha hai.") from exc
    except httpx.ReadTimeout as exc:
        raise LLMError("Model ne time pe jawab nahi diya.") from exc