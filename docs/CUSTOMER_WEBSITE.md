# Customer Website — Product Documentation

**Easy11 Commerce Intelligence Platform**  
**Document version:** 1.0  
**Status:** Production-ready reference  
**Last updated:** 2025

---

## 1. Executive summary

The Easy11 **customer website** is the public-facing storefront and account portal where shoppers browse products, manage their account, and complete purchases. It is built as a single-page application (React + TypeScript + Vite) with a clear separation between **storefront** (browse, cart, checkout) and **account** (dashboard, orders, rewards, settings, support).

This document describes **features delivered**, **problems encountered and resolved**, and **future goals** in a format suitable for product, engineering, and stakeholders.

---

## 2. Features delivered

### 2.1 Storefront (unauthenticated and authenticated)

| Feature | Description | Route / entry |
|--------|-------------|----------------|
| **Home** | Hero, shop-by-category, trending products, testimonials, newsletter signup. For logged-in users: “For you today” strip and personalized “Your feed” (recommendations, session-aware sections). | `/` |
| **All products** | Product grid with filters (price, brand, rating, availability, delivery), sorting (relevance, price, rating, trending), AI sort toggle, grid/list view. Shared catalog so home and listing stay in sync. | `/products` |
| **Product detail** | Image gallery, pricing, add to cart / buy now, wishlist, “You may also like” (derived from catalog, same category first). | `/products/:id` |
| **Cart** | Full cart page with line items, quantity, remove, persist per user. | `/cart` |
| **Checkout** | Checkout flow with validation; confirmation page. | `/checkout`, `/checkout/confirmation` |
| **Search** | Header search; voice and visual search entry points (UI in place). | Header |
| **Personalization** | “Your feed”: recently viewed (logged-in only, hidden for guests and new signups), recommended for you, session-based sections. Badges (e.g. Low stock, Trending near you) visible and consistent. | Home “Your feed” |
| **Support (public)** | Support hub, category browse, track order. | `/support`, `/support/category/:slug`, `/track-order` |
| **Legal & info** | Privacy, terms, cookies, accessibility, about, FAQ, contact, shipping. | `/privacy`, `/terms`, `/cookies`, `/accessibility`, `/about`, `/faq`, `/contact`, `/shipping` |

### 2.2 Authentication

| Feature | Description | Route |
|--------|-------------|--------|
| **Registration** | Create account with email, password, name, terms acceptance. Password strength and validation. | `/register`, `/auth/register` |
| **Login** | Email/password login; JWT and refresh flow. | `/login`, `/auth/login` |
| **Forgot / reset password** | Request reset and set new password. | `/auth/forgot-password`, `/auth/reset-password` |
| **Email verification** | Verify email and confirmation-sent views. | `/auth/verify-email`, `/auth/verification-sent` |
| **MFA** | Enroll (e.g. passkey/TOTP), verify at login, recovery codes. | `/auth/mfa/enroll`, `/auth/mfa/verify`, `/auth/mfa/recovery-codes` |

### 2.3 Account portal (`/account`)

| Feature | Description | Route |
|--------|-------------|--------|
| **Dashboard** | Overview: recent orders, rewards summary, quick links. | `/account` |
| **Orders** | Order list and order detail. | `/account/orders`, `/account/orders/:orderId` |
| **Wishlist** | Saved products; persisted per user. | `/account/wishlist` |
| **Rewards** | Points balance, history, redemptions, challenges, referrals. | `/account/rewards`, `/account/rewards/history`, `/account/rewards/redemptions`, `/account/rewards/challenges`, `/account/rewards/referrals` |
| **Addresses** | Saved addresses; add/edit/delete. | `/account/addresses` |
| **Payments** | Saved payment methods (UI; backend integration as per roadmap). | `/account/payments` |
| **Notifications** | Notification preferences. | `/account/notifications` |
| **Security** | Password change, session/security overview. | `/account/security` |
| **Profile** | Profile and security hub. | `/account/profile` |
| **Returns & refunds** | Request return, status; flow simulated for testing. | `/account/returns` |
| **Settings** | Account and display settings. | `/account/settings` |
| **Support** | Support center and tickets. | `/account/support`, `/account/support/tickets` |
| **Privacy (account)** | Privacy and personalization controls. | `/account/privacy` |

### 2.4 Other

| Feature | Description | Route |
|--------|-------------|--------|
| **Community** | Community hub and look detail (if enabled). | `/community`, `/community/looks/:id` |

---

## 3. Problems faced and how they were resolved

