# 🏢 Easy11 Admin Portal Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [Dashboard Modules](#dashboard-modules)
5. [Security](#security)
6. [Deployment](#deployment)

---

## Overview

The **Easy11 Admin Portal** is a dedicated Next.js application providing enterprise-grade admin capabilities for the Easy11 Commerce Intelligence Platform.

### Purpose

- **Separation of Concerns**: Isolated from customer site for security
- **Role-Based Access**: Granular permissions for different admin roles
- **Analytics Hub**: Centralized BI and ML operations
- **Independent Deployment**: Separate release cycles from customer site

### Key Features

✅ **Analytics Dashboard**: Real-time KPIs and metrics  
✅ **Customer Intelligence**: RFM segmentation and churn analysis  
✅ **Catalog Management**: Product and inventory control  
✅ **ML Operations**: Model monitoring and control  
✅ **A/B Testing**: Experiment management  
✅ **Data Quality**: Great Expectations monitoring  
✅ **BI Dashboards**: Embedded Superset visualizations  

---

## Architecture

### Two-Site Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Customer Site                          │
│                    https://easy11.app                        │
│                  (React + Vite + TypeScript)                 │
│                                                              │
│  • Product browsing and search                               │
│  • Shopping cart and checkout                                │
│  • User profiles                                             │
│  • Personalized recommendations                              │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      API Gateway                             │
│                   Node.js + Express                          │
│                                                              │
│  Public Routes:         Admin Routes (RBAC):                 │
│  • /api/v1/products    • /api/v1/admin/metrics              │
│  • /api/v1/search      • /api/v1/admin/users                │
│  • /api/v1/orders      • /api/v1/admin/catalog              │
│                        • /api/v1/admin/ml-ops               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼────────────────────────────────┐
│                       Admin Portal                           │
│                  https://admin.easy11.app                    │
│                  (Next.js 14 + TypeScript)                   │
│                                                              │
│  • SSO/OIDC Authentication                                   │
│  • Analytics dashboards                                      │
│  • ML operations console                                     │
│  • Catalog management                                        │
│  • Data quality monitoring                                   │
│  • Embedded Superset dashboards                              │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, routing |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Components** | shadcn/ui (Radix UI) | Accessible components |
| **State** | TanStack Query | Server state management |
| **Auth** | NextAuth.js | OIDC/SSO integration |
| **Charts** | Recharts | Data visualization |
| **Forms** | React Hook Form + Zod | Form validation |

---

## Authentication & Authorization

### OIDC/SSO Integration

Using **NextAuth.js** with Keycloak (or Auth0) for enterprise SSO:

```typescript
// apps/admin/src/app/api/auth/[...nextauth]/route.ts
import KeycloakProvider from 'next-auth/providers/keycloak';

const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      issuer: process.env.AUTH_ISSUER,
    }),
  ],
  // Role mapping and callbacks
};
```

### Role Definitions

| Role | Permissions | Access |
|------|------------|--------|
| **ADMIN** | Full access | All modules |
| **ANALYST** | Read analytics, export | Overview, Customers, Forecasts, Experiments |
| **OPS** | Catalog management | Catalog, Data Quality |
| **SUPPORT** | View only | Overview, Customers (limited) |

### RBAC Implementation

```typescript
// apps/admin/src/middleware.ts
const roleAccess = {
  '/dashboard/customers': ['ADMIN', 'ANALYST'],
  '/dashboard/catalog': ['ADMIN', 'OPS'],
  '/dashboard/settings': ['ADMIN'],
  // ... more routes
};
```

### Security Features

- ✅ **MFA Enforcement**: Required for ADMIN role
- ✅ **Session Management**: Short-lived tokens (24h)
- ✅ **Audit Logging**: All admin actions logged
- ✅ **CSRF Protection**: Built into Next.js
- ✅ **Security Headers**: XSS, frame options, CSP

---

## Dashboard Modules

### 1. Overview Dashboard

**Route**: `/dashboard`  
**Access**: All authenticated users

**Features**:
- Revenue KPI card
- Orders KPI card
- Customers KPI card
- Conversion Rate KPI card
- Revenue trend chart (monthly)
- Recent activity feed

**Components**:
- `DashboardOverview.tsx` - Main overview component
- KPI cards with trend indicators
- Time filter (7d, 30d, 90d, 1y)

### 2. Customers Module

**Route**: `/dashboard/customers`  
**Access**: ADMIN, ANALYST

**Features**:
- RFM segmentation table
- Customer segments (Champion, Loyal, At Risk, etc.)
- Churn heatmap
- Individual customer drill-down
- Export to CSV

### 3. Catalog Management

**Route**: `/dashboard/catalog`  
**Access**: ADMIN, OPS

**Features**:
- Product listing with search/filter
- Category tree browser
- Bulk import/export CSV
- Inventory management
- Product attributes editor

### 4. Forecasts

**Route**: `/dashboard/forecasts`  
**Access**: ADMIN, ANALYST

**Features**:
- Category-level forecasts
- Daily/weekly predictions
- Accuracy tables (sMAPE, RMSE)
- Refresh button for manual retrain
- CSV/PDF export

### 5. Recommendations (ML Ops)

**Route**: `/dashboard/recommendations`  
**Access**: ADMIN only

**Features**:
- Model metrics (HitRate@10, precision)
- Latency monitoring
- Cache hit rate
- Promote/rollback buttons
- Model version history

### 6. Experiments

**Route**: `/dashboard/experiments`  
**Access**: ADMIN, ANALYST

**Features**:
- A/B test definition
- Audience targeting
- Uplift visualization
- Statistical significance
- Export reports

### 7. Data Quality

**Route**: `/dashboard/data-quality`  
**Access**: ADMIN, OPS

**Features**:
- Great Expectations suite status
- Failing expectations list
- Data lineage (dbt docs link)
- Validation history

### 8. Dashboards (BI)

**Route**: `/dashboard/bi`  
**Access**: ADMIN, ANALYST

**Features**:
- Embedded Superset dashboards
- Revenue funnel
- Cohort retention
- Product performance
- JWT-based guest tokens

---

## Security

### Defense in Depth

**Layer 1: SSO/OIDC**
- Keycloak or Auth0 for identity
- MFA enforcement for admin
- Session management

**Layer 2: RBAC Middleware**
- Route-level authorization
- API endpoint guards
- Server action protection

**Layer 3: Audit Logging**
- All admin actions logged
- Immutable audit trail
- Searchable logs

**Layer 4: Data Protection**
- PII redaction in logs
- Field-level encryption
- Row-level security (optional)

### Audit Trail Schema

```sql
CREATE TABLE admin_action_logs (
  id UUID PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  user_email VARCHAR NOT NULL,
  user_role VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  resource VARCHAR NOT NULL,
  resource_id VARCHAR,
  changes JSONB,
  ip_address VARCHAR,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  signature VARCHAR -- for chain integrity
);

CREATE INDEX idx_admin_logs_user ON admin_action_logs(user_id);
CREATE INDEX idx_admin_logs_timestamp ON admin_action_logs(timestamp);
CREATE INDEX idx_admin_logs_resource ON admin_action_logs(resource);
```

### CSRF Protection

Next.js provides built-in CSRF protection for:
- Server Actions
- API Routes with session

### Security Headers

```javascript
// next.config.js
headers: [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]
```

---

## Deployment

### Domain Setup

**Customer Site**: `https://easy11.app`  
**Admin Portal**: `https://admin.easy11.app`

### Docker Deployment

```yaml
# docker-compose.yml (addition)
services:
  admin:
    build:
      context: ./apps/admin
    ports:
      - "3001:3000"
    environment:
      - NEXTAUTH_URL=https://admin.easy11.app
      - API_URL=http://backend:5000
    depends_on:
      - backend
```

### AWS ECS Deployment

- Separate ECS service for admin portal
- Internal load balancer for backend communication
- Public ALB for admin.easy11.app with SSL

### Environment Variables

```bash
# Production
NEXTAUTH_URL=https://admin.easy11.app
NEXTAUTH_SECRET=<from-secrets-manager>
AUTH_ISSUER=https://keycloak.easy11.com/realms/easy11
AUTH_CLIENT_ID=<from-secrets-manager>
AUTH_CLIENT_SECRET=<from-secrets-manager>
API_URL=http://internal-alb:5000
SUPERSET_URL=http://superset:8088
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| **LCP (Largest Contentful Paint)** | < 2.5s | TBD |
| **FID (First Input Delay)** | < 100ms | TBD |
| **CLS (Cumulative Layout Shift)** | < 0.1 | TBD |
| **Lighthouse Performance** | ≥ 90 | TBD |
| **Lighthouse Accessibility** | ≥ 95 | TBD |
| **API Response Time (p95)** | < 150ms | TBD |

---

## Development Workflow

### Local Development

```bash
cd apps/admin
npm install
npm run dev
```

Access at: http://localhost:3001

### Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

### Deployment

```bash
# Build Docker image
docker build -t easy11/admin:latest .

# Push to registry
docker push easy11/admin:latest

# Deploy to ECS
aws ecs update-service --cluster easy11 --service admin --force-new-deployment
```

---

## Next Steps

1. ✅ Admin portal skeleton created
2. ✅ OIDC/SSO configuration
3. ⏳ Connect to backend API
4. ⏳ Implement all dashboard modules
5. ⏳ Embed Superset dashboards
6. ⏳ Add ML Ops controls
7. ⏳ Deploy to production

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintained by**: Ocean & Sameer

