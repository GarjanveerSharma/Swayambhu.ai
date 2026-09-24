"""
Text ko vectors (numbers ki list) me badalna, Ollama ke embedding model se.
Same matlab wale texts ke vectors paas-paas hote hain, isi se search hota hai.
"""
import httpx

from app.core.config import get_settings
from app.llm.client import LLMError

BATCH_SIZE = 16
TIMEOUT = httpx.Timeout(connect=5.0, read=300.0, write=30.0, pool=5.0)


def _payload(texts: list[str]) -> dict:
    return {"model": get_settings().model_embedding, "input": texts, "keep_alive": "30m"}


def _parse(r: httpx.Response) -> list[list[float]]:
    model = get_settings().model_embedding
    if r.status_code == 404:
        raise LLMError(f"Embedding model '{model}' installed nahi hai. Chalao: ollama pull {model}")
    if r.status_code >= 400:
        raise LLMError(f"Embedding error {r.status_code}: {r.text[:200]}")
    return r.json()["embeddings"]


def embed_sync(texts: list[str]) -> list[list[float]]:
    """Background document processing ke liye (thread me chalta hai)."""
    url = f"{get_settings().ollama_url}/api/embed"
    vectors: list[list[float]] = []
    try:
        with httpx.Client(timeout=TIMEOUT) as client:
            for i in range(0, len(texts), BATCH_SIZE):
                r = client.post(url, json=_payload(texts[i : i + BATCH_SIZE]))
                vectors.extend(_parse(r))
    except httpx.ConnectError as exc:
        raise LLMError("Ollama se connect nahi ho paya (embedding).") from exc
    return vectors


async def embed_query(text: str) -> list[float]:
    """Chat ke time sawaal ka vector."""
    url = f"{get_settings().ollama_url}/api/embed"
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            r = await client.post(url, json=_payload([text]))
    except httpx.ConnectError as exc:
        raise LLMError("Ollama se connect nahi ho paya (embedding).") from exc
    return _parse(r)[0]