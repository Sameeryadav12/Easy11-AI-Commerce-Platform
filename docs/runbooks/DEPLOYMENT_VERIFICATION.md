# Deployment Verification Checklist

Pre-flight
- Secrets present in vault; config injected; migrations planned.
- Rollout plan + rollback plan approved.

Smoke (post-deploy)
- Health checks green (API, Admin, Vendor, ML).
- RBAC and MFA enforced; login/logout and session expiry verified.
- Public APIs respond with correct headers; rate limits working.
- Webhooks register and deliver test event (HMAC verified).
- Insights/ESG endpoints respond with DP/suppression behavior.

Observability
- Logs flowing to aggregator; dashboards rendering; alerts armed.

Performance
- k6 script passes baseline SLOs (p95 < 300 ms core endpoints).

Compliance
- Evidence captured (screenshots/logs) and stored in control tracker.


