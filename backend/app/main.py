"""
Backend ka entry point.
Chalane ke liye (backend folder se):
    uvicorn app.main:app --reload --reload-dir app --port 8000
"""
from app.core.offline import enforce_offline

enforce_offline()  # sabse pehle, kisi bhi AI library ke import se pehle

import asyncio  # noqa: E402
from contextlib import asynccontextmanager, suppress  # noqa: E402

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.responses import RedirectResponse  # noqa: E402

from app.api import audit, chat, chats, documents, health, network, system  # noqa: E402
from app.core.config import get_settings  # noqa: E402
from app.monitor.history import sampler_loop  # noqa: E402
from app.services.document_service import index_pending_documents  # noqa: E402

settings = get_settings()

# Storage folders bana do agar nahi hain
settings.uploads_dir.mkdir(parents=True, exist_ok=True)
settings.generated_dir.mkdir(parents=True, exist_ok=True)
settings.texts_dir.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Server start hote hi network sampler background me chalu
    task = asyncio.create_task(sampler_loop())
    # Purane documents jo search index me nahi hain, unhe background me index karo
    indexing = asyncio.create_task(asyncio.to_thread(index_pending_documents))
    try:
        yield
    finally:
        # Server band hote waqt sampler ko aaram se roko
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task
        indexing.cancel()
        with suppress(asyncio.CancelledError):
            await indexing


app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Naye routers yahan add karte jayenge
app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(network.router, prefix=settings.api_prefix)
app.include_router(system.router, prefix=settings.api_prefix)
app.include_router(chat.router, prefix=settings.api_prefix)
app.include_router(chats.router, prefix=settings.api_prefix)
app.include_router(audit.router, prefix=settings.api_prefix)
app.include_router(documents.router, prefix=settings.api_prefix)


@app.get("/", include_in_schema=False)
def root():
    # localhost:8000 kholne pe seedha API docs khul jaye
    return RedirectResponse(url="/docs")