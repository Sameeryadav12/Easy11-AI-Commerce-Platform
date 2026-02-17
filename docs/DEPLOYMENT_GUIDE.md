# Deployment Guide — Vercel, Render, Neon

This guide walks through deploying the **customer website** (Vite SPA on Vercel), the **backend API** (Render), and the **production database** (Neon PostgreSQL).

---

## Deployment diagram

```
┌─────────────────┐     HTTPS      ┌─────────────────┐     ┌─────────────────┐
│  Customer SPA   │ ──────────────► │  Backend API    │ ───►│  Neon Postgres  │
│  (Vercel)       │  VITE_API_URL  │  (Render)       │     │  (DATABASE_URL)  │
│  apps/web/      │                │  backend/       │     │                 │
│  frontend       │                │                │     │  Users, Orders,  │
└─────────────────┘                └─────────────────┘     │  Rewards,        │
                                                           │  SupportTickets  │
                                                           └─────────────────┘
```

---

## Phase 3 — Neon (production PostgreSQL)

1. **Create a Neon project**
   - Go to [neon.tech](https://neon.tech), sign up or log in.
   - Create a new project and database.

2. **Get the connection string**
   - In the Neon dashboard, copy the **connection string** (e.g. `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`).

3. **Store for production backend**
   - Use this as `DATABASE_URL` in Render (Phase 4). Do not commit it to the repo.

4. **Run migrations against Neon**
   - Locally, set `DATABASE_URL` to the Neon connection string, then from the **backend** folder:
   - `npx prisma migrate deploy`
   - This creates/updates tables: User, Order, OrderItem, Product, PointsLedgerEntry, RewardCoupon, Referral, Session, AuditLog, **SupportTicket**, etc.

5. **Verify**
   - In Neon’s SQL editor or via Prisma Studio: confirm tables exist and schema matches `backend/prisma/schema.prisma`.

---

## Phase 4 — Deploy backend to Render

1. **Create a Web Service**
   - [Render](https://render.com) → New → Web Service.
   - Connect your GitHub repo.

2. **Configure**
   - **Root directory:** `backend`
   - **Build command:** `npm install && npx prisma generate`
   - **Start command:** `npm run start` or `node dist/server.js` (depending on your `package.json` scripts; ensure Prisma generate runs in build).

3. **Environment variables** (in Render dashboard)
   - `DATABASE_URL` — Neon connection string
   - `JWT_ACCESS_SECRET` — strong secret for access tokens
   - `JWT_REFRESH_SECRET` — strong secret for refresh tokens (if used)
   - `FRONTEND_URL` — your Vercel app URL (e.g. `https://your-app.vercel.app`). For multiple origins use comma-separated values.
   - `NODE_ENV` = `production`

4. **After deploy**
   - Open `https://<your-service>.onrender.com/health` — should return `{"status":"healthy", ...}`.
   - Test: register, login, create order, list orders, create support ticket, rewards summary.

---

## Phase 5 — Deploy customer frontend to Vercel

1. **Create a Vercel project**
   - [Vercel](https://vercel.com) → Add New → Project → import your GitHub repo.

2. **Configure**
   - **Root directory:** `apps/web/frontend`
   - **Framework:** Vite (should be auto-detected)
   - **Build command:** `npm run build`
   - **Output directory:** `dist`

3. **Environment variable**
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com/api/v1`  
   - (No trailing slash.)

4. **Deploy**
   - Deploy. SPA routing is handled by `apps/web/frontend/vercel.json` (rewrites to `index.html`).

5. **Verify**
   - Visit `/`, `/account`, `/account/orders`, `/account/rewards` and refresh — no 404s.
   - End-to-end: sign up, log in, place order, see order after logout/login, submit support ticket, check rewards.

---

## Demo user flow (for recruiters)

1. **Open the live site** (Vercel URL).
2. **Register** — create an account (email + password).
3. **Browse** — open Products, add items to cart.
4. **Checkout** — complete shipping and payment; place order.
5. **My Orders** — go to Account → Orders; confirm the order appears.
6. **Rewards** — Account → Rewards; confirm points/tier from the order.
7. **Support** — Account → Support → create a ticket; confirm success.
8. **Persistence** — log out, log back in; orders and rewards should still be there.

---

## Notes

- **API cold starts:** On free-tier Render, the API may take a few seconds to wake on first request. The frontend shows a “Service temporarily unavailable” banner on 5xx/network errors; users can dismiss and retry.
- **Database:** Neon free tier is suitable for demo; use a strong `DATABASE_URL` and never commit it.
- **CORS:** Backend allows origins from `FRONTEND_URL` (single or comma-separated). Set this to your Vercel URL in production.

For runbooks and operations, see [docs/README.md](./README.md).
