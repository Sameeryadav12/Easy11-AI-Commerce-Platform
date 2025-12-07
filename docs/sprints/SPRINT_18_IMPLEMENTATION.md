# Sprint 18 — Enterprise Integration & Partner APIs (Implementation)

**Delivery window:** 2025-11-16 → 2025-11-16  

## Delivered
- OAuth2.1-style token endpoint with scope middleware (`/api/oauth/token`, `lib/api-auth.ts`).
- REST v1 sample endpoints (`/api/v1/products`, `/api/v1/orders`) and OpenAPI JSON (`/api/v1/openapi.json`).
- GraphQL v1 with persisted queries only (`/api/v1/graphql`).
- Webhooks management: endpoints + deliveries and HMAC signature (`lib/webhooks.ts`, `/api/v1/webhooks/*`).
- Developer/Partner Portal module (dev): `/dev` with keys, logs, and docs pages.
- TypeScript SDK (`packages/sdk/easy11-sdk.ts`) and Postman collection (`docs/apis/Easy11.postman_collection.json`).

## How to use (dev)
1) Get a token: `POST /api/oauth/token` with `client_id`, `client_secret`, `org_id`, `scope`.
2) Call REST: `GET /api/v1/products` with `Authorization: Bearer <token>` and `X-Org-Id`.
3) Call GraphQL persisted: `POST /api/v1/graphql` with `{ "id": "getProductsV1" }`.
4) Register a webhook endpoint: `POST /api/v1/webhooks/endpoints` (requires `webhooks:manage` scope).
5) View deliveries: `GET /api/v1/webhooks/deliveries`.
6) Use Partner Portal at `/dev` to create keys and view docs/logs.

## Next (hardening & phase 2)
- Separate Partner Portal to its own host/app (dev.easy11.com), add org sandbox separation and usage metering.
- Add rate limits/quotas, token revocation, and mTLS option.
- Turn in-memory registries into Postgres/Kafka-backed services; AsyncAPI docs and replay UI.
- Reference connectors: complete flows and contract tests (Shopify, Shippo, NetSuite).


