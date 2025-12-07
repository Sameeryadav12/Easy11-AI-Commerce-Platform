# Sprint 17 — Admin Automation & Predictive Operations AI (Plan)

**Delivery window:** 2025-11-15 → 2025-12-26 (6-week program)  
**Goal:** Convert the Sprint 16 admin foundation into a self-healing, prediction-driven operations layer that prevents, detects, and auto-resolves issues across Easy11’s business surfaces while preserving auditability.

---

## 1. Objectives & Success Criteria
- Unify telemetry from customer, vendor, API, ML, and infra services into a governed event pipeline (Kafka `events_ops`, Prometheus, Loki, OpenTelemetry Collector).
- Ship an anomaly detection engine (LSTM autoencoder, Isolation Forest, streaming rule sets, Evidently drift monitors) that emits explainable alerts with root-cause context.
- Stand up an automated workflow engine (Prefect/Camunda + `/ops/workflows` API) capable of taking remediation actions with sandbox, simulate, undo, and approval paths.
- Deliver predictive ops models (outage forecaster, incident risk triage, cost optimizer, SLA predictor) powering proactive recommendations.
- Layer AI-assisted moderation/approvals (LLM + vision guardrails) so lower-severity tickets resolve in <5 minutes automatically while humans stay in control.
- Build the Ops Command Center UX (dark theme, electric accents, motion cues, health map, automation feed, approvals queue) with WCAG AA compliance.
- Ensure all automation remains hash-chained, explainable, and reversible with SOC2/ISO controls mapped.

**Success =**
- ≥90% of low-impact incidents auto-resolve within 5 minutes.
- All alerts include root-cause graphs + explainability cards.
- Predictive scores drive at least two remediation simulations before incidents occur.
- Every action/decision is logged, signed, and reviewable end-to-end.

---

## 2. Architecture Blueprint

### 2.1 Telemetry & Event Fabric
- **Ingest:** Customer + vendor portals (Vite React), admin portal (Next.js), gateways, ML service, and infra agents emit OpenTelemetry traces, Loki logs, Prometheus metrics, and Kafka business events (`events_ops` topic).
- **Collector tier:** OpenTelemetry Collector normalizes spans → Tempo; Loki handles structured app logs; Prometheus scrapes infra/ML metrics; Kafka feeds land in Feature Store + Ops DB.
- **Ops data model:** Events tagged by service, tenant, region, severity, timestamp. Stored in PostgreSQL (ops schema) + BigQuery warehouse for long-term analytics.

### 2.2 Anomaly & Predictive Layer
- **Time-series:** LSTM autoencoder (PyTorch) for traffic/latency anomalies.
- **Probabilistic:** Isolation Forest for financial/security outliers.
- **Streaming rules:** E-S-R rule engine + Z-score thresholds on Kafka stream.
- **Drift:** Evidently AI watchers on model IO plus MLflow metadata.
- **Predictive models:** Outage forecaster, incident risk classifier, cost optimizer, SLA predictor consuming feature store snapshots.

### 2.3 Workflow + Automation
- **Engine:** Prefect orchestration + Camunda BPMN for approvals.
- **Actions:** Scale pods, purge cache, retry payouts, switch ASR vendor, trigger ML retrain, freeze models, notify finance/support, open Jira/Slack tickets.
- **Governance:** Impact tiers (info, warn, critical). Critical actions require approval/undo flow; lower tiers can auto-execute but must snapshot before/after state.

### 2.4 Ops Command Center UX
- Micro-frontend module under `ops` section at `admin.easy11.com/dashboard/ops` plus dedicated vendor portal surfacing vendor health signals.
- Health map (service × region) with animated heartbeat indicator.
- Incident timeline overlaying forecast curve + automation feed.
- Tabs: Anomalies, Workflows, AI Models, System Costs vs Budget, Approvals, Audit.
- “Simulate Resolution” sandbox with Framer Motion transitions.

### 2.5 Audit & Security
- Hash-chained audit log extends `lib/audit.ts` with action signatures, actor/system IDs, approval tokens.
- Decision cards persist AI inputs/outputs for explainability + SOC2 evidence.
- Auto-actions respect rate limits, sandbox execution, and row-level security.
- MFA step-up for override approvals; SSO tokens scoped with workflow claims.

---

## 3. Work Breakdown & Milestones

| Week | Focus | Key Deliverables |
| --- | --- | --- |
| 1 | Telemetry integration | OTel collector config, Kafka `events_ops`, Prometheus/Grafana dashboards, schema registry for ops events |
| 2 | Anomaly engine MVP | LSTM autoencoder pipeline, Isolation Forest batch job, streaming rule service, alert schema with explainability metadata |
| 3 | Workflow automation | Prefect/Camunda scaffolding, `/ops/workflows` API, auto-remediation playbooks (latency, payouts, ASR failover, model drift), UI feed |
| 4 | Predictive models | Outage forecaster, incident risk classifier, cost optimizer, SLA predictor plus scheduling + evaluation harness |
| 5 | AI moderation assistant | LLM + CLIP moderation services, approval assistant UI, explainability cards, guardrails + prompt policies |
| 6 | QA, security, pen-test | Automated tests (unit/e2e), performance telemetry (<60s alert→action), accessibility + failover validation, release docs |

---

## 4. Environment & Hosting
- **Customer portal:** `http://localhost:5173` (Vite dev) → deploy `store.easy11.com` in prod.
- **Vendor portal:** `http://localhost:5174` dedicated Vite app → `vendor.easy11.com` host.
- **Admin portal:** `http://localhost:3001` Next.js SSR → `admin.easy11.com` host.
- **ML/AI services:** FastAPI on `http://localhost:8000`, backing anomaly + predictive workloads.
- Each service exposes `/healthz` for telemetry scrapers; event emitters configured with service tags for multi-tenant governance.

---

## 5. Dependencies & Risks
- Kafka, Prometheus, Loki, Grafana, Prefect/Camunda, MLflow availability (ensure Docker compose or managed services ready).
- LLM/vision moderation relies on GPT-4 Turbo + CLIP—secure API keys, budget guardrails.
- Need sandboxed execution + rate limits to prevent runaway automation.
- Accurate incident labeling history required to train predictive classifiers—backfill from historical logs.
- Accessibility and real-time updates must remain performant (≤2s refresh); watch for over-fetching in dashboard.

---

## 6. Next Actions (Sprint Kickoff)
1. Validate telemetry emitters exist in customer/vendor/admin apps and API gateways; add OpenTelemetry SDK where missing.
2. Provision Kafka topic + schema registry; define ops event protobuf/JSON schema.
3. Scaffold Ops Command Center route in admin portal with placeholder tiles + heartbeat indicator.
4. Draft remediation playbooks + approval thresholds with stakeholders.
5. Schedule security review for automation guardrails + audit hashing extensions.

Sprint 17 execution will proceed feature-by-feature, keeping all three web properties and supporting services (ML, telemetry) running independently on their own hosts throughout development.


