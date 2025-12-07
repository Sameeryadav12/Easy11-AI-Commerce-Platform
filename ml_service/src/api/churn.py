"""
Churn Prediction API endpoints
Provides XGBoost-based customer churn predictions
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import structlog

from src.services.churn_service import ChurnService

router = APIRouter()
logger = structlog.get_logger(__name__)


class ChurnRequest(BaseModel):
    user_id: Optional[str] = None
    customer_features: Optional[dict] = None


class ChurnResponse(BaseModel):
    user_id: str
    churn_probability: float
    risk_level: str
    key_factors: List[dict]


# Initialize churn service
churn_service = ChurnService()


@router.post("/predict")
async def predict_churn(request: ChurnRequest):
    """
    Predict churn probability for a customer
    
    Args:
        user_id: User identifier (if available)
        customer_features: Dictionary of customer features
        
    Returns:
        Churn prediction with probability and risk level
    """
    try:
        logger.info("Predicting churn", user_id=request.user_id)
        
        if not request.user_id and not request.customer_features:
            raise HTTPException(
                status_code=400, 
                detail="Either user_id or customer_features must be provided"
            )
        
        prediction = await churn_service.predict(
            user_id=request.user_id,
            features=request.customer_features
        )
        
        return prediction
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Error predicting churn", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/batch")
async def predict_batch_churn(user_ids: List[str]):
    """
    Predict churn for multiple customers
    
    Args:
        user_ids: List of user identifiers
        
    Returns:
        Dictionary mapping user_id to churn predictions
    """
    try:
        logger.info("Batch churn prediction", count=len(user_ids))
        
        results = {}
        for user_id in user_ids:
            prediction = await churn_service.predict(user_id=user_id)
            results[user_id] = prediction
        
        return {"results": results}
        
    except Exception as e:
        logger.error("Error in batch churn prediction", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/at-risk")
async def get_at_risk_customers(limit: int = 100, threshold: float = 0.7):
    """
    Get list of at-risk customers
    
    Args:
        limit: Maximum number of customers to return
        threshold: Minimum churn probability threshold
        
    Returns:
        List of at-risk customers
    """
    try:
        logger.info("Getting at-risk customers", limit=limit, threshold=threshold)
        
        at_risk = await churn_service.get_at_risk_customers(
            limit=limit,
            threshold=threshold
        )
        
        return {
            "count": len(at_risk),
            "threshold": threshold,
            "customers": at_risk
        }
        
    except Exception as e:
        logger.error("Error getting at-risk customers", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/metrics")
async def get_churn_metrics():
    """
    Get churn model performance metrics
    
    Returns:
        Model metrics including AUC, accuracy, precision, recall
    """
    try:
        metrics = churn_service.get_metrics()
        return metrics
    except Exception as e:
        logger.error("Error getting churn metrics", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

