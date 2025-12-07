# 🛠️ Easy11 Admin Portal - Complete Specification

## 🎯 Purpose

A secure, scalable, and elegant back-office for merchandising, orders, customers, analytics, and AI/ML operations—built to showcase enterprise-grade thinking.

**Audience:** Merchandisers, Operations, Analysts, Data/ML Engineers, Support, and Admins

**Domain:** `https://admin.easy11.app` (separate app + CI/CD pipeline)

**Identity:** OIDC SSO (Keycloak/Auth0) + MFA + strict RBAC

---

## 🏗️ Information Architecture & Navigation

### **Global Layout:**

**Top Bar:**
- Brand logo
- Environment badge (Dev/Staging/Prod)
- Global search
- Global time range picker
- User menu (profile, settings, logout)

**Left Navigation (Modules):**
1. Overview (KPI dashboard)
2. Catalog (Products, Categories, Inventory, Media)
3. Promotions (Discounts, Banners, Home slots)
4. Orders & Fulfillment
5. Customers & Segments
6. Experiments & Flags
7. Recommendations & ML Ops
8. Forecasts & Planning
9. Data Quality & Lineage
10. Dashboards (Superset/Metabase embeds)
11. Support & Reviews
12. Settings & Security

### **Design Language:**
- Clean, high-contrast UI
- Fonts: Poppins (headings) + Inter (body)
- Rounded-xl cards
- Soft shadows
- Framer Motion transitions
- Dark/light modes

---

## 🔐 Roles & RBAC (Security-First)

### **Role Definitions:**

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **admin** | Full access | All modules, role management, API keys |
| **analyst** | Read-only analytics | Dashboards, exports; no catalog/model mutations |
| **ops** | Operations | Orders, refunds, logistics, inventory |
| **merch** | Merchandising | Products, categories, promotions, homepage |
| **support** | Customer support | Tickets, returns, customer lookup (no PII exports) |
| **ml** | ML Engineering | Model training, promotion/rollback, configs |

### **Security Policies:**
- All writes audited
- Sensitive actions require step-up MFA:
  - Model promotion
  - Key rotation
  - Large refunds (>$500)
- Session management with device tracking
- IP allowlisting for admin access

---

## 📊 Core Modules (Page-by-Page)

### **3.1 Overview (KPI Cockpit)**

**Purpose:** Real-time business metrics

**Cards:**
- Revenue (today, MTD, YTD)
- Orders (count, growth %)
- Average Order Value (AOV)
- Conversion Rate
- Refund Rate
- Top Categories (by revenue)
- Top Campaigns (by ROI)

**Filters:**
- Date range picker
- Channel (web, mobile, API)
- Device type
- Region/country

**Features:**
- Drill-downs to detailed pages
- AI "Insights" assistant highlights anomalies
- Export to PDF/CSV
- Real-time updates (WebSocket)

---

### **3.2 Catalog**

#### **Products:**
- List view with search & filters
- Create/Edit product form:
  - Title, SKU, description
  - Media gallery
  - Attributes & variants
  - Pricing & tax rules
  - SEO fields (meta title, description, keywords)
  - Inventory tracking

**Advanced Features:**
- Smart attributes (NLP auto-tagging)
- Duplicate detection
- Variant matrix generator
- Bulk operations (CSV import/export)
- Bloom filter for duplicate SKUs

#### **Categories:**
- Hierarchical tree view
- Drag-to-reorder
- Bulk product assignment
- Materialized path storage
- Storefront preview

#### **Inventory:**
- Stock by location/warehouse
- Low-stock alerts
- CSV import/export with validation
- Stock movement history

#### **Media:**
- Image/video library
- Alt text compliance checker
- CDN invalidation controls
- Bulk upload
- Image optimization (WebP/AVIF)

---

### **3.3 Promotions**

#### **Discounts/Coupons:**
- Type: Percentage or Fixed amount
- Constraints:
  - Category restrictions
  - Minimum spend
  - User segments
