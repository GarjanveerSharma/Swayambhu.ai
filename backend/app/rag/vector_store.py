"""
Qdrant (local mode): vectors disk pe storage/qdrant me save hote hain.
Koi alag server ya Docker nahi chahiye. Baad me QDRANT_URL wale server pe shift kar sakte hain.
"""
import uuid
from threading import Lock

from qdrant_client import QdrantClient, models

from app.core.config import get_settings
from app.rag.chunker import Chunk

COLLECTION = "documents"


class VectorStore:
    def __init__(self) -> None:
        self._client: QdrantClient | None = None
        self._lock = Lock()  # local mode thread-safe nahi hai

    @property
    def client(self) -> QdrantClient:
        if self._client is None:
            path = get_settings().qdrant_dir
            path.mkdir(parents=True, exist_ok=True)
            self._client = QdrantClient(path=str(path))
        return self._client

    def _ensure_collection(self, dim: int) -> None:
        if not self.client.collection_exists(COLLECTION):
            self.client.create_collection(
                COLLECTION,
                vectors_config=models.VectorParams(size=dim, distance=models.Distance.COSINE),
            )

    def count(self) -> int:
        with self._lock:
            if not self.client.collection_exists(COLLECTION):
                return 0
            return self.client.count(COLLECTION).count

    def add(self, doc_id: str, file_name: str, chunks: list[Chunk], vectors: list[list[float]]) -> None:
        if not chunks:
            return
        points = [
            models.PointStruct(
                id=str(uuid.uuid4()),
                vector=vec,
                payload={"doc_id": doc_id, "file": file_name, "page": c.page, "text": c.text},
            )
            for c, vec in zip(chunks, vectors)
        ]
        with self._lock:
            self._ensure_collection(len(vectors[0]))
            self.client.upsert(COLLECTION, points=points)

    def delete_document(self, doc_id: str) -> None:
        with self._lock:
            if not self.client.collection_exists(COLLECTION):
                return
            self.client.delete(
                COLLECTION,
                points_selector=models.FilterSelector(
                    filter=models.Filter(
                        must=[models.FieldCondition(key="doc_id", match=models.MatchValue(value=doc_id))]
                    )
                ),
            )

    def search(self, vector: list[float], limit: int, min_score: float) -> list[dict]:
        with self._lock:
            if not self.client.collection_exists(COLLECTION):
                return []
            result = self.client.query_points(
                COLLECTION,
                query=vector,
                limit=limit,
                score_threshold=min_score,
                with_payload=True,
            )
        return [{**p.payload, "score": p.score} for p in result.points]


vector_store = VectorStore()