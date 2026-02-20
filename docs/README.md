# Easy11 Documentation

Single entry point for all Easy11 Commerce Intelligence Platform documentation. Use the table of contents below to reach any section.

**Live demo:** [https://easy11.vercel.app/](https://easy11.vercel.app/)

---

## Table of contents

| Section | Description |
|--------|-------------|
| [1. Getting started](#1-getting-started) | Run the app, quick start, what we built, customer website |
| [2. System & architecture](#2-system--architecture) | Architecture, API, security, deployment |
| [3. Development guides](#3-development-guides) | Setup, Docker, databases, testing |
| [4. Applications](#4-applications) | Customer website, admin portal, backend |
| [5. Operations & runbooks](#5-operations--runbooks) | Go-live, observability, incidents, DR |
| [6. Compliance & policies](#6-compliance--policies) | Policies index, SOC2/ISO readiness |
| [7. Sprints & roadmap](#7-sprints--roadmap) | Sprint backlog, plans, implementations |
| [8. Reference & other](#8-reference--other) | Roadmaps, release notes, reminders, archive |

---

## 1. Getting started

| Document | Description |
|----------|-------------|
| [**Run the app**](../RUN.md) | One-page guide: run full stack or app-only, default logins |
| [Quick start](./QUICK_START.md) | Full setup: clone, env, Docker, manual setup, first steps |
| [**Project build summary**](./PROJECT_BUILD_SUMMARY.md) | Everything built from day one (customer, vendor, admin, backend, ML, docs) |
| [**Customer website**](./CUSTOMER_WEBSITE.md) | Customer site: features, problems faced, future goals (production-ready reference) |
| [Complete project documentation](./COMPLETE_PROJECT_DOCUMENTATION.md) | End-to-end project overview |
| [Testing guide](./TESTING_GUIDE.md) | How to run and extend tests |

---

## 2. System & architecture

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | System design, components, data flow |
| [API contracts](./api_contracts.yaml) | OpenAPI 3.0 specifications |
| [Security](./security.md) | Security practices and threat model |
| [Deployment](./deployment.md) | Production deployment |
| [Deployment guide (Vercel/Render/Neon)](./DEPLOYMENT_GUIDE.md) | Deploy customer site, API, and DB; demo flow; diagram |
| [Deployment target](./DEPLOYMENT_TARGET.md) | Phase 0: Vercel SPA, Render API, Neon DB |
| [Push to GitHub](./PUSH_TO_GITHUB.md) | Step-by-step: push this repo to GitHub. |
| [DSA notes](./dsa.md) | Algorithms and data structures used in the platform |

---

## 3. Development guides

| Document | Description |
|----------|-------------|
| [Quick start](./QUICK_START.md) | Setup and installation |
| [Testing guide](./TESTING_GUIDE.md) | Testing strategy and execution |
| [Guides index](./guides/README.md) | Run, backend startup, quick start testing |
| [Backend startup](./guides/BACKEND_STARTUP_GUIDE.md) | Backend env and startup |
| [Quick start testing](./guides/QUICK_START_TESTING.md) | Quick path to run tests |
| [Docker troubleshooting](./DOCKER_TROUBLESHOOTING.md) | Docker setup and common issues |
| [Database installation (manual)](./INSTALL_DATABASES_MANUAL.md) | Manual PostgreSQL/DB setup |
| [Step-by-step testing](./STEP_BY_STEP_TESTING_GUIDE.md) | Detailed testing walkthrough |
| [Testing plan](./TESTING_PLAN_COMPLETE.md) | Test planning and coverage |
| [Testing summary](./TESTING_SUMMARY.md) | High-level test summary |
| [Test execution report](./TEST_EXECUTION_REPORT.md) | Execution and results |

---

## 4. Applications

### Customer website

| Document | Description |
|----------|-------------|
| [**Customer website (product doc)**](./CUSTOMER_WEBSITE.md) | **Primary reference:** features delivered, problems faced and resolved, future goals, route index |
| [Project build summary](./PROJECT_BUILD_SUMMARY.md) | What we've built from the start (customer, vendor, admin, backend, ML, docs) |
| [Account portal specification](./customer-website/ACCOUNT_PORTAL_SPECIFICATION.md) | Account, dashboard, orders |
| [Storefront UX intent](./STOREFRONT_UX_INTENT.md) | Storefront and account UX decisions |
| [Customer website summary](./customer-website/COMPLETE_WEBSITE_SUMMARY.md) | Overview of customer-facing features |
| [MFA specification](./customer-website/MFA_SPECIFICATION.md) | Multi-factor authentication |
| [Loyalty specification](./customer-website/LOYALTY_SPECIFICATION.md) | Loyalty and rewards |
| [Design system](./customer-website/DESIGN_SYSTEM.md) | UI and design guidelines |
| [Pages (1–9)](./customer-website/pages/) | Homepage, products, cart, checkout, account pages, wishlist |

Specs: [Homepage](./customer-website/HOMEPAGE_SPECIFICATION.md), [Products](./customer-website/PRODUCTS_PAGE_SPECIFICATION.md), [Product detail](./customer-website/PRODUCT_DETAIL_PAGE_SPECIFICATION.md), [Cart & checkout](./customer-website/CART_CHECKOUT_SPECIFICATION.md), [Advanced features](./customer-website/ADVANCED_FEATURES_SPECIFICATION.md).

### Admin portal

| Document | Description |
|----------|-------------|
| [Admin portal specification](./admin-portal/ADMIN_PORTAL_SPECIFICATION.md) | Admin features and scope |
| [Admin guide](./ADMIN_GUIDE.md) | How to use the admin portal |
| [Admin portal (legacy)](./admin-portal.md) | Legacy admin notes |

### Backend

| Document | Description |
|----------|-------------|
| [Authentication specification](./backend/AUTHENTICATION_SPECIFICATION.md) | Auth system and flows |

### Fixes & implementation notes

| Document | Description |
|----------|-------------|
| [Account / customer portal fixes](./ACCOUNT_CUSTOMER_PORTAL_FIXES.md) | Fixes applied to account portal |
| [User dashboard](./USER_DASHBOARD.md) | Dashboard behaviour and UX |
| [Address persistence](./ADDRESS_PERSISTENCE.md) | How addresses are persisted |
| [Storefront UX intent](./STOREFRONT_UX_INTENT.md) | Storefront UX decisions |
| [Project status](./PROJECT_SO_FAR.md) | Current project state |

---

## 5. Operations & runbooks

| Document | Description |
|----------|-------------|
| [Go-live checklist](./runbooks/GO_LIVE_CHECKLIST.md) | Pre-launch checks |
| [Deployment verification](./runbooks/DEPLOYMENT_VERIFICATION.md) | Post-deploy verification |
| [Observability](./runbooks/OBSERVABILITY.md) | Monitoring and logging |
| [Incident playbooks](./runbooks/INCIDENT_PLAYBOOKS.md) | Incident response |
| [DR plan](./runbooks/DR_PLAN.md) | Disaster recovery |
| [Chaos testing](./runbooks/CHAOS_TESTING.md) | Chaos engineering approach |
| [Load testing](./perf/LOAD_TESTING.md) | Performance and load testing |
| [Performance SLO](./PERFORMANCE_SLO.md) | Service level objectives |
| [CD security](./ci/CD_SECURITY.md) | CI/CD and deployment security |

---

## 6. Compliance & policies

| Document | Description |
|----------|-------------|
| [Policies index](./compliance/POLICIES_INDEX.md) | All compliance and policy docs |
| [SOC2/ISO readiness](./compliance/READINESS_SUMMARY.md) | Compliance readiness summary |

---

## 7. Sprints & roadmap

| Document | Description |
|----------|-------------|
| [Sprint backlog](./sprint_backlog.md) | Backlog and planning |
| [Sprints folder](./sprints/) | Sprint plans and implementations (e.g. 16–22) |
| [Sprint audit](./sprints/SPRINT_AUDIT_2025-11-10.md) | Sprint audit notes |
| [Handoff checklist (1–15)](./sprints/HANDOFF_CHECKLIST_SPRINTS_01-15.md) | Handoff checklist for earlier sprints |
| [Complete implementation roadmap](./COMPLETE_IMPLEMENTATION_ROADMAP.md) | Implementation roadmap |
| [Integration roadmap](./INTEGRATION_ROADMAP_COMPLETE.md) | Integration plans |
| [Release notes (S01–22)](./RELEASE_NOTES_S01-22.md) | Release history |
| [Level-up plan](./LEVEL_UP_PLAN_SPECIFICATION.md) | Level-up and improvement plan |
| [GitHub-ready summary](./GITHUB_READY_SUMMARY.md) | Repo and GitHub readiness |

---

## 8. Reference & other

| Document | Description |
|----------|-------------|
| [Reminders](./REMINDERS.md) | Future work (e.g. OAuth, rate limits, email verification, CAPTCHA) |
| [Demo guide](./DEMO_GUIDE.md) | How to run and present a demo |
| [Session and fix docs](./archive/README.md) | Historical session summaries and one-off fix notes |
| [Root-level session docs](../#documentation) | Auth/login fix docs and run guides in repo root (see main [README](../README.md)) |

### Root and guides

- **Run the app (root):** [RUN.md](../RUN.md)
- **Backend startup & quick testing:** [docs/guides](./guides/README.md) (includes [BACKEND_STARTUP_GUIDE.md](./guides/BACKEND_STARTUP_GUIDE.md), [QUICK_START_TESTING.md](./guides/QUICK_START_TESTING.md))
- **Historical session/fix docs:** [docs/archive](./archive/README.md) (auth/login fixes, testing ready, etc.)

---

## Where to start

| If you want to… | Start here |
|-----------------|------------|
| Run the app | [RUN.md](../RUN.md) |
| See what we've built from the start | [Project build summary](./PROJECT_BUILD_SUMMARY.md) |
| Understand the customer website (features, problems, goals) | [Customer website](./CUSTOMER_WEBSITE.md) |
| Set up the project from scratch | [Quick start](./QUICK_START.md) and [Architecture](./architecture.md) |
| Get one big overview | [Complete project documentation](./COMPLETE_PROJECT_DOCUMENTATION.md) |

---

Easy11 Commerce Intelligence Platform — documentation index. Kept production-ready and up to date.
