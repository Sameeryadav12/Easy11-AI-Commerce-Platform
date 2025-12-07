"""
Generative AI endpoints for marketing content.
"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import structlog

from src.services.content_service import content_service

router = APIRouter()
logger = structlog.get_logger(__name__)


class MarketingContentRequest(BaseModel):
    topic: str = Field(..., min_length=3, description="Campaign topic or theme")
    keywords: Optional[List[str]] = Field(default_factory=list)
    tone: str = Field("friendly", description="friendly | professional | playful | technical")
    length: str = Field("medium", description="short | medium | long")
    include_examples: bool = False
    target_audience: str = Field("customers", description="customers | vendors | general")


@router.post("/marketing/content")
async def generate_marketing_content(request: MarketingContentRequest):
    """
    Generate marketing long-form copy + multi-channel variations.
    """
    try:
        result = await content_service.generate_marketing_content(
            topic=request.topic,
            keywords=request.keywords or [],
            tone=request.tone,
            length=request.length,
            include_examples=request.include_examples,
            target_audience=request.target_audience,
        )
        return result
    except Exception as exc:  # pragma: no cover
        logger.error("Failed to generate marketing content", error=str(exc))
        raise HTTPException(status_code=500, detail="Unable to generate content at this time.")


