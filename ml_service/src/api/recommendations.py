"""
Recommendation API endpoints
Provides ALS and LightFM-based product recommendations
"""

from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import structlog

from src.services.recommendation_service import RecommendationService

router = APIRouter()
logger = structlog.get_logger(__name__)


class RecommendationRequest(BaseModel):
    user_id: str
    limit: int = 10
    algo: str = "hybrid"  # "als", "lightfm", or "hybrid"


# Initialize recommendation service (in production, load from MLflow)
rec_service = RecommendationService()


@router.get("/")
async def get_recommendations(
    user_id: str,
    limit: int = 10,
    algo: str = "hybrid"
):
    """
    Get product recommendations for a user
    
    Args:
        user_id: User identifier
        limit: Number of recommendations (default: 10)
        algo: Algorithm to use ('als' or 'lightfm')
        
    Returns:
        List of recommended products with scores
    """
    try:
        logger.info("API: fetching recommendations", user_id=user_id, limit=limit, algo=algo)
        
        # Validate inputs
        if algo not in ["als", "lightfm", "hybrid"]:
            raise HTTPException(status_code=400, detail="Invalid algorithm. Use 'als', 'lightfm', or 'hybrid'")
        
        if limit < 1 or limit > 100:
            raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")
        
        # Get recommendations
        recommendations = await rec_service.get_recommendations(
            user_id=user_id,
            limit=limit,
            algorithm=algo
        )
        
        return {
            "user_id": user_id,
            "recommendations": recommendations,
            "algo": algo,
            "model_version": rec_service.get_model_version(algo),
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "metrics": rec_service.get_metrics(),
        }
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error("Error getting recommendations", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/batch")
async def get_batch_recommendations(
    user_ids: List[str],
    limit: int = 10,
    algo: str = "hybrid"
):
    """
    Get recommendations for multiple users in batch
    
    Args:
        user_ids: List of user identifiers
        limit: Number of recommendations per user
        algo: Algorithm to use
        
    Returns:
        Dictionary mapping user_id to recommendations
    """
    try:
        logger.info("API: batch recommendations", count=len(user_ids), algo=algo)

        if algo not in ["als", "lightfm", "hybrid"]:
            raise HTTPException(status_code=400, detail="Invalid algorithm. Use 'als', 'lightfm', or 'hybrid'")
        if limit < 1 or limit > 100:
            raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")
        
        results = {}
        for user_id in user_ids:
            recommendations = await rec_service.get_recommendations(
                user_id=user_id,
                limit=limit,
                algorithm=algo
            )
            results[user_id] = recommendations
        
        return {
            "results": results,
            "algo": algo,
            "model_version": rec_service.get_model_version(algo),
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }
        
    except Exception as e:
        logger.error("Error in batch recommendations", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/metrics")
async def get_recommendation_metrics():
    """
    Get recommendation model metrics
    
    Returns:
        Model performance metrics
    """
    try:
        metrics = rec_service.get_metrics()
        return metrics
    except Exception as e:
        logger.error("Error getting metrics", error=str(e))
        raise HTTPException(status_code=500, detail="Internal server error")

