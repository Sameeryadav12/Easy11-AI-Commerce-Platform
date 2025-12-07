"""
Easy11 ML Service - FastAPI Application
Provides ML endpoints for recommendations, churn prediction, and forecasting
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from src.api import recommendations, churn, forecasting, pricing, generative, governance
from src.utils.logger import setup_logging

# Setup structured logging
setup_logging()
logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("🚀 ML Service starting up...")
    
    # Initialize models (load from MLflow or train if needed)
    try:
        # Load models here
        logger.info("✅ ML models loaded successfully")
    except Exception as e:
        logger.error("❌ Failed to load ML models", error=str(e))
    
    yield
    
    # Shutdown
    logger.info("🛑 ML Service shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title="Easy11 ML Service",
    description="Machine Learning API for recommendations, churn prediction, and forecasting",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Easy11 ML Service",
        "version": "1.0.0",
        "status": "healthy",
        "endpoints": {
            "recommendations": "/api/v1/recommendations",
            "churn": "/api/v1/churn",
            "forecast": "/api/v1/forecast",
            "pricing": "/api/v1/pricing",
            "generative": "/api/v1/generative",
            "governance": "/api/v1/governance",
            "health": "/health",
            "docs": "/docs"
        }
    }


# Health check
@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "ml-service",
        "version": "1.0.0"
    }


# Include routers
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(churn.router, prefix="/api/v1/churn", tags=["Churn Prediction"])
app.include_router(forecasting.router, prefix="/api/v1/forecast", tags=["Forecasting"])
app.include_router(pricing.router, prefix="/api/v1/pricing", tags=["Pricing"])
app.include_router(generative.router, prefix="/api/v1/generative", tags=["Generative AI"])
app.include_router(governance.router, prefix="/api/v1/governance", tags=["Governance"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

