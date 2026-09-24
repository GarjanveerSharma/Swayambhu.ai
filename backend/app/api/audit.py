from dataclasses import asdict
from datetime import date

from fastapi import APIRouter, Query

from app.schemas.audit import AuditLogOut
from app.services.audit_store import audit_store

router = APIRouter(tags=["audit"])


@router.get("/audit", response_model=list[AuditLogOut], response_model_exclude_none=True)
def list_audit(
    date_from: date | None = Query(None, alias="from"),
    date_to: date | None = Query(None, alias="to"),
) -> list[AuditLogOut]:
    records = audit_store.list(
        date_from.isoformat() if date_from else None,
        date_to.isoformat() if date_to else None,
    )
    return [AuditLogOut(**asdict(r)) for r in records]