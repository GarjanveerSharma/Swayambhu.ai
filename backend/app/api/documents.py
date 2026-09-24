from dataclasses import asdict

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, Response, UploadFile

from app.schemas.document import DocumentOut, DocumentPreview
from app.services.document_service import process_document, save_upload
from app.services.document_store import document_store

router = APIRouter(tags=["documents"])

PREVIEW_CHARS = 20000


@router.post("/upload", response_model=DocumentOut, response_model_exclude_none=True)
async def upload(background: BackgroundTasks, file: UploadFile = File(...)) -> DocumentOut:
    doc = await save_upload(file)
    # Turant response do, text nikalna background me
    background.add_task(process_document, doc.id)
    return DocumentOut(**asdict(doc))


@router.get("/documents", response_model=list[DocumentOut], response_model_exclude_none=True)
def list_documents() -> list[DocumentOut]:
    return [DocumentOut(**asdict(d)) for d in document_store.list_all()]


@router.get("/documents/{doc_id}/preview", response_model=DocumentPreview)
def preview(doc_id: str) -> DocumentPreview:
    doc = document_store.get(doc_id)
    if not doc:
        raise HTTPException(404, "Document nahi mila")
    if doc.status != "ready":
        raise HTTPException(409, "Document abhi ready nahi hai")

    parts = [f"--- Page {i} ---\n{t.strip()}" for i, t in enumerate(document_store.get_pages(doc_id), 1)]
    text = "\n\n".join(parts)
    if len(text) > PREVIEW_CHARS:
        text = text[:PREVIEW_CHARS] + "\n\n… (baaki text preview me nahi dikhaya)"
    return DocumentPreview(text=text)


@router.delete("/documents/{doc_id}", status_code=204)
def delete_document(doc_id: str) -> Response:
    if not document_store.delete(doc_id):
        raise HTTPException(404, "Document nahi mila")
    return Response(status_code=204)