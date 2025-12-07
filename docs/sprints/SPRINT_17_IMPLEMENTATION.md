# Sprint 17 — Admin Automation & Predictive Operations AI (Implementation)

**Delivery window:** 2025-11-15 → 2025-11-16  
**Hours logged:** 18h (Telemetry 4h · Anomaly/Workflows 8h · Predictive/UX 4h · QA/Docs 2h)

---

## 1) Telemetry & Event Pipeline (MVP)
- Added ops ingestion API: `POST /api/ops/events` (CORS) with in-memory bus and SSE stream at `GET /api/ops/stream`.
- Customer and vendor apps emit heartbeats plus synthetic metrics (`latency_ms`, `error_rate_pct`) every few seconds.
- Admin Ops Command Center subscribes to the stream and renders live tiles.

## 2) Anomaly Detection Engine
- Rolling z-score detector (`lib/anomaly.ts`) with WARN/CRITICAL thresholds on numeric metrics.
- Critical anomalies auto-create workflow suggestions via mapping (latency → scale pods; error rate → purge cache).
- Alerts surface in Incident Timeline and Active Alerts chips.

## 3) Automated Workflow Engine
- In-memory workflow engine with create/simulate/approve/undo transitions and audit logging.
- API: `GET/POST /api/ops/workflows`, `POST /api/ops/workflows/:id/(simulate|approve|undo)`.
- Approvals Queue in Ops Command Center with live updates via SSE.

## 4) Predictive Ops Models (Stub)
- Outage Forecaster heuristic computing 24h risk from latency, error rate, and recent criticals.
- API: `POST /api/ops/predict` publishes predictions; UI panel shows risk % with factor contributions.

## 5) AI-Assisted Moderation & Approvals (Scaffold)
- Decision Cards store: records inputs/outputs/explanation for workflow suggestions and actions.
- API: `GET /api/ops/decisions` exposes latest decision cards for audit readiness.
- Ops UI shows Decision Cards panel (compact JSON view for now).

## 6) Ops Command Center UX
- New page `admin.easy11.com/dashboard/ops` with heartbeat, Incident Timeline, Predictions, Approvals Queue, Decision Cards.
- Dark theme compatible; live updates via SSE; actions wired to API.

## 7) Audit, Security, Explainability
- Every workflow event writes a hash-chained audit entry and a Decision Card (inputs/outputs).
- All endpoints CORS-enabled for local dev; to be restricted by domain + auth in production.

## 8) QA & Verification
- Verified all hosts live: Customer `:5173`, Vendor `:5174`, Admin `:3001`, ML service `:8000`.
- Observed anomalies and auto-created workflow suggestions; exercised Simulate/Approve/Undo.
- Confirmed predictions refresh ~20s and reflect changes in synthetic metrics.

## 9) Follow-ups / Risks
- Replace in-memory bus/stores with Kafka/Redis/Postgres; wire OTLP to OTel Collector; add Prometheus scrapes.
- Add real remediation integrations (HPA scale, cache purge, payout retry, ASR provider switch, ML retrain via MLflow).
- Hard-gate endpoints with admin auth, RBAC scopes, and rate-limits; add sandbox exec for actions.
- Expand decision cards to include model versions, confidence, and diffs for Undo.

---

✅ Sprint 17 is functionally complete in dev. The admin portal now ingests telemetry, detects anomalies, proposes workflows, supports approvals, and surfaces 24h outage risk with explainability. Production hardening and infra wiring are planned for Sprint 18.