- Schedule (start/end dates)
- Usage limits (per user, total)
- Stack rules

#### **Banners & Home Slots:**
- Hero banners
- Tile layouts
- Copy management
- Schedule & A/B variants
- Device frame preview
- Multi-language support

#### **Campaigns:**
- Aggregate multiple promotions
- Performance tracking (uplift vs baseline)
- ROI calculation

**Publishing:**
- Push to Customer Site via config API
- Cache invalidation
- Rollback capability
- Audit trail

---

### **3.4 Orders & Fulfillment**

**Status Pipeline:**
```
New → Paid → Packed → Shipped → Delivered
```

**Features:**
- Order timeline view
- Resend confirmation emails
- Invoice generator (PDF)
- Partial & full refunds
- Notes & internal comments

**Refunds:**
- Reason taxonomy
- Two-step approval for large amounts
- Automated label generation
- Refund status tracking

**Logistics:**
- Carrier mapping
- SLA tracking
- Geographic heat map
- Delay alerts
- Bulk actions (labels, status updates)

**Risk & Fraud:**
- Risk score per order (0-100)
- Signals:
  - Velocity anomalies
  - Device fingerprinting
  - Geolocation mismatches
  - Email/phone validation
- Hold/release queue
- Manual review workflow

---

### **3.5 Customers & Segments**

**Customer Profiles:**
- Order history
- Return history
- Lifetime Value (LTV)
- Churn score
- RFM segment (Recency, Frequency, Monetary)
- Consent flags
- Support ticket history

**Segments:**
- Rules builder (visual + JSON)
- Filters:
  - Behavioral (purchase patterns)
  - Demographic
  - RFM scores
  - Custom attributes
- Preview counts
- Schedule exports (CSV or webhook)
- Integration with ESP (SendGrid)

---

### **3.6 Experiments & Flags**

**Experiments (A/B Testing):**
- Define experiment:
  - Name, hypothesis
  - Variants (control + treatments)
  - Target audience
  - Success metrics
- Live results:
  - Conversion uplift
  - 95% Confidence Interval
  - Statistical significance
- Auto-stop guardrails
- Winner declaration

**Feature Flags:**
- Toggle UI placements
- Recommendation layout switches
- Assistant prompt versions
- Scoped by user segment
- Real-time propagation (<60s)
- Rollback capability

---

### **3.7 Recommendations & ML Ops**

**Model Status Dashboard:**
- Active model version
- Hit@10 (top-10 accuracy)
- Coverage (% of catalog)
- p95 latency
- Cache hit rate

**Controls:**
- Promote/rollback model alias
- Adjust weights:
  - Collaborative filtering
  - Content-based
  - Popularity baseline
- A/B test model versions

**Catalog Similarity:**
- Compute/recompute item vectors
- "Explain similarity" (feature contributions)
- Manual similarity overrides

**Safety:**
- Promotion gates:
  - Better offline metrics required
  - MFA confirmation
  - Staged rollout (10% → 50% → 100%)
- Full audit trail
- One-click rollback

---

### **3.8 Forecasts & Planning**

**Sales/Demand Forecasts:**
- By category/SKU
- Time horizons: 7d, 30d, 90d
- Metrics: sMAPE, MASE
- Simulation mode (promo on/off)

**Inventory Planner:**
- Suggested reorder points
- Vendor lead times
- Safety stock recommendations

**Seasonality View:**
- Calendar overlay
- Holiday markers
- Campaign schedule
- Historical patterns

---

### **3.9 Data Quality & Lineage**

**Great Expectations:**
- Test pass/fail counts
- Failing tests with sample rows
- Expectation suite management
- Alert configuration

**dbt Lineage:**
- Embedded docs
- DAG visualization
- Freshness/recency indicators
- Column-level lineage

**SLAs:**
- Dataset freshness monitoring
- Alert if critical tables stale
- Ownership contacts
- Incident management

---

### **3.10 Dashboards (Embedded BI)**

