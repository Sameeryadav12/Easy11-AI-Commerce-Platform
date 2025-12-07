"""
AI Governance API
Exposes model cards, drift reports, and audit snapshots.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException
import structlog

from src.services.governance_service import governance_service

router = APIRouter()
logger = structlog.get_logger(__name__)


@router.get("/model-cards")
async def get_model_cards():
    """Return model cards with metadata and metrics."""
    try:
        return {
            "model_cards": governance_service.get_model_cards(),
        }
    except Exception as exc:  # pragma: no cover
        logger.error("Failed to retrieve model cards", error=str(exc))
        raise HTTPException(status_code=500, detail="Unable to load model cards.")


@router.get("/drift")
async def get_drift_status():
    """Return latest drift evaluation summary for monitored models."""
    try:
        return {
            "drift_status": governance_service.get_drift_status(),
        }
    except Exception as exc:  # pragma: no cover
        logger.error("Failed to retrieve drift status", error=str(exc))
        raise HTTPException(status_code=500, detail="Unable to load drift status.")


@router.get("/audit-log")
async def get_audit_log(limit: Optional[int] = 25):
    """Return recent audit log entries."""
    try:
        limit = min(max(limit or 25, 1), 100)
        return {
            "entries": governance_service.get_audit_log(limit=limit),
        }
    except Exception as exc:  # pragma: no cover
        logger.error("Failed to retrieve audit log", error=str(exc))
        raise HTTPException(status_code=500, detail="Unable to load audit log.")


