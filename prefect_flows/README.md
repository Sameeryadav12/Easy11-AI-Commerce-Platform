# Prefect Orchestration Flows

Automated workflows for ETL and ML operations.

## Flows

### ETL Flow
- **File**: `etl_flow.py`
- **Schedule**: Daily at 2 AM
- **Steps**: Extract → Validate → Transform → Load → **Feast Apply & Materialize** → Document
- **Dependencies**:
  - `dbt` CLI configured with `dbt_project/`
  - Feature store repo at `ml_service/feature_store/`
  - Environment variables for Feast Postgres offline/online store (see feature store README)

### ML Retrain Flow
- **File**: `ml_retrain.py`
- **Schedule**: Nightly at 3 AM
- **Steps**: Extract → Train → Register (MLflow) → Deploy
- **Dependencies**:
  - MLflow tracking server (set `MLFLOW_TRACKING_URI`)
  - Feature store connectivity (Feast registry created by ETL flow)

## Setup

```bash
pip install prefect "feast[postgres]"==0.44.1 mlflow

# Start Prefect server
prefect server start

# Run flow
python etl_flow.py    # runs ETL + Feast materialization
python ml_retrain.py  # trains models and logs to MLflow

# Deploy as scheduled job
prefect deployment build etl_flow.py:daily_etl_flow -n daily-etl
prefect deployment apply daily_etl_flow-deployment.yaml
```

## Monitoring

- Prefect UI: http://localhost:4200
- Dashboard for flow runs
- Schedule management
- Task retries and error handling
- Feast CLI logs (stored in Prefect task logs)
- MLflow UI for model metrics: http://localhost:5000 (default)

