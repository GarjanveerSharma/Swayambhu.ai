from app.schemas.base import CamelModel


class HealthResponse(CamelModel):
    status: str
    app_name: str
    app_env: str
    offline_mode: bool