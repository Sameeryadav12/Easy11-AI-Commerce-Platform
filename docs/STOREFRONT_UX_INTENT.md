# Storefront & UX Intent

This document captures the product and UX decisions for the Easy11 storefront and account areas. The goal is **clear intent**: shopping-first behavior, quiet feature integration, and a clean separation between storefront and account management.

---

## 1. Home page: shopping-first, not brand-first

- **Logged-in users**: The home page prioritizes **shopping entry points** over marketing.
  - A short **“For you today, [name]”** strip with one primary action (**Continue shopping**) appears at the top.
  - A **single personalized area** (“Your feed”) follows, containing:
    - **Because you viewed** (recently viewed + cart resume)
    - **Recommended for you** (compact product cards, no scores or “why” in merged view)
    - **Based on your activity** (session-aware tiles with a subtle “Personalization controls” link)
  - Then hero, categories, trending products, benefits, banners, testimonials, newsletter.
  - The hero is **smaller** (reduced padding and headline size) so it doesn’t dominate.
- **Guests**: Hero first, then the same **Your feed** block (same internal groupings), then categories and the rest.
- **Rationale**: One clear message above the fold (“here are products you can shop”) and one conceptual personalization area instead of separate “Recommended” and “Session-aware” sections. Reduces cognitive load and feels like a single smart feed.

---

## 2. Features are present but not advertised

- **Voice search**, **image/camera search**, and **recommendations** are available but not loudly promoted.
  - Header: Voice is icon-only on desktop; camera search is a neutral icon button (no purple gradient).
  - No “AI-Powered Shopping Experience” badge on the hero; no “Personalized by AI” in hero copy.
  - Recommendation section is titled “Recommended for you” with neutral copy; no “Powered by AI” or model names in the main UI.
- **Floating chat**: Shown as a simple “Chat” / help icon (e.g. message bubble), not an “AI” badge. The panel title is “Help,” not “EasyAI Assistant,” in the open state.
- **Rationale**: Mature products show value through results (better picks, faster discovery) rather than by advertising the tech. Restraint here signals product maturity.

---

## 3. Separation: storefront vs account

- **Storefront** (home, products, cart, checkout): Exploratory, commerce-focused. No account dashboards or management UI here.
- **My Account** (`/account` and children): Management space for orders, payments, security, rewards, settings, support. Reached via:
  - Header: “My Account” in the nav bar when logged in; account dropdown (name + chevron) with “My Account” and “Log out.”
  - No mixing of account sidebar/dashboard into the storefront.
- **Rationale**: Clear mental model: “I’m shopping” vs “I’m managing my account.” Aligns with how large e-commerce platforms are structured.

---

## 4. Every visual element has a purpose

- **Hero right side**: The four product tiles are **actionable**. Each links to a category (e.g. Electronics, Audio, Watches, Phones) under a “Shop by category” label. They are not decorative only.
- **Recommendations / recently viewed / categories**: All sections lead to real product lists or category pages.
- **Rationale**: UI exists to help users act (browse, filter, buy), not just to fill space.

---

## 5. Header: reduced cognitive load

- **Account**: One control when logged in — avatar/name with chevron. Click opens a **dropdown** with:
  - “My Account” (link to `/account`)
  - “Log out”
- **Logout** is not at top-level in the header; it lives inside the account dropdown.
- **Search** and **cart** remain prominent. **Voice** is icon-only on desktop; **image search** is a subtle icon button.
- **Rationale**: Fewer competing controls at the same level; secondary actions (logout, advanced search) are still available but grouped.

---

## 6. Navigation hierarchy

- **Global navigation**: Sidebar (in account) and main nav + logo (on storefront). No redundant “back” or duplicate nav on hub pages.
- **Back / breadcrumbs**: Used only on **leaf** pages reached from a hub (e.g. “Back to Profile & Security” on Addresses, Payment methods, Notifications). Not used on the hub pages themselves (Dashboard, Profile & Security, Orders).
- **Rationale**: Consistent pattern: sidebar/logo for global; back links only when the user is in a nested, task-focused flow.

---

## 7. Post–sign-in / sign-up: go to home, not dashboard

