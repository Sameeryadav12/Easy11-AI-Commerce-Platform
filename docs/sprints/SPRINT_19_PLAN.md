# Sprint 19 — Data Partnerships & Retail Media Network (Plan)

Objectives
- Privacy-safe data collaboration via a clean-room abstraction and policy configs.
- Retail media ads engine (sponsored listings) with second-price auction and quality score.
- Campaign Manager UI for vendors/brands with reports and pacing.
- Measurement and attribution stubs; billing ledger for media spend.
- Compliance guardrails (consent, DP thresholds, audit).

Deliverables (dev scope)
- Clean-room stubs: tokenization, DP thresholding, YAML policies, audit.
- Ads APIs: `/api/ads/campaigns`, `/api/ads/slots`, `/api/ads/reports`, `/api/ads/bid` (internal).
- Auction engine (second-price + quality weighting), metrics accumulator.
- Admin “Campaigns” UI surface (list, create, reports).
- Docs + QA matrix.

Environments
- Admin/API (dev): http://localhost:3001
- Customer/Vendor portals remain unchanged for this sprint (ads surfaces later).


