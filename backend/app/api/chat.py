import json

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest
from app.services.chat_service import run_chat

router = APIRouter(tags=["chat"])


@router.post("/chat")
async def chat(req: ChatRequest, request: Request) -> StreamingResponse:
    """
    Server-Sent Events: har event ek line, "data: {json}" format me.
    """

    async def event_stream():
        async for event in run_chat(req, request.is_disconnected):
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )