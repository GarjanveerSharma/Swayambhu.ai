"""
Upload save karna, aur background me: text nikalna -> tukde banana -> vectors banana -> Qdrant me save.
"""
from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.core.config import get_settings
from app.llm.client import LLMError
from app.llm.embeddings import embed_sync
from app.rag.chunker import chunk_pages
from app.rag.loaders import ALLOWED_EXTENSIONS, ExtractionError, extract_pages
from app.rag.vector_store import vector_store
from app.services.document_store import DocumentRecord, document_store

CHUNK = 1024 * 1024  # 1 MB


async def save_upload(file: UploadFile) -> DocumentRecord:
    s = get_settings()
    original = Path(file.filename or "file").name  # path wala hissa hatao (security)
    ext = Path(original).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise HTTPException(400, f"'{ext or 'unknown'}' type allowed nahi hai. Allowed: {allowed}")

    doc = DocumentRecord(name=original, type=ext.lstrip("."), size=0, stored_as="")
    doc.stored_as = f"{doc.id}{ext}"  # disk pe hamesha apna naam, user ka naam nahi
    dest = s.uploads_dir / doc.stored_as

    max_bytes = s.max_upload_mb * 1024 * 1024
    size = 0
    try:
        with dest.open("wb") as out:
            while chunk := await file.read(CHUNK):
                size += len(chunk)
                if size > max_bytes:
                    raise HTTPException(413, f"File {s.max_upload_mb} MB se badi hai.")
                out.write(chunk)
    except HTTPException:
        dest.unlink(missing_ok=True)
        raise

    if size == 0:
        dest.unlink(missing_ok=True)
        raise HTTPException(400, "File khali hai.")

    doc.size = size
    document_store.add(doc)
    return doc


def index_document(doc: DocumentRecord, pages: list[str]) -> None:
    """Tukde + vectors bana ke Qdrant me daalo. Purane vectors pehle hatao."""
    chunks = chunk_pages(pages)
    vectors = embed_sync([c.text for c in chunks])
    vector_store.delete_document(doc.id)
    vector_store.add(doc.id, doc.name, chunks, vectors)


def process_document(doc_id: str) -> None:
    """Background me chalta hai (FastAPI ise alag thread me chalata hai)."""
    doc = document_store.get(doc_id)
    if not doc:
        return
    try:
        pages = extract_pages(document_store.upload_path(doc))
        document_store.save_pages(doc_id, pages)
    except ExtractionError as exc:
        document_store.mark_failed(doc_id, str(exc))
        return
    except Exception as exc:  # koi bhi anjaan error
        document_store.mark_failed(doc_id, f"Processing failed: {exc}")
        return

    try:
        index_document(doc, pages)
        document_store.mark_ready(doc_id, len(pages), indexed=True)
    except LLMError as exc:
        # Text nikal gaya, par search ke liye index nahi hua
        document_store.mark_failed(doc_id, f"Search index nahi bana: {exc}")
    except Exception as exc:
        document_store.mark_failed(doc_id, f"Search index nahi bana: {exc}")


def index_pending_documents() -> None:
    """Server start pe: jo documents ready hain par index nahi hue, unhe index karo."""
    for doc in document_store.not_indexed():
        try:
            index_document(doc, document_store.get_pages(doc.id))
            document_store.mark_ready(doc.id, doc.pages or 0, indexed=True)
            print(f"[rag] indexed: {doc.name}")
        except Exception as exc:
            print(f"[rag] index failed for {doc.name}: {exc}")