**Superset/Metabase Embeds:**
- Role-filtered tabs:
  - Executive summary
  - Conversion funnel
  - Cohort analysis
  - Product performance
  - Churn analysis

**Features:**
- Single sign-on (SSO)
- Row-level security
- Exports (CSV, PNG, PDF)
- Watermark (requester + timestamp)
- Scheduled reports

---

### **3.11 Support & Reviews**

**Ticket System:**
- AI triage (sentiment, urgency, category)
- Link to orders & customer profile
- Canned responses
- Escalation policies
- SLA tracking

**Reviews & Q&A:**
- Moderation queue
- Sentiment analysis summary
- Highlight top reviews to Customer Site
- Bulk actions (approve, reject, flag)

---

### **3.12 Settings & Security**

**Users & Roles:**
- Invite users (email)
- Role assignment
- Deactivate/reactivate
- SSO group sync
- Login history

**API Keys & Webhooks:**
- Create/revoke API keys
- Masked display (show last 4 chars)
- Key rotation
- HMAC signature verification
- Webhook retry policies

**Privacy & Retention:**
- Data retention schedules
- Subject data request (GDPR)
- Data deletion workflows
- Consent management

**Audit Log:**
- Append-only
- Tamper-evident hash chain
- Search & filter
- Export for compliance
- Retention: 7 years

---

## 🤖 AI/ML Capabilities (Admin-Grade)

### **Recommendation Stack:**
- **Algorithms:**
  - LightFM (collaborative filtering)
  - ALS (matrix factorization)
  - Embedding similarity (content-based)
  - Business rules (inventory, margin)
- **Serving:** FastAPI + Redis cache
- **Evaluation:** Hit@K, NDCG, coverage

### **Churn & LTV Models:**
- XGBoost with RFM + behavioral features
- Confidence banding
- Exportable segments
- Calibration tracking

### **Forecasting:**
- Prophet (Facebook)
- XGBoost (gradient boosting)
- Horizons: weekly & daily
- Calibration metrics

### **Assistant (Operations):**
- Natural language queries:
  - "What changed last week?"
  - "Why did churn spike?"
- Generates KPI diffs
- Links to relevant dashboards
- Feature investigation

### **NLP:**
- Review summarization
- Keyword extraction
- Category attribute suggestion
- Sentiment analysis

### **Governance:**
- Model registry (MLflow)
- Promotion gates
- Drift detection
- A/B testing framework
- One-click rollback

---

## 🔌 Data Contracts & APIs

### **Authentication:**
```
POST /admin/auth/login → JWT token
GET /admin/auth/me → user profile + role claims + MFA status
POST /admin/auth/logout
POST /admin/auth/mfa/setup
POST /admin/auth/mfa/verify
```

### **KPIs:**
```
GET /admin/kpis?from={date}&to={date}&channel={channel}
```

### **Catalog:**
```
GET /admin/catalog/products?q={query}&category={id}&page={n}
POST /admin/catalog/products
PUT /admin/catalog/products/{id}
DELETE /admin/catalog/products/{id}
POST /admin/catalog/products/bulk

GET /admin/catalog/categories
POST /admin/catalog/categories
PUT /admin/catalog/categories/{id}

GET /admin/catalog/inventory
PUT /admin/catalog/inventory/{sku}
POST /admin/catalog/inventory/bulk
```

### **Promotions:**
```
GET /admin/promotions/discounts
POST /admin/promotions/discounts
PUT /admin/promotions/discounts/{id}
DELETE /admin/promotions/discounts/{id}

GET /admin/promotions/banners
POST /admin/promotions/banners
POST /admin/promotions/publish → publish to Customer Site
```

### **Orders:**
```
GET /admin/orders?status={status}&from={date}
GET /admin/orders/{id}
POST /admin/orders/{id}/refund
POST /admin/orders/{id}/label
PUT /admin/orders/{id}/status
```

