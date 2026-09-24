"""
Ek chat request ka poora kaam:
chat banana -> model chunna -> attached files padhna -> company documents me search (RAG)
-> history ke saath Ollama ko bhejna -> tokens stream karna -> save karna.
Frontend ko bhejne layak events (dict) yield karta hai.
"""
import asyncio
import time
from collections.abc import AsyncIterator, Awaitable, Callable

from app.llm.client import LLMError, stream_chat
from app.llm.prompts import SYSTEM_PROMPT
from app.rag.retriever import search_documents
from app.router.selector import choose_model
from app.schemas.chat import ChatRequest
from app.services.audit_store import AuditRecord, audit_store
from app.services.chat_store import Message, chat_store, new_id
from app.services.document_store import DocumentRecord, document_store

HISTORY_LIMIT = 20          # pichhle kitne messages model ko bhejne hain
TITLE_CHARS = 40
ATTACH_WAIT_SECONDS = 60    # attached file process hone ka kitna wait karein
ATTACH_MAX_CHARS = 8000     # ek request me attachments ka max text (model ki limit ke liye)


def _title_from(message: str) -> str:
    title = " ".join(message.split())
    return title[:TITLE_CHARS] + ("…" if len(title) > TITLE_CHARS else "")


async def _wait_until_processed(doc_id: str) -> DocumentRecord | None:
    for _ in range(ATTACH_WAIT_SECONDS * 2):
        doc = document_store.get(doc_id)
        if doc is None or doc.status != "processing":
            return doc
        await asyncio.sleep(0.5)
    return document_store.get(doc_id)


async def _attachment_context(doc_ids: list[str]) -> tuple[str, list[str]]:
    """Attached files ka text ek block me. Saath me un files ki list jo padh nahi paye."""
    blocks, problems, used = [], [], 0
    for doc_id in doc_ids:
        doc = await _wait_until_processed(doc_id)
        if doc is None:
            problems.append(f"{doc_id}: file nahi mili")
            continue
        pages = document_store.get_pages(doc_id)
        if not pages:
            problems.append(f"{doc.name}: {doc.error or 'text nahi mila'}")
            continue

        text = "\n".join(f"[Page {i}]\n{p.strip()}" for i, p in enumerate(pages, 1))
        room = ATTACH_MAX_CHARS - used
        if room <= 0:
            problems.append(f"{doc.name}: text limit poori, file chhod di")
            continue
        if len(text) > room:
            text = text[:room] + "\n…(truncated)"
        used += len(text)
        blocks.append(f'<document name="{doc.name}">\n{text}\n</document>')
    return "\n\n".join(blocks), problems


def _kb_context(sources: list[dict]) -> str:
    """Search results ko numbered excerpts bana do, taaki model [1], [2] se refer kare."""
    return "\n\n".join(
        f'<excerpt id="{i}" file="{s["file"]}" page="{s["page"]}">\n{s["text"]}\n</excerpt>'
        for i, s in enumerate(sources, 1)
    )


def _build_prompt(question: str, attached: str, kb: str) -> str:
    parts = []
    if attached:
        parts.append("ATTACHED DOCUMENTS:\n" + attached)
    if kb:
        parts.append("COMPANY KNOWLEDGE BASE EXCERPTS:\n" + kb)
    rules = (
        "Answer the question using the material above.\n"
        "- When you use an excerpt, cite it like [1] or [2].\n"
        "- When you use an attached document, mention its page number.\n"
        "- If the material does not contain the answer, say clearly that it is not in the documents, "
        "then answer from general knowledge only if you are confident, and label it as general knowledge."
    )
    return "\n\n".join(parts) + f"\n\n{rules}\n\nQuestion: {question}"


async def run_chat(
    req: ChatRequest,
    is_disconnected: Callable[[], Awaitable[bool]],
) -> AsyncIterator[dict]:
    start = time.perf_counter()
    tools: list[str] = []

    # 1. Chat dhundho ya nayi banao
    chat = chat_store.get(req.chat_id) if req.chat_id else None
    if chat is None:
        chat = chat_store.create(_title_from(req.message))

    # 2. User ka message save karo (attachments ke asli naam ke saath)
    attachments = []
    for doc_id in req.attachment_ids:
        doc = document_store.get(doc_id)
        attachments.append({"id": doc_id, "name": doc.name if doc else doc_id})
    chat_store.add_message(
        chat.id, Message(role="user", content=req.message, attachments=attachments or None)
    )

    assistant = Message(role="assistant", content="", steps=[], sources=[])
    yield {"type": "meta", "chatId": chat.id, "messageId": assistant.id}

    # 3. Model chuno
    choice = choose_model(req.message, req.mode)
    assistant.model = {"name": choice.name, "reason": choice.reason}
    yield {"type": "model", "name": choice.name, "reason": choice.reason}

    # 4. Attached files padho
    attached = ""
    if req.attachment_ids:
        tools.append("read_attachments")
        step = {"id": new_id(), "text": "Attached files padh raha hai", "status": "running"}
        yield {"type": "step", **step}
        attached, problems = await _attachment_context(req.attachment_ids)
        step["status"] = "done" if attached else "failed"
        if problems:
            step["text"] += f" ({'; '.join(problems)})"
        assistant.steps.append(step)
        yield {"type": "step", **step}

    # 5. Company documents me search (RAG)
    kb = ""
    if req.use_knowledge:
        step = {"id": new_id(), "text": "Company documents me search", "status": "running"}
        yield {"type": "step", **step}
        try:
            hits = await search_documents(req.message)
            if hits:
                tools.append("search_kb")
                kb = _kb_context(hits)
                assistant.sources = [
                    {"docId": h["docId"], "file": h["file"], "page": h["page"], "text": h["text"]}
                    for h in hits
                ]
                step["text"] += f" ({len(hits)} relevant hisse mile)"
                step["status"] = "done"
            else:
                step["text"] += " (koi relevant document nahi mila)"
                step["status"] = "done"
        except LLMError as exc:
            step["text"] += f" (fail: {exc})"
            step["status"] = "failed"
        assistant.steps.append(step)
        yield {"type": "step", **step}

    # 6. Model ke liye conversation taiyaar karo
    history = [m for m in chat.messages if m.content][-HISTORY_LIMIT:]
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in history]
    if attached or kb:
        # Sirf is baar ke sawaal me documents jodo (history me original sawaal hi rahega)
        messages[-1] = {"role": "user", "content": _build_prompt(req.message, attached, kb)}

    # 7. Jawab stream karo
    parts: list[str] = []
    stopped = False
    try:
        async for token in stream_chat(choice.name, messages):
            if await is_disconnected():
                stopped = True  # user ne Stop dabaya
                break
            parts.append(token)
            yield {"type": "token", "text": token}
    except LLMError as exc:
        assistant.error = str(exc)
        yield {"type": "error", "message": str(exc)}

    # 8. Sources bhejo (jawab ke neeche dikhenge)
    if not stopped:
        for src in assistant.sources:
            yield {"type": "source", "source": src}

    # 9. Save karo (stop hone pe bhi jitna bana utna)
    assistant.content = "".join(parts)
    assistant.duration_ms = int((time.perf_counter() - start) * 1000)
    assistant.steps = assistant.steps or None
    assistant.sources = assistant.sources or None
    chat_store.add_message(chat.id, assistant)

    # 10. Audit log me record likho
    audit_store.add(AuditRecord(query=req.message, model=choice.name, tools=tools, error=assistant.error))

    if not stopped:
        yield {"type": "done", "durationMs": assistant.duration_ms}