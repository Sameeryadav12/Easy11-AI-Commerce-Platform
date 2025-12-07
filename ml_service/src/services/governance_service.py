"""
AI Governance Service
Provides model cards, drift monitoring summaries, and audit log snapshots.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List

import structlog

logger = structlog.get_logger(__name__)


class GovernanceService:
    """Static governance artefacts for Sprint 14."""

    def __init__(self) -> None:
        logger.info("Initialized GovernanceService")

    @staticmethod
    def get_model_cards() -> List[Dict[str, object]]:
        now = datetime.utcnow()
        return [
            {
                "model_id": "recommendation-hybrid",
                "name": "Recommendation Engine 2.0",
                "version": "v2.0.0",
                "owner": "ML Platform",
                "description": "Hybrid collaborative + content recommender with business guardrails.",
                "created_at": (now - timedelta(days=45)).isoformat() + "Z",
                "last_trained_at": (now - timedelta(days=6)).isoformat() + "Z",
                "training_data_window": "2024-02-01 → 2024-04-15",
                "features": ["user_behavior_metrics", "product_performance_metrics", "inventory_signals"],
                "metrics": {
                    "hit_rate_at_10": 0.27,
                    "map_at_10": 0.36,
                    "catalog_coverage": 0.82,
                    "diversity": 0.68,
                },
                "fairness_considerations": "Content filters remove prohibited categories. Excludes sensitive attributes.",
                "explainability_assets": {
                    "global_shap_url": "https://easy11-ml-assets/shap/recommendation_v2_global.json",
                    "last_regenerated_at": (now - timedelta(days=2)).isoformat() + "Z",
                },
                "notes": [
                    "Monitors opt-out rate for personalization.",
                    "Overrides logged with user, actor, reason.",
                ],
            },
            {
                "model_id": "pricing-hybrid",
                "name": "Pricing Intelligence Engine",
                "version": "pricing-hybrid-v1.2.0",
                "owner": "Revenue Science",
                "description": "Elasticity-aware pricing suggestions with inventory and fairness guardrails.",
                "created_at": (now - timedelta(days=32)).isoformat() + "Z",
                "last_trained_at": (now - timedelta(days=3)).isoformat() + "Z",
                "training_data_window": "2024-01-01 → 2024-04-20",
                "features": [
                    "conversion_rate",
                    "stock_velocity",
                    "return_rate",
                    "price_history",
                    "competitor_index",
                ],
                "metrics": {
                    "mape": 8.4,
                    "uplift_revenue_pct": 9.6,
                    "uplift_margin_pct": 6.8,
                },
                "fairness_considerations": "Enforces min margin, max discount, prohibits price hikes >15% per week.",
                "explainability_assets": {
                    "global_shap_url": "https://easy11-ml-assets/shap/pricing_v1_global.json",
                    "last_regenerated_at": (now - timedelta(days=1)).isoformat() + "Z",
                },
                "notes": [
                    "Vendor override requires MFA and audit log entry.",
                    "Auto-pauses if drift flag = critical for 2 consecutive intervals.",
                ],
            },
            {
                "model_id": "forecast-prophet",
                "name": "Demand Forecasting Ensemble",
                "version": "demand-forecast-v2.1.0",
                "owner": "Supply Analytics",
                "description": "Prophet + XGBoost ensemble predicting SKU demand with seasonality decomposition.",
                "created_at": (now - timedelta(days=58)).isoformat() + "Z",
                "last_trained_at": (now - timedelta(days=2)).isoformat() + "Z",
                "training_data_window": "2023-10-01 → 2024-04-18",
                "features": [
                    "daily_sales",
                    "promotional_events",
                    "inventory_levels",
                    "marketing_impressions",
                ],
                "metrics": {
                    "mape": 9.8,
                    "coverage_95pct": 0.93,
                    "rmse": 112.4,
                },
                "fairness_considerations": "No sensitive attributes; ensures regional mix to avoid bias.",
                "explainability_assets": {
                    "global_shap_url": "https://easy11-ml-assets/shap/forecast_v2_global.json",
                    "last_regenerated_at": (now - timedelta(days=3)).isoformat() + "Z",
                },
                "notes": [
                    "Alerts vendor when projected stock-out risk exceeds threshold.",
                    "Manual overrides logged in audit ledger with before/after values.",
                ],
            },
        ]

    @staticmethod
    def get_drift_status() -> List[Dict[str, object]]:
        now = datetime.utcnow()
        return [
            {
                "model_id": "recommendation-hybrid",
                "status": "healthy",
                "monitored_features": [
                    {"feature": "conversion_rate", "p_value": 0.41, "alert_level": "normal"},
                    {"feature": "rfm_score", "p_value": 0.36, "alert_level": "normal"},
                ],
                "last_evaluated_at": (now - timedelta(hours=6)).isoformat() + "Z",
            },
            {
                "model_id": "pricing-hybrid",
                "status": "warning",
                "monitored_features": [
                    {"feature": "stock_velocity", "p_value": 0.08, "alert_level": "warning"},
                    {"feature": "competitor_index", "p_value": 0.52, "alert_level": "normal"},
                ],
                "recommended_actions": [
                    "Review stock velocity inputs for affected categories (Home, Electronics).",
                    "Trigger manual sampling if warning persists 2 intervals.",
                ],
                "last_evaluated_at": (now - timedelta(hours=3)).isoformat() + "Z",
            },
            {
                "model_id": "forecast-prophet",
                "status": "healthy",
                "monitored_features": [
                    {"feature": "daily_sales", "p_value": 0.45, "alert_level": "normal"},
                    {"feature": "marketing_impressions", "p_value": 0.33, "alert_level": "normal"},
                ],
                "last_evaluated_at": (now - timedelta(hours=4)).isoformat() + "Z",
            },
        ]

    @staticmethod
    def get_audit_log(limit: int = 25) -> List[Dict[str, object]]:
        now = datetime.utcnow()
        entries = [
            {
                "timestamp": (now - timedelta(hours=2)).isoformat() + "Z",
                "model_id": "pricing-hybrid",
                "action": "override",
                "actor": "vendor_admin_482",
                "reason": "Seasonal promotion",
                "outcome": "approved",
                "details": {"product_id": "prod-smart-kitchen-08", "old_price": 549.0, "new_price": 529.0},
            },
            {
                "timestamp": (now - timedelta(hours=5)).isoformat() + "Z",
                "model_id": "recommendation-hybrid",
                "action": "feedback",
                "actor": "customer_9021",
                "reason": "Irrelevant recommendation",
                "outcome": "review_pending",
                "details": {"product_id": "prod-lux-home-04"},
            },
            {
                "timestamp": (now - timedelta(hours=9)).isoformat() + "Z",
                "model_id": "forecast-prophet",
                "action": "override",
                "actor": "supply_planner_14",
                "reason": "Marketing campaign uplift",
                "outcome": "approved",
                "details": {"sku": "sku-4832", "adjustment_pct": 12.5},
            },
            {
                "timestamp": (now - timedelta(hours=12)).isoformat() + "Z",
                "model_id": "pricing-hybrid",
                "action": "guardrail_triggered",
                "actor": "system",
                "reason": "Discount exceeded 30%",
                "outcome": "blocked",
                "details": {"product_id": "prod-active-07", "requested_discount_pct": 0.35},
            },
        ]
        return entries[:limit]


governance_service = GovernanceService()


