import os

from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    s = get_settings()
    return HealthResponse(
        status="ok",
        app_name=s.app_name,
        app_env=s.app_env,
        offline_mode=os.environ.get("HF_HUB_OFFLINE") == "1",
    )