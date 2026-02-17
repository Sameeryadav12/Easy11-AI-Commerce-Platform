# Easy11 — What We’ve Built So Far (and Why)

This document summarizes the current state of the Easy11 project: what exists today, why it was built that way, and what tools/technologies are being used.

> Status: **Active development & testing** (features are being stabilized and polished).

---

## 1) What the project is (goal)

Easy11 is a full‑stack **AI‑commerce platform** with:

- a customer storefront (shopping experience)
- a customer account portal (dashboard)
- an admin portal
- a backend API
- optional ML/analytics services

The goal is to demonstrate an end‑to‑end, production‑style architecture (frontend + backend + data services), while keeping development/test workflows straightforward.

---

## 2) What we have running locally

### Customer storefront (React + Vite)
- Runs on `http://localhost:3000`
- Contains the shopping UI + customer account portal.

### Backend API (Node.js + Express)
- Runs on `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- Main API prefix: `/api/v1`

### Database (PostgreSQL)
- Runs on `localhost:5432`
- Managed via Docker Compose (Postgres container).
- Prisma is used for schema/migrations in the backend.

### Admin portal
- Runs on `http://localhost:3001`

### ML service (FastAPI)
- Runs on `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

---

## 3) Why the recent changes were needed (key problems we solved)

### A) “New signup should start fresh”
**Problem:** New users were seeing leftover data (cart, wishlist, rewards/points, etc.) from a previous user because state was persisted using the same storage keys for all users.

**Fix:** Implemented **user-scoped persistence** for client-side persisted stores so that each user gets their own isolated storage segment on the same device.

---

### B) “Settings” and “Support” were showing the dashboard
**Problem:** Routes existed but both pointed to the dashboard component, so the navigation looked broken.

**Fix:** Implemented real pages and wired proper routes:
- `/account/settings` → Settings page
- `/account/support` → Support Center page

---

### C) Support requests needed to be “real”
**Problem:** Support was previously UI-only. Users couldn’t submit a support request that the system would retain.

**Fix:** Added a backend route to accept support tickets and append them to a server-side log file, plus a frontend form to create tickets.

---

### D) Returns & Profile pages needed to be “real”
**Problem:** Returns and Profile/Security navigation entries routed to the dashboard.

**Fix:** Implemented:
- `/account/returns` → Returns & Refunds page
- `/account/profile` → Profile & Security hub page

---

## 4) Tools and technologies used

### Frontend (Customer UI)
- **React + TypeScript** (component-driven UI)
- **Vite** (fast dev server and build tooling)
- **React Router** (routing)
- **Zustand** (state management)
  - with persistence for key stores (cart, wishlist, etc.)
- **Tailwind CSS** (utility-first styling)

### Backend (API)
- **Node.js + Express**
- **TypeScript**
- **Prisma ORM**
- **JWT authentication** (token-based)
- **Zod** (input validation)
- **Rate limiting** (for auth endpoints, with dev-friendly limits)

### Database
- **PostgreSQL** in Docker

### ML Service (optional / in-progress)
- **FastAPI** (Python)

### DevOps / Local environment
- **Docker Compose** for local services like Postgres

---

## 5) Customer Account Portal pages currently available

For detailed dashboard documentation, see `docs/USER_DASHBOARD.md`.

High-level list:
- Dashboard: `/account`
- Orders: `/account/orders`
- Wishlist: `/account/wishlist`
- Rewards: `/account/rewards`
- Referrals: `/account/referrals`
- Notifications: `/account/notifications`
- Addresses: `/account/addresses`
- Payments: `/account/payments`
- Security: `/account/security`
- Profile & Security hub: `/account/profile`
- Returns & Refunds: `/account/returns`
- Settings: `/account/settings`
- Support Center: `/account/support`

---

## 6) What is intentionally “not production final” yet

Some areas are still designed for iterative testing:
- not every page is connected to a production backend data model yet (some flows are local-only while backend endpoints are built out)
- several “account preferences” features are persisted locally per-user, but not yet synced to backend
- returns flow is currently simulated as a UX flow (request → approved → shipped → received → refunded) so testing can continue without requiring a full OMS integration

---

## 7) Where to find documentation

- General docs folder: `docs/`
- Customer dashboard doc: `docs/USER_DASHBOARD.md`

