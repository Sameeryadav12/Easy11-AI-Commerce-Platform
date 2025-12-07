# Sprint 20 — Data Marketplace & Open Insights API (Plan)

Objectives
- Curate aggregated, privacy-safe datasets and expose them via a governed Insights API.
- Enforce differential privacy and k-anonymity thresholds for every response.
- Add partner access approvals, usage metering, and simple monetization tiers.

Deliverables (dev)
- Dataset catalog (metadata + tags) and DP middleware.
- REST Insights API: `/api/insights/datasets`, `/api/insights/query`, `/api/insights/trends`, `/api/insights/sustainability`.
- Partner access approvals (stub) and per-token usage counters.
- Admin portal pages for datasets and usage.
- Documentation + QA checklist.

Hosts
- Insights API (dev): http://localhost:3001
- Admin pages under `/dev/insights/*` for catalog & usage.


