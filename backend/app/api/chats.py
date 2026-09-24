from dataclasses import asdict

from fastapi import APIRouter, HTTPException, Response

from app.schemas.chat import ChatOut, RenameChat
from app.services.chat_store import chat_store

router = APIRouter(prefix="/chats", tags=["chats"])


@router.get("", response_model=list[ChatOut], response_model_exclude_none=True)
def list_chats(q: str = "") -> list[ChatOut]:
        return [ChatOut(id=c.id, title=c.title, updated_at=c.updated_at) for c in chat_store.list_all(q)]


@router.get("/{chat_id}", response_model=ChatOut, response_model_exclude_none=True)
def get_chat(chat_id: str) -> ChatOut:
    chat = chat_store.get(chat_id)
    if not chat:
        raise HTTPException(404, "Chat nahi mili")
    return ChatOut(
        id=chat.id,
        title=chat.title,
        updated_at=chat.updated_at,
        messages=[asdict(m) for m in chat.messages],
    )


@router.patch("/{chat_id}", status_code=204)
def rename_chat(chat_id: str, body: RenameChat) -> Response:
    if not chat_store.rename(chat_id, body.title.strip()):
        raise HTTPException(404, "Chat nahi mili")
    return Response(status_code=204)


@router.delete("/{chat_id}", status_code=204)
def delete_chat(chat_id: str) -> Response:
    if not chat_store.delete(chat_id):
        raise HTTPException(404, "Chat nahi mili")
    return Response(status_code=204)