"""
Chats ko storage/chats.json me save karta hai (server restart ke baad bhi bani rehti hain).
Baad me isi interface ke saath database lagayenge, baaki code nahi badlega.
"""
import json
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from threading import Lock

from app.core.config import get_settings


def now() -> datetime:
    return datetime.now(timezone.utc)


def new_id() -> str:
    return uuid.uuid4().hex[:12]


@dataclass
class Message:
    role: str
    content: str
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=now)
    attachments: list[dict] | None = None
    model: dict | None = None
    duration_ms: int | None = None
    steps: list[dict] | None = None
    sources: list[dict] | None = None
    files: list[dict] | None = None
    error: str | None = None


@dataclass
class Chat:
    title: str
    id: str = field(default_factory=new_id)
    updated_at: datetime = field(default_factory=now)
    messages: list[Message] = field(default_factory=list)


def _to_json(chat: Chat) -> dict:
    data = asdict(chat)
    data["updated_at"] = chat.updated_at.isoformat()
    for m in data["messages"]:
        m["created_at"] = m["created_at"].isoformat()
    return data


def _from_json(data: dict) -> Chat:
    messages = [
        Message(**{**m, "created_at": datetime.fromisoformat(m["created_at"])})
        for m in data.get("messages", [])
    ]
    return Chat(
        id=data["id"],
        title=data["title"],
        updated_at=datetime.fromisoformat(data["updated_at"]),
        messages=messages,
    )


class ChatStore:
    def __init__(self) -> None:
        self._path = get_settings().storage_dir / "chats.json"
        self._lock = Lock()
        self._chats: dict[str, Chat] = self._load()

    # ---------- disk ----------

    def _load(self) -> dict[str, Chat]:
        if not self._path.exists():
            return {}
        try:
            items = json.loads(self._path.read_text(encoding="utf-8"))
            return {c["id"]: _from_json(c) for c in items}
        except (OSError, ValueError, KeyError, TypeError):
            return {}  # file kharab ho to khali se shuru

    def _save(self) -> None:
        # Ye hamesha lock ke andar call hota hai
        self._path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self._path.with_suffix(".tmp")
        tmp.write_text(
            json.dumps([_to_json(c) for c in self._chats.values()], ensure_ascii=False),
            encoding="utf-8",
        )
        tmp.replace(self._path)

    # ---------- chats ----------

    def create(self, title: str) -> Chat:
        chat = Chat(title=title)
        with self._lock:
            self._chats[chat.id] = chat
            self._save()
        return chat

    def get(self, chat_id: str) -> Chat | None:
        return self._chats.get(chat_id)

    def list_all(self, query: str = "") -> list[Chat]:
        q = query.lower().strip()
        chats = [c for c in self._chats.values() if q in c.title.lower()]
        return sorted(chats, key=lambda c: c.updated_at, reverse=True)

    def add_message(self, chat_id: str, message: Message) -> None:
        with self._lock:
            chat = self._chats[chat_id]
            chat.messages.append(message)
            chat.updated_at = now()
            self._save()

    def rename(self, chat_id: str, title: str) -> bool:
        with self._lock:
            chat = self._chats.get(chat_id)
            if not chat:
                return False
            chat.title = title
            self._save()
        return True

    def delete(self, chat_id: str) -> bool:
        with self._lock:
            if self._chats.pop(chat_id, None) is None:
                return False
            self._save()
        return True


chat_store = ChatStore()