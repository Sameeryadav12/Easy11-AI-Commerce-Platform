# Sprint 21 — Sustainability & ESG Intelligence (Implementation)

Delivery window: 2025-11-16 → 2025-11-16

Delivered (dev)
- Carbon Engine: `/api/v1/esg/carbon` (calc + bulk + forecast sample) with heuristic based on product, packaging, shipping, recyclability, returns.
- Vendor ESG: `/api/v1/esg/vendor/:id`, `/api/v1/esg/global`, `/api/v1/esg/forecast`.
- Certifications: `/api/v1/esg/certifications/upload` and registry store.
- Circular Commerce: `/api/v1/esg/returns` route suggestion with CO₂ savings.
- ESG Dashboard: `admin.easy11.com/dashboard/esg` KPIs and forecast list.
- Reporting: `/api/v1/esg/reports` JSON stub for GRI/SASB/CSRD packs.

How to test
- Calculate order CO₂: `POST /api/v1/esg/carbon` with { carrier:'road', shippingKm:250, packagingGrams:120, recyclablePct:50, productKgCO2:1.4, quantity:2, returnLikelihood:0.12 }.
- Upload certification: `POST /api/v1/esg/certifications/upload`.
- View ESG dashboard: `/dashboard/esg`.
- Route returns: `POST /api/v1/esg/returns` with condition fields.

Next (prod hardening)
- Wire to real carbon factors (DEFRA/IPCC), dbt models, and ML correction layer.
- OCR verification for certifications, expiry alerts, and customer PDP badges.
- Map visualizations and deeper analytics (Prophet/XGBoost) with BI integration.


