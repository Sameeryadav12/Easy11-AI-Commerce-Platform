"""
Forecasting API endpoints
Provides Prophet and XGBoost-based demand forecasting
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import structlog
from datetime import datetime

from src.services.forecasting_service import ForecastingService

router = APIRouter()
logger = structlog.get_logger(__name__)


class ForecastRequest(BaseModel):
    horizon: int = 30  # Days to forecast
    algo: str = "prophet"  # "prophet" or "xgboost"


class ForecastResponse(BaseModel):
    forecast: List[dict]
    algo: str
    horizon: int
    confidence_intervals: Optional[List[dict]] = None


# Initialize forecasting service
forecast_service = ForecastingService()


@router.post("/demand")
async def forecast_demand(request: ForecastRequest):
    """
    Forecast demand for products
    
    Args:
        horizon: Number of days to forecast (default: 30)
        algo: Algorithm to use ('prophet' or 'xgboost')
        
    Returns:
        Demand forecast with dates and predicted values
    """
    try:
        logger.info("Forecasting demand", horizon=request.horizon, algo=request.algo)
        
        # Validate inputs
        if request.horizon < 1 or request.horizon > 365:
            raise HTTPException(
                status_code=400,
                detail="Horizon must be between 1 and 365 days"
            )
        
        if request.algo not in ["prophet", "xgboost"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid algorithm. Use 'prophet' or 'xgboost'"
            )
        
        forecast = await forecast_service.forecast_demand(
            horizon=request.horizon,
            algorithm=request.algo
        )
        
        return forecast
        
    except Exception as e:
        logger.error("Error forecasting demand", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/product/{product_id}")
async def forecast_product(product_id: str, request: ForecastRequest):
    """
    Forecast demand for a specific product
    
    Args:
        product_id: Product identifier
        horizon: Number of days to forecast
        algo: Algorithm to use
        
    Returns:
        Product-specific demand forecast
    """
    try:
        logger.info("Forecasting product demand", product_id=product_id, horizon=request.horizon)
        
        forecast = await forecast_service.forecast_product(
            product_id=product_id,
            horizon=request.horizon,
            algorithm=request.algo
        )
        
        return forecast
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Error forecasting product", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/trends")
async def get_trends(period: str = "30d"):
    """
    Get demand trends and patterns
    
    Args:
        period: Time period ('7d', '30d', '90d', '1y')
        
    Returns:
        Trend analysis with patterns and seasonality
    """
    try:
        logger.info("Getting demand trends", period=period)
        
        trends = await forecast_service.get_trends(period=period)
        
        return trends
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Error getting trends", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/metrics")
async def get_forecast_metrics():
    """
    Get forecasting model performance metrics
    
    Returns:
        Model metrics including MAPE, RMSE, sMAPE
    """
    try:
        metrics = forecast_service.get_metrics()
        return metrics
    except Exception as e:
        logger.error("Error getting forecast metrics", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

