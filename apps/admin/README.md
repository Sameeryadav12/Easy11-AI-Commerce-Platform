# Easy11 Admin Portal

Enterprise-grade admin portal for Easy11 Commerce Intelligence Platform.

## 🎯 Purpose

Dedicated admin interface for:
- Analytics & BI Dashboards
- ML Operations & Model Management
- Catalog & Inventory Management
- Customer Segmentation & Churn Analysis
- A/B Testing & Experiments
- Data Quality Monitoring
- User & Role Management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **State**: TanStack Query
- **Auth**: NextAuth.js (OIDC/SSO)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## 🚀 Getting Started

```bash
cd apps/admin

# Install dependencies
npm install

# Run development server
npm run dev
```

Access at: http://localhost:3001

## 📁 Structure

```
apps/admin/
├── src/
│   ├── app/                # App Router pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   ├── layout/         # Layout components
│   │   ├── dashboard/      # Dashboard components
│   │   └── ui/             # shadcn/ui components
│   └── lib/
│       └── utils.ts        # Utilities
├── public/                 # Static assets
└── package.json
```

## 🔐 Security

- OIDC/SSO authentication required
- RBAC role enforcement (admin, analyst, ops, support)
- CSRF protection on all forms
- Audit logging for admin actions
- Row-level security where applicable

## 📊 Features

### Dashboard Modules
- **Overview**: KPIs, revenue, orders, conversion
- **Customers**: RFM segments, churn analysis
- **Catalog**: Product management, categories
- **Forecasts**: Demand predictions
- **Recommendations**: ML model ops
- **Experiments**: A/B testing
- **Data Quality**: Great Expectations
- **Dashboards**: Embedded Superset

## 🎨 Design System

Using shadcn/ui components for consistent, accessible UI:
- Cards, Buttons, Forms
- Dropdowns, Dialogs, Tabs
- Data tables with sorting/filtering
- Charts and visualizations

## 📚 Documentation

See [docs/admin-portal.md](../../docs/admin-portal.md) for complete documentation.