### **Customers:**
```
GET /admin/customers?q={query}
GET /admin/customers/{id}
GET /admin/customers/{id}/orders
GET /admin/customers/{id}/ltv

POST /admin/segments (rule DSL JSON)
GET /admin/segments/{id}/preview
POST /admin/segments/{id}/export
```

### **Experiments:**
```
POST /admin/experiments
GET /admin/experiments/{id}/metrics
PUT /admin/experiments/{id}/status

GET /admin/flags
PUT /admin/flags/{key}
```

### **ML Ops:**
```
GET /admin/ml/recommendations/status
POST /admin/ml/recommendations/promote
POST /admin/ml/recommendations/rollback
POST /admin/ml/similarity/rebuild
```

### **Forecasts:**
```
GET /admin/forecasts?category={id}&horizon={days}
GET /admin/forecasts/plans
```

### **Data Quality:**
```
GET /admin/data-quality/ge-results
GET /admin/data-quality/dbt-artifacts
GET /admin/data-quality/slas
```

### **Dashboards:**
```
POST /admin/dashboards/token → signed embed token
```

### **Settings:**
```
GET /admin/settings/users
POST /admin/settings/users/invite
PUT /admin/settings/users/{id}/role
DELETE /admin/settings/users/{id}

GET /admin/settings/api-keys
POST /admin/settings/api-keys
DELETE /admin/settings/api-keys/{id}

GET /admin/settings/webhooks
POST /admin/settings/webhooks

GET /admin/audit?from={date}&action={type}
POST /admin/audit/export
```

---

## 📈 Observability, SLOs, & Reliability

### **SLOs:**
- Admin TTI (Time to Interactive): < 3s p75
- Recommendations p95 latency: < 150ms
- BI embed load time: < 2s p75
- Publish latency: < 60s

### **Metrics:**
- API latency & error rates
- Cache hit rates
- Background job success rates
- Data freshness
- Model performance metrics

### **Logging & Traces:**
- Structured logging (JSON)
- OpenTelemetry traces
- Span across: Admin → API → ML → DB
- Log aggregation (ELK/Datadog)

### **Alerts:**
- SLO degradation
- Failing data quality tests
- Model drift detection
- Webhook failures
- Security events

---

## 🔒 Security & Compliance

### **Authentication:**
- OIDC SSO (Keycloak/Auth0)
- Multi-Factor Authentication (MFA)
- Session rotation (24h)
- Device & IP context tracking

### **Transport & Data:**
- TLS 1.3 enforced
- AES-256 encryption at rest
- Field-level encryption for PII
- Database encryption

### **HTTP Security Headers:**
```
Content-Security-Policy: strict
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
```

### **Application Security:**
- Input validation (Zod/Joi)
- Rate limiting (per user, per IP)
- Anti-automation (login attempts)
- Dependency scanning (Snyk)
- Container scanning
- SAST/DAST in CI/CD

### **Audit:**
- Tamper-evident hash chain
- Immutable log storage
- Export for compliance
- 7-year retention

### **Privacy:**
- Consent flag tracking
- Right-to-be-forgotten workflow
- PII masking in exports
- GDPR/CCPA compliance

---

## ⚡ Performance & UX Quality

### **Frontend Optimization:**
- Code splitting (route-level)
- Prefetching next routes
- Skeleton loaders
- Virtualized tables (10k+ rows)
- Keyboard-first operations

### **Images:**
- AVIF/WebP formats
- Blurred placeholders
- Lazy loading
- CDN delivery

### **UX Patterns:**
- Optimistic UI updates
- Undo snackbars
- Inline validations
- Diff highlights on edits
- Autosave drafts

### **Accessibility:**
- WCAG 2.1 AA compliance
- Proper focus order
- ARIA roles & labels
- High-contrast theme option
- Keyboard navigation

---

## 🚀 5-Sprint Roadmap

### **🟣 Sprint 1 — Foundation, SSO, RBAC, Overview**
**Duration:** 1-2 weeks

**Goals:** Secure shell online; KPIs visible

