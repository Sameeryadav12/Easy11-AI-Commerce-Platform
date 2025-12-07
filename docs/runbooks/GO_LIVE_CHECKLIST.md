# Go-Live Checklist (Production)

Pre-Go-Live
- [ ] Domains and SSL/TLS (TLS 1.3) provisioned via CDN/WAF (Cloudflare/Akamai).
- [ ] OAuth/OIDC providers configured; MFA enforced; RBAC scopes verified.
- [ ] Secrets in Vault/KMS; rotation policy active; no plaintext in env.
- [ ] Postgres RLS and PII masking validated; backups enabled and tested.
- [ ] WAF rules (OWASP baseline, bot management, IP allowlists) deployed.
- [ ] Observability dashboards (latency, error rate, saturation) published; alerts to on-call.
- [ ] Canary deploy plan and automated rollback configured.

Cutover
- [ ] Health checks green across regions.
- [ ] Smoke tests pass on Admin, Vendor, Customer, ML services.
- [ ] Public APIs returning security headers; rate limits enforced.
- [ ] Webhooks sign/verify test event.
- [ ] Data exports respect DP thresholds; no PII leaks.

Post-Go-Live
- [ ] Error budget tracking enabled; SLOs visible.
- [ ] Pen-test window scheduled; bug bounty policy published (optional).
- [ ] Compliance evidence captured (screenshots, logs, configs).
- [ ] DR drill scheduled within 30 days.


