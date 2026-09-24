import asyncio

from fastapi import APIRouter

from app.monitor.system import get_models, get_resources, get_services
from app.schemas.system import SystemStatus

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/status", response_model=SystemStatus)
async def system_status() -> SystemStatus:
    models, services, resources = await asyncio.gather(
        get_models(),
        get_services(),
        asyncio.to_thread(get_resources),
    )
    return SystemStatus(models=models, services=services, resources=resources)