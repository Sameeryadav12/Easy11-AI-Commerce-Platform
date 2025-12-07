## Easy11 Feature Store (Feast)

This directory contains the Feast configuration and feature definitions that back Sprint 14 AI services (recommendations, pricing, forecasting, intelligence).

### Structure
```
feature_store/
├── feature_store.yaml      # Core Feast project configuration
├── entities.py             # Entity definitions (user, product, vendor)
├── sources.py              # Offline data sources mapped to dbt outputs
├── feature_views/          # Feature view definitions grouped by domain
│   ├── __init__.py
│   ├── user_features.py
│   ├── product_features.py
│   └── vendor_features.py
└── data/                   # Placeholder for offline materialized datasets or registry
    └── .gitkeep
```

### Quickstart (local development)
1. Install dependencies (Feast + Postgres extras):
   ```bash
   pip install "feast[postgres]"==0.44.1
   ```
2. Export environment variables for offline/online stores (defaults usable for local Docker postgres):
   ```bash
   export FEAST_OFFLINE_HOST=localhost
   export FEAST_OFFLINE_PORT=5432
   export FEAST_OFFLINE_DATABASE=easy11_warehouse
   export FEAST_OFFLINE_SCHEMA=analytics
   export FEAST_OFFLINE_USER=feast
   export FEAST_OFFLINE_PASSWORD=feast
   # Online store can share the same Postgres or use Redis
   export FEAST_ONLINE_HOST=localhost
   export FEAST_ONLINE_PORT=5432
   export FEAST_ONLINE_DATABASE=easy11_online
   export FEAST_ONLINE_SCHEMA=feast_online
   export FEAST_ONLINE_USER=feast
   export FEAST_ONLINE_PASSWORD=feast
   ```
3. Materialize features (after dbt models are refreshed):
   ```bash
   feast apply
   feast materialize-incremental $(date +"%Y-%m-%d")
   ```

### Notes & Next Steps
- Offline store references dbt-produced tables (see `sources.py`). Update paths/schema names once analytics warehouse is finalized.
- Add additional feature views (pricing elasticity, churn propensity inputs) as Sprint 14 progresses.
- Integrate Prefect flows to call `feast materialize` after ETL completion.
- Configure Feast deployments (registry storage, S3 registry) in infrastructure-as-code once ECS environment is ready.

