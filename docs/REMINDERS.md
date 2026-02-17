# Reminders – Future Work

This file tracks planned features and improvements to implement later.

---

## Extra security (what Amazon/eBay also do)

*To be implemented in the future.*

- [ ] **Sign up with Google** – Optional “Sign up with Google” (OAuth).
- [ ] **Rate-limit on register endpoint** – Add or tighten rate limiting on the registration endpoint.
- [ ] **Email verification step after signup** – Require users to verify their email before full access.
- [ ] **CAPTCHA only after suspicious attempts** – Add CAPTCHA only when behavior is suspicious; don’t show it to normal users.

---

## Business tactics (implemented)

- **New signup fresh start** – Customers who just created an account do not see “Because you viewed” (or other session-based “pick up where you left off” content) for 24 hours. This avoids showing pre-signup guest data or an empty state that implies prior browsing. Implemented in `LiveIntentWidgets` (hide section when `user.createdAt` is within last 24h) and on register success we clear recently viewed so the new account does not inherit guest data.

---

*Add more reminder sections below as needed.*
