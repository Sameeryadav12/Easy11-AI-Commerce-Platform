"""
Pricing API endpoints
Provides per-product and bulk pricing recommendations plus scenario simulations.
"""

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import structlog

from src.services.pricing_service import PricingService

router = APIRouter()
logger = structlog.get_logger(__name__)


class PriceRecommendationRequest(BaseModel):
    product_id: str = Field(..., description="Product identifier")
    current_price: float = Field(..., gt=0)
    cost_price: Optional[float] = Field(None, gt=0)
    vendor_id: Optional[str] = None
    strategy: str = Field("balanced", description="balanced | growth | margin")
    currency: str = Field("USD")


class BulkPriceItem(BaseModel):
    product_id: str
    current_price: float
    cost_price: Optional[float] = None
    strategy: Optional[str] = None
    currency: Optional[str] = None


class BulkPriceRecommendationRequest(BaseModel):
    vendor_id: Optional[str] = None
    items: List[BulkPriceItem]
    strategy: str = Field("balanced", description="Default strategy for items missing one")


class DiscountSimulationRequest(BaseModel):
    product_id: str
    base_price: float
    cost_price: float
    discount_pct: float = Field(..., description="Positive for discount, negative for markup")
    strategy: str = Field("balanced")


pricing_service = PricingService()


@router.post("/recommendation")
async def get_price_recommendation(request: PriceRecommendationRequest):
    try:
        logger.info(
            "Calculating price recommendation",
            product_id=request.product_id,
            strategy=request.strategy,
        )
        rec = await pricing_service.recommend_price(
            product_id=request.product_id,
            current_price=request.current_price,
            cost_price=request.cost_price,
            vendor_id=request.vendor_id,
            strategy=request.strategy,
            currency=request.currency,
        )
        return rec
    except Exception as exc:  # pragma: no cover
        logger.error("Price recommendation failed", error=str(exc))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/bulk")
async def get_bulk_recommendations(request: BulkPriceRecommendationRequest):
    if not request.items:
        raise HTTPException(status_code=400, detail="At least one item is required")
    try:
        logger.info(
            "Calculating bulk pricing recommendations",
            count=len(request.items),
            vendor_id=request.vendor_id,
        )
        result = await pricing_service.bulk_recommendations(
            [item.dict() for item in request.items],
            vendor_id=request.vendor_id,
            strategy=request.strategy,
        )
        return result
    except Exception as exc:  # pragma: no cover
        logger.error("Bulk pricing failed", error=str(exc))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/simulate-discount")
async def simulate_discount(request: DiscountSimulationRequest):
    try:
        logger.info("Simulating discount scenario", product_id=request.product_id, discount_pct=request.discount_pct)
        result = await pricing_service.simulate_discount(
            product_id=request.product_id,
            base_price=request.base_price,
            cost_price=request.cost_price,
            discount_pct=request.discount_pct,
            strategy=request.strategy,
        )
        return result
    except Exception as exc:  # pragma: no cover
        logger.error("Discount simulation failed", error=str(exc))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/metrics")
async def get_pricing_metrics():
    try:
        return pricing_service.get_metrics()
    except Exception as exc:  # pragma: no cover
        logger.error("Unable to fetch pricing metrics", error=str(exc))
        raise HTTPException(status_code=500, detail="Internal server error")


