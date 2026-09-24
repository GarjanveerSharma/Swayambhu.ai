"""
System ki halat batata hai:
- Ollama me kaunse models installed/loaded hain
- RAM aur GPU kitna use ho raha hai
- Services (Ollama, Qdrant, Postgres) chal rahi hain ya nahi
"""
import asyncio

import httpx
import psutil

from app.core.config import get_settings

TIMEOUT = 1.5  # seconds; koi service down ho to page atke nahi
GB = 1024**3


def _gb(n: int | float) -> float:
    return round(n / GB, 1)


def _same_model(a: str, b: str) -> bool:
    """'bge-m3' aur 'bge-m3:latest' ko same maano."""
    norm = lambda x: x if ":" in x else f"{x}:latest"  # noqa: E731
    return norm(a) == norm(b)


# ---------- Models ----------

async def _ollama_get(client: httpx.AsyncClient, path: str) -> list[dict]:
    try:
        r = await client.get(f"{get_settings().ollama_url}{path}")
        r.raise_for_status()
        return r.json().get("models", [])
    except (httpx.HTTPError, ValueError):
        return []


async def get_models() -> list[dict]:
    s = get_settings()
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        installed, running = await asyncio.gather(
            _ollama_get(client, "/api/tags"),   # disk pe installed
            _ollama_get(client, "/api/ps"),     # abhi memory me loaded
        )

    models = []
    for role, name in s.model_roles.items():
        info = next((m for m in installed if _same_model(m["name"], name)), None)
        loaded = any(_same_model(m["name"], name) for m in running)
        models.append({
            "name": name,
            "role": role,
            "size": f"{_gb(info['size'])} GB" if info else "not installed",
            "status": "loaded" if loaded else "idle",
        })
    return models


# ---------- Resources ----------

def _gpu_memory() -> tuple[float, float]:
    """NVIDIA GPU ki memory (used, total). GPU na ho to (0, 0)."""
    try:
        import pynvml

        pynvml.nvmlInit()
        try:
            used = total = 0
            for i in range(pynvml.nvmlDeviceGetCount()):
                mem = pynvml.nvmlDeviceGetMemoryInfo(pynvml.nvmlDeviceGetHandleByIndex(i))
                used += mem.used
                total += mem.total
            return _gb(used), _gb(total)
        finally:
            pynvml.nvmlShutdown()
    except Exception:
        return 0.0, 0.0


def get_resources() -> dict:
    ram = psutil.virtual_memory()
    gpu_used, gpu_total = _gpu_memory()
    return {
        "ram_used_gb": _gb(ram.total - ram.available),
        "ram_total_gb": _gb(ram.total),
        "gpu_used_gb": gpu_used,
        "gpu_total_gb": gpu_total,
    }


# ---------- Services ----------

async def _http_up(client: httpx.AsyncClient, url: str) -> bool:
    try:
        r = await client.get(url)
        return r.status_code < 500
    except httpx.HTTPError:
        return False


async def _tcp_up(host: str, port: int) -> bool:
    try:
        _, writer = await asyncio.wait_for(asyncio.open_connection(host, port), TIMEOUT)
        writer.close()
        await writer.wait_closed()
        return True
    except (OSError, asyncio.TimeoutError):
        return False


async def get_services() -> list[dict]:
    s = get_settings()
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        ollama, qdrant, postgres = await asyncio.gather(
            _http_up(client, f"{s.ollama_url}/api/version"),
            _http_up(client, f"{s.qdrant_url}/healthz"),
            _tcp_up(s.postgres_host, s.postgres_port),
        )
    return [
        {"name": "Backend", "up": True},  # ye code chal raha hai matlab backend up hai
        {"name": "Ollama", "up": ollama},
        {"name": "Qdrant", "up": qdrant},
        {"name": "Postgres", "up": postgres},
    ]