# Deployment Target (Phase 0)

**Customer website** must be deployable as a **Vite SPA on Vercel**.

**Customer website** must talk to a **production API** base URL via an environment variable (`VITE_API_URL`), not hardcoded localhost.

**Production API** must be deployed and **publicly reachable** (e.g. **Render** Web Service).

**Production database** must be **hosted** (e.g. **Neon** PostgreSQL) so users and orders persist across sessions.

---

| Component        | Target        | Purpose                          |
|-----------------|---------------|----------------------------------|
| Customer frontend | **Vercel**    | Vite SPA, serverless             |
| Backend API      | **Render**    | Public HTTPS API                 |
| Database        | **Neon**      | PostgreSQL for users/orders/rewards/support |

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step Neon, Render, and Vercel setup and Phase 1–6 implementation.
