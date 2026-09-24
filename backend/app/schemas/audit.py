from app.schemas.base import CamelModel


class AuditLogOut(CamelModel):
    id: str
    time: str
    query: str
    model: str
    tools: list[str]
    file: str | None = None
    error: str | None = None