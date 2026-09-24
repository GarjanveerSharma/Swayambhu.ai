from typing import Literal

from app.schemas.base import CamelModel


class ModelInfo(CamelModel):
    name: str
    role: Literal["fast", "reasoning", "vision", "embedding"]
    size: str
    status: Literal["loaded", "idle"]


class ServiceHealth(CamelModel):
    name: str
    up: bool


class ResourceUsage(CamelModel):
    ram_used_gb: float
    ram_total_gb: float
    gpu_used_gb: float
    gpu_total_gb: float


class SystemStatus(CamelModel):
    models: list[ModelInfo]
    services: list[ServiceHealth]
    resources: ResourceUsage