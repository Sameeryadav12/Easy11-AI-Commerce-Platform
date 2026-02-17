# Address Persistence After First Order

This document describes how customer addresses and contact details are saved after the first order and how they can be managed.

## Overview

- **After a customer's first order**, their shipping address and contact details are automatically saved.
- **Saved addresses** appear in My Account → Addresses and can be used at checkout.
- **Customers can add new addresses** or **edit existing ones** from the Addresses page.

---

## Flow

### 1. First Order (Checkout)

When a **logged-in user** completes their **first order**:

1. The order is created and added to My Orders.
2. The shipping information (name, phone, address, city, state, zip, country) is saved as an address in `addressStore`.
3. The address is stored with nickname "Shipping address" and marked as the default shipping address.

### 2. Subsequent Checkouts

When the user returns to checkout:

1. **Saved addresses** are shown in the Shipping step.
2. The default shipping address is pre-selected and the form is pre-filled.
3. The user can:
   - Choose another saved address.
   - Select "Enter new address" to fill in a different address.

### 3. Managing Addresses (My Account → Addresses)

- **View** all saved addresses.
- **Add** new addresses (Home, Work, etc.).
- **Edit** existing addresses.
- **Delete** addresses.
- **Set default** shipping or billing address.

---

## Technical Details

| Component        | Role                                                                 |
|------------------|----------------------------------------------------------------------|
| `addressStore`   | Zustand store with user-scoped persistence (`userScopedStorage`).   |
| `CheckoutPage`   | Saves address after first order; shows saved addresses in step 2.   |
| `AddressesPage`  | Loads and manages addresses from `addressStore`.                    |

### When an Address Is Saved

- Only for **logged-in users** (`user?.id` exists).
- Only on **first order** (i.e. when `orders.length === 0` before adding the new order).

### Address Source of Truth

- `addressStore` is the primary source. Addresses saved from checkout and created/edited on the Addresses page are persisted there.
- Data is user-scoped via `userScopedStorage`, so each user only sees their own addresses.

---

## User Experience Summary

| Scenario              | Result                                                          |
|-----------------------|-----------------------------------------------------------------|
| First order           | Address saved automatically.                                    |
| Later checkouts       | Saved addresses available; default pre-selected.                 |
| Add new address       | Via My Account → Addresses.                                     |
| Edit existing address | Via My Account → Addresses.                                     |
| Use different address | Select "Enter new address" at checkout or choose another saved. |
