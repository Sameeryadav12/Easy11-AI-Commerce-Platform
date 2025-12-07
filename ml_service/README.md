# ML Service - Easy11 Commerce Intelligence Platform

FastAPI microservice for ML models: recommendations, churn prediction, and forecasting.

## Setup

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Models

- **Recommendations**: ALS, LightFM
- **Churn Prediction**: XGBoost
- **Forecasting**: Prophet, XGBoost

## Features

- FastAPI with async support
- Feast feature store integration (hybrid collaborative/content features)
- MLflow experiment tracking
- Prefect orchestration ready flows (ETL + retraining)
- Recommendation API v2 with explainability metadata

## Coming Soon

Implementation pending.

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/recommendations` | Hybrid recommendations (ALS + LightFM + business rules) with explanation metadata |
| `POST` | `/api/v1/recommendations/batch` | Batch recommendations for multiple users |
| `GET` | `/api/v1/recommendations/metrics` | Current model performance metrics |
| `POST` | `/api/v1/pricing/recommendation` | AI-assisted price recommendation with guardrails and scenarios |
| `POST` | `/api/v1/pricing/bulk` | Bulk pricing suggestions for multiple products |
| `POST` | `/api/v1/pricing/simulate-discount` | Discount/markup simulation returning demand & margin deltas |
| `GET` | `/api/v1/pricing/metrics` | Pricing model health metrics |
| `GET` | `/api/v1/forecast/metrics` | Forecasting model metrics |
| `POST` | `/api/v1/forecast/demand` | Demand forecasting (Prophet / XGBoost hybrid) |
| `GET` | `/api/v1/forecast/trends` | Trend insights & seasonality summary |
| `POST` | `/api/v1/generative/marketing/content` | Long-form campaign copy + multi-channel variations |
| `GET` | `/api/v1/governance/model-cards` | Model cards with metrics, fairness considerations, and explainability assets |
| `GET` | `/api/v1/governance/drift` | Latest drift evaluation summary for monitored models |
| `GET` | `/api/v1/governance/audit-log` | Recent audit log entries for model overrides and guardrail events |

