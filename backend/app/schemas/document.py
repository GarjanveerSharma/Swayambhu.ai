from typing import Literal

from app.schemas.base import CamelModel


class DocumentOut(CamelModel):
    id: str
    name: str
    type: str
    size: int
    pages: int | None = None
    uploaded_at: str
    status: Literal["processing", "ready", "failed"]
    error: str | None = None


class DocumentPreview(CamelModel):
    text: str