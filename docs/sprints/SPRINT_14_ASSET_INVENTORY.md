## Sprint 14 — Asset Inventory & Gap Analysis

### 1. Scope
Inventory existing repositories and services that support the AI ecosystem work (Sprint 14) and highlight immediate gaps before we implement new infrastructure.

### 2. Summary Table
| Domain | Existing Artifacts | Status | Gaps / Follow‑ups |
|--------|-------------------|--------|-------------------|
| ML Service (`ml_service/`) | FastAPI app with recommendation, churn, forecasting routers; service skeletons return mock data; structured logging. | ✅ Base scaffolding present | 🚧 No real model loading, no MLflow integration, no feature store connectivity, no auth/observability wiring. |
| Prefect Orchestration (`prefect_flows/`) | `daily_etl_flow` + `ml_retrain_flow` with placeholder tasks and CLI integrations (dbt, Great Expectations). | ✅ Flow definitions exist | 🚧 Lacks deployment manifests, block registrations, feature store materialization steps, drift monitoring tasks. |
| dbt Project (`dbt_project/`) | Staging/intermediate/mart models for orders, products, customers; macros; tests scaffold. | ✅ Core ecommerce warehouse models available | 🚧 No analytics schema for AI (feature views, fact interactions, forecast outputs); metrics not tied to Feast feature store. |
| Monitoring / Governance | Structlog logging within ML service. | ⚠️ Partial | 🚧 No Evidently, Prometheus exporters, model cards, or audit ledger tables yet. |
| Feature Store | — | ❌ Missing | Need Feast repo (feature view definitions, offline/online stores). |
| Deployment & Infra | Dockerfiles for `ml_service`; Terraform/ECS not yet updated. | ⚠️ Partial | Need ECS task definitions for new services, S3 buckets, secret store entries, CI/CD hooks. |

### 3. Detailed Notes
#### 3.1 `ml_service/`
- `src/main.py` bootstraps FastAPI with CORS and router registration.
- Routers (`api/recommendations.py`, `api/churn.py`, `api/forecasting.py`) expose endpoints but call services with mock outputs.
- Services under `src/services/` log requests and return placeholder responses; no asynchronous model loading, batch endpoints, or caching implemented.
- No integration with MLflow, Feast, or Prefect; `requirements.txt` references core libraries but not Feast/Evidently.

#### 3.2 `prefect_flows/`
- `etl_flow.py` orchestrates extract → validate → dbt → docs; assumes CLI tools installed locally; no feature materialization.
- `ml_retrain.py` simulates training and deployment; lacks actual model training scripts, MLflow registration APIs, or deployment hooks.
- No parameterization, infrastructure blocks, storage options, or deployment YAML files recorded.

#### 3.3 `dbt_project/`
- Contains staging (`stg_orders`, `stg_order_items`, etc.), intermediate (`int_order_revenue`, `int_customer_rfm`), and mart models (`fact_orders`, `cohort_analysis`, `product_performance`).
- Useful base for Feast feature definitions (RFM scores, order revenue, cohort retention).
- Missing analytics models for:
  - Recommendation interactions (user × product events).
  - Pricing elasticity features (price histories, competitor data).
  - Forecast outputs (SKU daily demand baseline).

### 4. Immediate Next Steps
1. **Create Feast repo** (`ml_service/feature_store/`) with initial `feature_store.yaml`, offline store config pointing to dbt models, and placeholder feature views.
2. **Extend Prefect flows** to include feature materialization and drift checks; register flows using Prefect deployments.
3. **Wire MLflow**: add tracking URI/env vars, register models from services, and update retrain flow to log metrics/artifacts.
4. **Design monitoring stack**: choose Prometheus/Grafana setup, add health endpoints, and plan Evidently jobs.
5. **Coordinate with backend** for service tokens and audit ledger schema (`ai_audit_logs`, `model_predictions`, etc.).

This inventory provides the baseline for building Sprint 14 capabilities step by step.

