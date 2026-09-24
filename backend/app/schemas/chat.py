from datetime import datetime
from typing import Literal

from pydantic import Field

from app.schemas.base import CamelModel


class ChatRequest(CamelModel):
    # Frontend ye fields snake_case me bhejta hai (chat_id, use_knowledge),
    # populate_by_name=True ki wajah se dono naam chalenge
    chat_id: str | None = None
    message: str = Field(min_length=1, max_length=20000)
    mode: Literal["auto", "fast", "smart"] = "auto"
    attachment_ids: list[str] = []
    use_knowledge: bool = False


class ModelInfoLite(CamelModel):
    name: str
    reason: str


class Attachment(CamelModel):
    id: str
    name: str


class MessageOut(CamelModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime
    attachments: list[Attachment] | None = None
    model: ModelInfoLite | None = None
    duration_ms: int | None = None
    steps: list[dict] | None = None
    sources: list[dict] | None = None
    files: list[dict] | None = None
    error: str | None = None


class ChatOut(CamelModel):
    id: str
    title: str
    updated_at: datetime
    messages: list[MessageOut] | None = None


class RenameChat(CamelModel):
    title: str = Field(min_length=1, max_length=200)