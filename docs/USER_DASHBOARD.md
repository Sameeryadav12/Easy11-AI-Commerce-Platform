# User Dashboard (Customer Account Portal)

This document describes the **customer account portal** (the “User Dashboard”)—what it includes right now, what is functional, and what is still being built.

> Status: **Active development & testing**

---

## 1) Purpose (why this dashboard exists)

The customer dashboard is the user’s self‑service area, similar to Amazon/eBay account pages:

- view and manage orders
- manage wishlist
- rewards & wallet experience
- manage addresses + payment methods
- account preferences (settings)
- support and issue resolution
- returns/refunds
- security controls (MFA/devices/sessions)

This reduces support load and improves trust: users can track everything without needing to contact support for basic tasks.

---

## 2) Navigation & routes (current)

All routes below are under the customer frontend.

### Core pages
- **Dashboard**: `/account`
- **My Orders**: `/account/orders`
- **Returns & Refunds**: `/account/returns`
- **Wishlist**: `/account/wishlist`
- **Rewards & Wallet**: `/account/rewards`
- **Referrals & Invites**: `/account/referrals`
- **Challenges & Badges**: `/account/rewards/challenges`
- **Points History**: `/account/rewards/history`
- **Profile & Security** (hub): `/account/profile`
- **Security** (detailed): `/account/security`
- **Settings**: `/account/settings`
- **Support**: `/account/support`

### Account data pages
- **Addresses**: `/account/addresses`
- **Payments**: `/account/payments`
- **Notifications**: `/account/notifications`
- **Privacy & Data**: `/account/privacy`

---

## 3) What is functional right now (page-by-page)

### A) Dashboard (`/account`)
**Goal:** Quick snapshot + shortcuts.

**What’s working now**
- shows welcome banner + user name
- shows quick cards (notifications count, addresses count, payments count, security status)
- shows rewards tile (based on rewards store)

**Notes**
- Some dashboard “insights” are intentionally basic until backend integrations are finalized.

---

### B) Orders (`/account/orders`)
**Goal:** View orders, search/filter, basic order actions.

**What’s working now**
- orders UI loads
- if there are no orders, the page correctly shows **“No orders yet”**

**Notes**
- Orders are not auto-seeded anymore (to keep new accounts clean).

---

### C) Returns & Refunds (`/account/returns`)
**Goal:** Amazon/eBay-style return initiation + status tracking + refund timeline.

**What’s working now**
- “Start a return” section (eligibility window concept)
- “Track returns” section with return request statuses
- Refund timeline information
- Return requests persist per-user (saved on device)

**Notes**
- Eligibility depends on delivered orders. If there are no delivered orders yet, you will see “No eligible orders found”.

---

### D) Wishlist (`/account/wishlist`)
**Goal:** Save products for later; move items to cart.

**What’s working now**
- wishlist is empty by default for new accounts (no demo items)
- add/remove and “add to cart” logic is present

---

### E) Rewards & Wallet (`/account/rewards`, `/account/rewards/history`, `/account/rewards/challenges`)
**Goal:** Loyalty overview, points history, challenge system.

**What’s working now**
- rewards state no longer starts with “fake points” for new signups
- data is isolated per-user on the same device (no cross-user leakage)

**Notes**
- Rewards API may fall back to local data when backend endpoint is not available.

---

### F) Settings (`/account/settings`)
**Goal:** Account preferences like language/currency and notification preferences.

**What’s working now**
- real Settings page exists and is routed correctly
- settings are **saved per user on this device**
- controls:
  - language
  - currency
  - order updates toggle
  - marketing emails toggle
  - save/cancel/reset controls

**Notes**
- Settings is intentionally **preferences-only** (behavior controls).
- Identity + protection (name/email/password/MFA/devices) lives in **Profile & Security** (`/account/profile`).
- Privacy actions (export/delete) live in **Privacy & data** (`/account/privacy`).
- This is currently a **preference store** (local per-user). It does not yet change global UI language/currency site-wide.

---

### G) Support (`/account/support`)
**Goal:** Self-serve help + submit a support ticket.

**What’s working now**
- support topics search + links to relevant pages
- **create support request** form
- support ticket creation posts to backend and returns a ticket id

**Where tickets are stored**
- Server writes tickets to: `.cursor/support_tickets.log`

**Notes**
- Ticket submission requires the customer to be logged in (uses auth token).

---

### H) Profile & Security hub (`/account/profile`)
**Goal:** Central place for identity + security overview.

**What’s working now**
- shows name/email/member since
- shows MFA enabled/disabled snapshot
- links to Security, Settings, Privacy, Addresses, Payments, Notifications

---

### I) Security (detailed) (`/account/security`)
**Goal:** MFA/devices/sessions management page.

**What’s working now**
- security UI loads and supports MFA enrollment flows

**Notes**
- Some MFA APIs are mock-like by design until full backend endpoints exist.

---

## 4) Critical rule we implemented: “New user starts clean”

### What it prevents
When you logout and create another account on the same browser, the new account should not inherit:
- cart items
- wishlist items
- rewards points/history
- addresses / payments
- recently viewed items
- other persisted UI state

### How it works
Persisted stores are saved with **user-scoped keys** (`<storeKey>::<userId>`), and on user change we reset + rehydrate the correct scoped state.

---

## 5) What to test (recommended checklist)

### A) Navigation integrity
- Clicking each sidebar item routes to the correct page (no loops back to dashboard).

### B) New-user freshness
- Login as User A → add wishlist/cart → logout → signup User B
- Verify B starts clean (no inherited cart/wishlist/rewards).

### C) Settings persistence (per-user)
- Change Language/Currency → Save → refresh page
- Confirm it persists
- Switch accounts → confirm the setting is not shared across accounts

### D) Returns flow
- Create a return request → confirm it appears in Track returns and status updates work

### E) Support ticket
- Submit a ticket → confirm you get a ticket id

---

## 6) What we are building next (when you say “continue”)

Depending on your testing feedback, the next typical improvements are:
- connect dashboard widgets to real backend data (orders/returns/rewards)
- real “change password” flow and proper account profile editing
- better returns eligibility rules per category and policy
- richer support workflows (attachments, ticket list/history, status tracking)

