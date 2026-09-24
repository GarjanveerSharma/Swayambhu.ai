"""
Audit log: har chat request ka record.
storage/audit.jsonl me har line ek JSON record hai (server restart ke baad bhi rehta hai).
"""
import json
from dataclasses import asdict, dataclass, field
from datetime import datetime
from threading import Lock

from app.core.config import get_settings
from app.services.chat_store import new_id

MAX_QUERY_CHARS = 500


def _now_local() -> str:
    # Local time (IST) me save, taaki date filter user ki date se match kare
    return datetime.now().astimezone().isoformat(timespec="seconds")


@dataclass
class AuditRecord:
    query: str
    model: str
    tools: list[str] = field(default_factory=list)
    file: str | None = None
    error: str | None = None
    id: str = field(default_factory=new_id)
    time: str = field(default_factory=_now_local)


class AuditStore:
    def __init__(self) -> None:
        self._path = get_settings().storage_dir / "audit.jsonl"
        self._lock = Lock()

    def add(self, record: AuditRecord) -> None:
        record.query = record.query[:MAX_QUERY_CHARS]
        line = json.dumps(asdict(record), ensure_ascii=False)
        with self._lock:
            self._path.parent.mkdir(parents=True, exist_ok=True)
            with self._path.open("a", encoding="utf-8") as f:
                f.write(line + "\n")

    def list(self, date_from: str | None = None, date_to: str | None = None) -> list[AuditRecord]:
        """date_from / date_to: 'YYYY-MM-DD' (dono shaamil)."""
        if not self._path.exists():
            return []
        records = []
        with self._path.open(encoding="utf-8") as f:
            for line in f:
                try:
                    r = AuditRecord(**json.loads(line))
                except (ValueError, TypeError):
                    continue  # kharab line chhod do
                day = r.time[:10]
                if date_from and day < date_from:
                    continue
                if date_to and day > date_to:
                    continue
                records.append(r)
        records.reverse()  # naye record upar
        return records


audit_store = AuditStore()