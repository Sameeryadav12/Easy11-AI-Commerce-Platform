# Sprint 18 — Enterprise Integration & Partner APIs (Plan)

Scope: Public APIs (REST+GraphQL), secure webhooks, Partner Portal, SDKs, and reference integrations with OAuth2.1-style security and multi-tenant isolation.

Milestones
- Week 1: Gateway/Auth (OAuth2.1 mock, scopes, rate-limit placeholders, idempotency key handler)
- Week 2: REST v1 + OpenAPI 3.1 (catalog, inventory, orders, webhooks mgmt)
- Week 3: GraphQL v1 + persisted queries and cost limits
- Week 4: Webhooks (HMAC signing, retries, deliveries log) + Partner Portal basics
- Week 5: Reference connectors (Shopify importer, Shippo label, NetSuite order export)
- Week 6: QA/SLAs/Docs (status page stubs, quotas, certification checklist)

Environments/Hosts
- Partner Portal (dev): http://localhost:3002 (Next.js)
- Admin APIs (dev): http://localhost:3001 (Next API routes as gateway stand‑in)
- Customer/Vendor unaffected; emit events for observability

Security (dev scaffolding)
- OAuth2.1 token endpoint issues short‑lived JWT with org_id, partner_id, scopes
- Middleware validates Bearer token and enforces scope + tenant header `X-Org-Id`
- Webhook HMAC with `X-Easy11-Signature` + `X-Easy11-Timestamp`

Outputs (this sprint)
- OpenAPI served at `/v1/openapi.json`
- GraphQL endpoint at `/v1/graphql` (persisted queries dev mode)
- Webhooks mgmt at `/v1/webhooks/*` + deliveries log
- Partner Portal with keys (dev), logs, docs, and sandbox toggles