| Problem | Cause | Resolution |
|--------|--------|------------|
| **New signups seeing “Because you viewed”** | Session/guest data or rehydration showing pre-signup state. | “Because you viewed” shown only when user is logged in and not a new signup (24h). On register, recently viewed store cleared. Documented as business tactic (fresh start). |
| **Guests seeing “Because you viewed”** | Widget did not check login state. | Section rendered only when `user` is present; guests never see it. |
| **Price filter: one digit at a time / can’t clear** | Inputs controlled by numeric state; re-renders remounted section (FilterSection defined inline). | FilterSection moved to stable component; min/max inputs use string state and validate on blur/apply so users can clear and type full values. |
| **Price filter: clearing min/max reverted to 0 and 2000** | Same numeric control; empty or partial input was immediately parsed and replaced. | Min/max use string state; parsing and clamping only on blur and Apply. |
| **All products page missing home products** | Home showed personalization products (e.g. 13–20); products page had a fixed list of 12. | Shared `productCatalog` (ALL_PRODUCTS) used by products page and trending; 20 products everywhere. |
| **“You may also like” opened wrong product** | Hardcoded recommendation list with names that didn’t match catalog IDs. | “You may also like” derived from same catalog as detail page (exclude current, same category first, then others); names and links always match. |
| **“You may also like” not clickable** | Cards were not wrapped in navigation. | Each card wrapped in `<Link to={/products/${id}}>` so clicks open the correct product. |
| **Registration error: `termsAcceptedAt` column missing** | Schema had field; migration had not been created/applied. | New migration added column to `users`; `prisma migrate deploy` applied. |
| **Badges “Low stock” / “Trending near you” not visible** | Badge component’s `info` variant (sky/gray) overrode custom classes on dark cards. | Section item badges use a plain span with explicit high-contrast classes (e.g. emerald background, white text) so all badges are visible. |
| **“View details” button overlapping text** | Tight spacing; button too close to reason/badges. | Card layout uses flex + gap; button has sufficient top margin and flex-shrink-0 so it never overlaps. |
| **Cross-user data leakage (cart, wishlist, etc.)** | Persisted stores used same keys for all users. | User-scoped persistence: storage key includes current user id (or “anon”); scope set on login/logout; rehydration per user. |
| **Settings / Support / Returns / Profile showed dashboard** | Routes pointed at dashboard component. | Dedicated pages and routes implemented for `/account/settings`, `/account/support`, `/account/returns`, `/account/profile`. |
| **Support tickets not persisted** | Support was UI-only. | Backend route for creating tickets; tickets appended to server-side log; frontend form and ticket list. |

---

## 4. Future goals

### 4.1 Security and auth (from reminders)

- **Sign up with Google** — Optional OAuth.
- **Rate-limit on register** — Tighten or add rate limiting on registration endpoint.
- **Email verification** — Require verification after signup before full access.
- **CAPTCHA** — Only after suspicious attempts; keep normal flow friction-free.

### 4.2 Customer experience

- **Backend sync for preferences** — Sync account preferences (e.g. notifications, privacy) to backend; today some are local-only.
- **Full OMS integration for returns** — Replace simulated return flow with real order management integration when available.
- **Production data** — Connect all account and order flows to production backend models where still local or mock.

### 4.3 Product and growth

- **Recommendations** — Strengthen personalization and ML-backed recommendations.
- **Search** — Deeper search (e.g. backend search API, filters, suggestions).
- **Performance** — Core Web Vitals, lazy loading, and bundle optimization for production.

---

## 5. Tech stack (customer website)

| Layer | Technology |
|-------|------------|
| **Framework** | React 18, TypeScript |
| **Build** | Vite |
| **Routing** | React Router v6 |
| **State** | Zustand (with user-scoped persistence for cart, wishlist, rewards, etc.) |
| **Styling** | Tailwind CSS |
| **API** | Axios; JWT in memory/localStorage; refresh flow |
| **Auth** | Custom JWT (no NextAuth on storefront); optional MFA (e.g. passkey/TOTP) |

---

## 6. Route index (quick reference)

**Storefront:** `/`, `/products`, `/products/:id`, `/cart`, `/checkout`, `/checkout/confirmation`, `/contact`, `/faq`, `/shipping`, `/track-order`, `/support`, `/support/category/:slug`, `/about`, `/privacy`, `/terms`, `/cookies`, `/accessibility`.

**Auth:** `/login`, `/register`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`, `/auth/verification-sent`, `/auth/mfa/enroll`, `/auth/mfa/verify`, `/auth/mfa/recovery-codes`.

**Account:** `/account`, `/account/orders`, `/account/orders/:orderId`, `/account/wishlist`, `/account/rewards` (and sub-routes), `/account/addresses`, `/account/payments`, `/account/notifications`, `/account/security`, `/account/profile`, `/account/returns`, `/account/settings`, `/account/support`, `/account/support/tickets`, `/account/privacy`.

---

## 7. Related documentation

- [Account portal specification](./customer-website/ACCOUNT_PORTAL_SPECIFICATION.md)
- [Storefront UX intent](./STOREFRONT_UX_INTENT.md)
- [User dashboard](./USER_DASHBOARD.md)
- [Main documentation index](./README.md)