- After **login** or **sign-up**, the user is always sent to the **storefront home** (`/`), not the account dashboard (`/account`).
- Same for **verify email**, **reset password**, and the default **MFA** redirect: they go to `/` unless a specific `redirect` or `from` is set (e.g. checkout).
- **Rationale**: The first experience after joining or signing in should be the shopping home; the user can open “My Account” from the header when they want to manage their account.

---

## 8. Account area: stability

- The account area (Profile & Security, Payments, Rewards, Settings, Support, Orders, etc.) is **intentionally not redesigned** with these changes.
- Improvements focus on the **storefront** (home, header, hero, recommendations) and on **clear intent** and **restraint**. The account structure is kept stable for coherence and to avoid unnecessary churn.

---

## 9. Merged personalization (single “For you” area)

- **Recommended for you** and **Session-aware personalization** are no longer separate sections. They live inside one **Your feed** block with:
  - **Because you viewed** (recently viewed + cart)
  - **Recommended for you** (compact heading, product cards without score/“why” in merged mode)
  - **Based on your activity** (compact heading, “Personalization controls” as a subtle link)
- Components support **embedded** / **merged** variants so the page can render one section with one background and consistent spacing.
- **Rationale**: One personalized area with internal groupings (like “Because you viewed,” “Trending near you”) reads as one smart system instead of two overlapping ideas.

---

## 10. Copy and tone

- **Marketing copy** is tightened: shorter sentences, less “AI-powered” / “trusted” repetition. Value is shown through layout and functionality.
- **WhyChooseUs**: Benefit titles and descriptions are shorter and calmer (e.g. “Recommendations for you,” “Secure payments,” “30-day returns”).
- **Testimonials**: Quotes focus on experience and outcomes, not on “AI” or hype.
- **Newsletter**: “Stay in the loop,” “10% off your first order when you subscribe,” “Curated picks” instead of “AI Recommendations.”
- **Footer**: “Quality products, clear returns, secure checkout. We’re here if you need help.” No “Powered by AI.” Emphasis on support, returns, and policies.
- **Rationale**: Calm, confident copy over hype; recruiters and production-style e-commerce prefer restraint.

---

## 11. Visual separation and “your feed” framing

- **Section spacing**: `.section` uses increased vertical padding (`py-14 md:py-20 lg:py-24`) for clearer separation between major blocks.
- **Alternating backgrounds**: Featured categories, trending products, WhyChooseUs, promotional banners, and testimonials sit in alternating `bg-white` / `bg-gray-50` (and dark equivalents) so users get a clear visual reset as they scroll.
- **Your feed**: The personalized block is labeled “Your feed” (and has `aria-label="Your feed"`). Wording like “For you today” and “Based on your activity” reinforces logged-in context without extra UI.

---

## 12. End with trust, not promotion

- **Footer** leads with reassurance: quality, returns, secure checkout, and “We’re here if you need help.” Customer Service and Legal links (support, returns, policies) are prominent.
- **Newsletter** is framed as “Stay in the loop” with a clear but low-pressure offer. No heavy promotional language at the bottom of the page.
- **Rationale**: Real e-commerce often closes with confidence and support rather than last-minute persuasion.

---

## Summary

| Area            | Intent                                                                 |
|-----------------|------------------------------------------------------------------------|
| Home (logged in)| One primary action (“Continue shopping”); single “Your feed” (Because you viewed → Recommended → Based on your activity); then hero → categories, etc. |
| Home (guest)    | Hero first, then “Your feed” (same groupings), then discovery sections. |
| Personalization | Single merged area with internal labels; no separate “Recommended” and “Session-aware” sections. |
| Hero            | Smaller, no “AI” badge; copy is shopping/deals-focused; tiles link to categories. |
| Header          | Account dropdown (My Account + Log out); voice/camera quieter.        |
| Chat widget     | Simple “Chat”/help icon; no “AI” badge.                               |
| Copy / tone     | Short, calm copy; less hype; footer and newsletter end with trust and reassurance. |
| Visual separation | More section padding; alternating section backgrounds.              |
| Storefront vs account | Strict separation: shop here, manage account there.              |
| Navigation      | Back links only on leaf pages; sidebar/logo for global.                |
| Post–sign-in / sign-up | Always redirect to home (`/`), not dashboard (`/account`).            |
| Account area    | Left as-is; no structural redesign.                                   |

These choices are aimed at making the project feel like a **product with clear intent** (shopping-first, restrained feature presentation, clear separation of concerns) rather than a feature showcase.
