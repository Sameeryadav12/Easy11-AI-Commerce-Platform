# SOC 2 / ISO 27001 Readiness Summary (Dev)

Controls Implemented (in-repo)
- Access: RBAC, session enforcement, route-level middleware, per-endpoint throttles.
- AppSec: Zod input validation, security headers, basic CSP; dependency scanning guidance.
- Logging/Monitoring: Structured JSON logs, OTel hooks, observability runbook.
- DR: Documented plan and incident playbooks.
- Change Management: CI/CD security checklist and deployment gates.

Controls Tracked (infra/ops)
- WAF/DDoS, mTLS at gateway, secrets vaulting/rotation, multi-region HA, backups and drills.
- Automated evidence via Drata/Vanta (access logs, vulnerability scans, training).

Readiness
- SOC 2 Type 1: configuration and policy set prepared.
- SOC 2 Type 2: begin 90‑day monitoring window post‑cutover.
- ISO 27001: policy pack and risk register scaffolds in place; assign owners and finalize SoA.


