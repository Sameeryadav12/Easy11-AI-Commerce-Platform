# Customer Portal Fixes (Account)

This document tracks fixes applied to the customer account experience during testing.

## 1) New signup should start fresh (no leaked state)

### Problem
When signing up as a new customer (or switching between accounts), the UI showed data from the previous user session:

- cart items
- wishlist items
- loyalty points / tier history
- addresses / payment methods
- orders and other account widgets

This happened because several client stores were persisted to `localStorage` using a single global key (same for every user), and some pages seeded demo/mock data.

### Fix
- Introduced **user-scoped persistence** for customer stores via `src/store/userScopedStorage.ts`.
  - Persisted store keys are now automatically stored as `"<storeKey>::<userId>"`.
  - This prevents cross-user leakage.
- On account changes, the app:
  - updates the current user scope
  - resets in-memory store state
  - rehydrates persisted state for the active user
- Removed demo/mock seeds that caused brand‑new accounts to look “pre-filled”.

### Files touched
- `apps/web/frontend/src/store/userScopedStorage.ts`
- `apps/web/frontend/src/store/cartStore.ts`
- `apps/web/frontend/src/store/wishlistStore.ts`
- `apps/web/frontend/src/store/rewardsStore.ts`
- `apps/web/frontend/src/store/addressStore.ts`
- `apps/web/frontend/src/store/paymentStore.ts`
- `apps/web/frontend/src/store/recentlyViewedStore.ts`
- `apps/web/frontend/src/store/mfaStore.ts`
- `apps/web/frontend/src/services/rewardsAPI.ts`
- `apps/web/frontend/src/pages/account/DashboardPage.tsx`
- `apps/web/frontend/src/pages/account/OrdersPage.tsx`
- `apps/web/frontend/src/components/account/AccountLayout.tsx`
- `apps/web/frontend/src/App.tsx`

### Test steps
1. Login as User A and add a cart item + wishlist item.
2. Logout.
3. Sign up as User B.
4. Confirm:
   - cart is empty
   - wishlist is empty
   - rewards start at 0 / Silver
   - orders show “No orders yet”

## 2) Account Settings page

### Problem
Clicking **Settings** in the account sidebar showed the dashboard page.

### Fix
Added a real settings page with common ecommerce sections (Account, Preferences, Notifications, Privacy & data) and updated routing.

### Files touched
- `apps/web/frontend/src/pages/account/SettingsPage.tsx`
- `apps/web/frontend/src/App.tsx`

### Test steps
1. Go to `/account/settings`.
2. Verify it renders the Settings page (not the dashboard).
3. Verify quick links navigate to profile/security/addresses/payments/notifications.

## 3) Account Support page

### Problem
Clicking **Support** in the account sidebar showed the dashboard page.

### Fix
Added a real Support Center page with:
- search over common topics
- links to Orders, Track Order, Shipping, Payments, FAQ, Contact
- contact options (placeholders for phone/chat; email link)

### Files touched
- `apps/web/frontend/src/pages/account/SupportCenterPage.tsx`
- `apps/web/frontend/src/App.tsx`

### Test steps
1. Go to `/account/support`.
2. Verify it renders the Support Center page (not the dashboard).
3. Try the search bar and click links to existing pages.

