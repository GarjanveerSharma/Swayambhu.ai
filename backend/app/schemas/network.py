from app.schemas.base import CamelModel


class ConnectionOut(CamelModel):
    local: str
    remote: str
    process: str
    internal: bool


class HistoryPoint(CamelModel):
    time: str
    outbound: int


class NetworkStatus(CamelModel):
    outbound: int
    air_gapped: bool
    connections: list[ConnectionOut]
    history: list[HistoryPoint]