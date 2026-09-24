"""
Sawaal ke liye sabse relevant document tukde dhundhna.
"""
import asyncio

from app.core.config import get_settings
from app.llm.embeddings import embed_query
from app.rag.vector_store import vector_store
from app.services.document_store import document_store


async def search_documents(query: str) -> list[dict]:
    """
    Returns: [{"docId", "file", "page", "text", "score"}, ...] (best pehle)
    """
    s = get_settings()
    if await asyncio.to_thread(vector_store.count) == 0:
        return []  # koi document index nahi hai, embedding ka time bachao

    vector = await embed_query(query)
    hits = await asyncio.to_thread(vector_store.search, vector, s.rag_top_k, s.rag_min_score)

    results = []
    for h in hits:
        if document_store.get(h["doc_id"]) is None:
            continue  # document delete ho chuka hai
        results.append(
            {"docId": h["doc_id"], "file": h["file"], "page": h["page"], "text": h["text"], "score": h["score"]}
        )
    return results