**Scope:**
- Admin app shell (nav, theming, time range)
- OIDC SSO + MFA + role mapping
- Overview KPIs with date filters
- Audit log scaffold
- Secure headers

**Acceptance:**
- SSO/MFA enforced
- Role-gated navigation
- KPIs load < 1s
- All actions logged

---

### **🔵 Sprint 2 — Catalog & Promotions**
**Duration:** 1-2 weeks

**Goals:** Merchandising & content control

**Scope:**
- Product CRUD
- Category tree
- Inventory management
- Media manager
- Discounts & coupons
- Banners & home slots
- Publish pipeline to Customer site
- Device frame preview

**Acceptance:**
- Updates reflect on Customer site within 60s
- All writes audited
- Preview matches production

---

### **🟢 Sprint 3 — Orders, Refunds, Logistics, Fraud**
**Duration:** 1-2 weeks

**Goals:** Ops-grade order control

**Scope:**
- Orders timeline
- Invoice generation
- Partial/full refunds
- Logistics carrier statuses
- Delay alerts
- Bulk updates
- Fraud dashboard
- Risk queue (hold/release)

**Acceptance:**
- Refunds require MFA
- Risk > threshold auto-holds
- SLA alerts firing

---

### **🟠 Sprint 4 — Customers & Segments + Experiments**
**Duration:** 1-2 weeks

**Goals:** Audience intelligence + controlled change

**Scope:**
- Customer profiles
- RFM/churn scores
- Rule-based segments
- Segment exports
- Experiments (define/assign/measure)
- Guardrails
- Feature flags by segment
- Real-time toggle to Customer site

**Acceptance:**
- Segment preview accuracy
- Experiment results with CI
- Flags reflect on Customer within 60s

---

### **🟡 Sprint 5 — ML Ops + Forecasts + Data Quality**
**Duration:** 1-2 weeks

**Goals:** ML control plane + trust in data

**Scope:**
- Recs model status (Hit@10, cache, latency)
- Promote/rollback with gates
- Forecasts & planning
- sMAPE tracking
- Scenario simulation
- Great Expectations status
- dbt lineage embedded
- Superset/Metabase embeds
- Secure export with watermark

**Acceptance:**
- Promotion requires better metrics + MFA
- Dashboards render in-portal
- Failing tests visibly highlighted
- Forecasts downloadable

---

## 📊 KPIs & Success Criteria

### **Operational:**
- Publish latency: < 60s
- API error rate: < 0.5%
- Audit coverage: 100%

### **Merchandising:**
- Campaign uplift vs baseline: measurable
- Stock-out rate: < target

### **Data/ML:**
- Hit@10: +10% vs popularity baseline
- Churn model AUROC: ≥ 0.80
- Forecast sMAPE: within target

### **Security:**
- 0 critical vulnerabilities
- Quarterly key rotation
- Successful incident drill

### **UX:**
- Admin LCP: < 2.5s p75
- Virtualized lists: smooth at 10k rows
- a11y checks: 100% pass

---

## ⚠️ Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Model misuse | Gate promotions behind metrics + MFA + rollback |
| Data drift & quality | Daily GE runs, freshness checks, red banner if stale |
| Permission creep | SSO group sync, role audit every sprint, negative tests |
| Performance regressions | Perf budgets in CI, canary deploys, error budgets |

---

## 🎯 What This Proves (For Recruiters)

1. **Systems Thinking:** Two distinct apps, clean contracts, shared identity
2. **Enterprise Security:** MFA, RBAC, audit, compliance workflows
3. **Real ML Ops:** Registry, gates, drift, promotion, rollback
4. **Data Trust:** GE + dbt lineage + SLAs
5. **Operational Excellence:** Metrics, SLOs, observability, runbooks
6. **Design Craft:** Modern UI, accessibility, performance, delightful micro-interactions

---

**Status:** 📝 Ready for Implementation  
**Next:** Sprint 1 - Foundation  
**Date:** November 2, 2025

