# Sprint 15 — AI Personalization + Voice & AR Commerce

**Delivery window:** 2025-11-10 → 2025-11-11  
**Total hours logged:** 20h (Frontend 12h · Platform/Voice 8h)

---

## 1. Objectives & Scope
- Ship real-time personalization across Home, PLP, PDP, and account controls.
- Introduce voice commerce for natural language searches and account actions.
- Deliver AR try-on / visualizer surfaces with privacy-safe fallbacks.
- Wire telemetry hooks, failovers, and user-facing controls for consent and exploration ratio.

## 2. Implementation Summary

### Personalization 2.0
- **Data & Services**
  - `src/types/personalization.ts`: unified models for sections, rerank response, session context, email picks.
  - `src/services/personalizationAPI.ts`: mock API simulating home sections, PLP rerank, PDP bundles, email top picks.
  - `src/store/personalizationStore.ts`: Zustand store orchestrating fetches, reranks, preference updates, and event tracking.
- **Home Experience**
  - `HomeDynamicSections.tsx` + `HomePage.tsx`: session-aware rails (“Because you viewed…”, “Finish the look”, geo trending) with fallback messaging and preference link.
- **Product Listing (PLP)**
  - `ProductsPage.tsx`: integrates rerank results, renders intent summary banner, gracefully degrades when personalization offline.
- **Product Detail (PDP)**
  - `NewProductDetail.tsx`: “Complete the experience” bundle rail pulling from personalization store; AR CTA; scores + explanations.
- **Account Controls**
  - `PrivacyPage.tsx`: persisted toggles + exploration ratio slider bound to personalization store.

### Voice Commerce
- **Engine**
  - `hooks/useVoiceCommerce.ts`: Web Speech API wrapper with transcript tracking, intent heuristics (search, add to cart, reorder, track order, help), and error handling.
- **UI**
  - `components/voice/VoiceCommandButton.tsx`: mic / listening button with transcript panel, intent badges, mobile + desktop placements.
  - Integrated into `Header.tsx` (desktop & mobile), featuring suggestions, fallback messaging, and action dispatch (navigation, cart stub, account view redirect).

### AR Try-on / Visualizer
- **Modal**
  - `components/ar/ARTryOnModal.tsx`: consent banner, category-specific guidelines, privacy disclosure, 2D overlay fallback, AR launch CTA.
- **PDP Integration**
  - `NewProductDetail.tsx`: Try-in-AR button with category mapping (footwear/bags/eyewear fallback) and modal invocation.

### UX/Accessibility
- Voice widget supports keyboard activation, speech fallback messaging, and error states.
- Personalization rails announce scores/explanations with accessible text.
- AR modal clarifies data minimisation, includes fallback controls, and leverages existing modal focus trapping.

---

## 3. Testing & QA
- Manual smoke tests on Chrome (desktop) + Chrome Android (Pixel emulation):
  - Home session rails loading + fallback.
  - PLP rerank toggles, neutral fallback when disabled.
  - PDP bundling and AR modal flows.
  - Voice button (permissions approved/denied, stop/resume).
- Safari desktop quick pass for personalization rails (speech fallback gracefully hides on unsupported browsers).
- Verified account privacy toggles persist via Zustand store (page refresh).

---

## 4. Risks & Follow-ups
- **Voice intents**: Heuristic parsing only; upgrade to NLU service + taxonomy matching later.
- **AR assets**: Currently uses sample video placeholder; connect to real model-viewer pipeline + CDN.
- **Telemetry**: Track events need wiring to analytics backend (PostHog/Segment) for production.
- **Email top picks**: API stub exists; needs nightly job + messaging template integration.

---

## 5. Hours Breakdown
| Workstream | Tasks | Hours |
| --- | --- | --- |
| Frontend | Home/PLP/PDP integration, AR modal, voice UI, privacy controls | 12h |
| Platform/Voice | Personalization API mocks, Zustand store, voice recognition hook, docs | 8h |

---

✅ Sprint 15 delivers personalization v2 surfaces, voice commerce entry point, and AR try-on scaffolding with safety guardrails. Ready for extended analytics + mobile parity in the next sprint.


