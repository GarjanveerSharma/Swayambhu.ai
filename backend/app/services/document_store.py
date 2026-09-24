"""
Documents ki jaankari storage/documents.json me rakhta hai
(server restart ke baad bhi bani rehti hai).
Nikala hua text storage/texts/<id>.json me page-wise save hota hai.
Baad me isi interface ke saath database lagayenge.
"""
import json
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from threading import Lock

from app.core.config import get_settings


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class DocumentRecord:
    name: str            # user ki file ka asli naam
    type: str            # pdf, docx, txt, png...
    size: int            # bytes
    stored_as: str       # disk pe file ka naam (<id>.<ext>)
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    pages: int | None = None
    status: str = "processing"   # processing | ready | failed
    error: str | None = None
    indexed: bool = False        # RAG search ke liye vectors bane ya nahi
    uploaded_at: str = field(default_factory=_now)


class DocumentStore:
    def __init__(self) -> None:
        s = get_settings()
        self._index_file = s.storage_dir / "documents.json"
        self._texts_dir = s.texts_dir
        self._uploads_dir = s.uploads_dir
        self._lock = Lock()
        self._docs: dict[str, DocumentRecord] = self._load()

    # ---------- disk ----------

    def _load(self) -> dict[str, DocumentRecord]:
        if not self._index_file.exists():
            return {}
        try:
            items = json.loads(self._index_file.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            return {}
        docs = {d["id"]: DocumentRecord(**d) for d in items}
        # Server beech me band hua tha to adhoori processing wale docs failed maano
        for d in docs.values():
            if d.status == "processing":
                d.status = "failed"
                d.error = "Processing ke beech server restart hua. File dobara upload karo."
        return docs

    def _save(self) -> None:
        self._index_file.parent.mkdir(parents=True, exist_ok=True)
        tmp = self._index_file.with_suffix(".tmp")
        tmp.write_text(
            json.dumps([asdict(d) for d in self._docs.values()], ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        tmp.replace(self._index_file)  # adhoori file kabhi na bane

    # ---------- records ----------

    def add(self, doc: DocumentRecord) -> None:
        with self._lock:
            self._docs[doc.id] = doc
            self._save()

    def get(self, doc_id: str) -> DocumentRecord | None:
        return self._docs.get(doc_id)

    def list_all(self) -> list[DocumentRecord]:
        return sorted(self._docs.values(), key=lambda d: d.uploaded_at, reverse=True)

    def mark_ready(self, doc_id: str, pages: int, indexed: bool) -> None:
        with self._lock:
            d = self._docs.get(doc_id)
            if d:
                d.status, d.pages, d.error, d.indexed = "ready", pages, None, indexed
                self._save()

    def not_indexed(self) -> list[DocumentRecord]:
        return [d for d in self._docs.values() if d.status == "ready" and not d.indexed]



    def mark_failed(self, doc_id: str, error: str) -> None:
        with self._lock:
            d = self._docs.get(doc_id)
            if d:
                d.status, d.error = "failed", error
                self._save()

    def delete(self, doc_id: str) -> bool:
        with self._lock:
            d = self._docs.pop(doc_id, None)
            if not d:
                return False
            self._save()
        (self._uploads_dir / d.stored_as).unlink(missing_ok=True)
        self.text_path(doc_id).unlink(missing_ok=True)
        return True

    # ---------- text ----------

    def upload_path(self, doc: DocumentRecord):
        return self._uploads_dir / doc.stored_as

    def text_path(self, doc_id: str):
        return self._texts_dir / f"{doc_id}.json"

    def save_pages(self, doc_id: str, pages: list[str]) -> None:
        self.text_path(doc_id).write_text(json.dumps(pages, ensure_ascii=False), encoding="utf-8")

    def get_pages(self, doc_id: str) -> list[str]:
        path = self.text_path(doc_id)
        if not path.exists():
            return []
        return json.loads(path.read_text(encoding="utf-8"))


document_store = DocumentStore()