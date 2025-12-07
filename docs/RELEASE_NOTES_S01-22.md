# Easy11 Release Notes — Sprints 01–22 (Dev Summary)

Highlights
- Admin Intelligence Platform with RBAC, audit trail, Ops Command Center.
- Personalization, Voice, AR try‑on (customer app).
- Vendor Portal (standalone) with dashboards and tools.
- Security: OAuth2.1 flows, scopes, rate limits, security headers, validation.
- Data/AI: Telemetry, anomalies, workflows, predictions, retail media, clean room, insights API.
- ESG: Carbon engine, certifications, ESG dashboards and APIs.
- Hardening: Observability, CI/CD security, DR/chaos/load testing docs.

Verification (dev)
- Start services (customer 5173, vendor 5174, admin 3001, ML 8000).
- Run `scripts/verify_dev.ps1` (Windows PowerShell) to smoke key endpoints.

Known Follow‑ups
- Move in‑memory stores to Postgres/Kafka; real OTel/Grafana wiring; WAF/mTLS/CDN; dbt/BigQuery; OCR verification; map visualizations; billing integrations; control tracker (Drata/Vanta).


