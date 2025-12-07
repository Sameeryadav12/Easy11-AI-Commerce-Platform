# Sprint 20 — Data Marketplace & Open Insights API (Implementation)

Delivery window: 2025-11-16 → 2025-11-16

Delivered (dev)
- Dataset Catalog: `lib/insights_catalog.ts` with curated datasets and metadata.
- DP Middleware: reused clean-room DP aggregation with suppression threshold.
- Insights API: `/api/insights/datasets`, `/api/insights/query`, `/api/insights/trends`, `/api/insights/sustainability`.
- Governance: approvals + usage metering (`/api/insights/access`).
- Admin Dev Portal: `/dev/insights` to browse datasets and run DP queries.
- SDK support: `Easy11SDK` now includes Insights helpers.

How to use
1) List datasets: `GET /api/insights/datasets`.
2) Query dataset (DP applied): `POST /api/insights/query` with `{ dataset, epsilon, threshold }`.
3) View trends/sustainability endpoints.
4) Approve partner and view usage: `GET/POST /api/insights/access`.
5) Dev UI: `http://localhost:3001/dev/insights`.

Next (prod hardening)
- Move datasets to dbt/BigQuery, enforce org-scoped OAuth scopes, add rate limits/quotas.
- Billing for data tiers; access logs to immutable storage; dataset versioning and changelog.


