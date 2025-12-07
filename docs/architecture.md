# 🏗️ Easy11 Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Component Details](#component-details)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Scalability & Performance](#scalability--performance)
8. [Deployment Architecture](#deployment-architecture)

---

## Overview

Easy11 Commerce Intelligence Platform is a distributed, microservices-based e-commerce system designed for high performance, scalability, and security. The architecture follows **Domain-Driven Design (DDD)** principles with clear separation of concerns.

### Key Architectural Principles

1. **Microservices**: Independent, deployable services
2. **API-First**: RESTful APIs with OpenAPI specifications
3. **Event-Driven**: Asynchronous event processing
4. **CQRS**: Command Query Responsibility Segregation
5. **Security-First**: Defense in depth
6. **Observability**: Comprehensive logging and monitoring

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                    │
│  ┌─────────────────────────┐           ┌──────────────────────────┐        │
│  │   Web Storefront        │           │   Admin Dashboard        │        │
│  │   (React + TypeScript)  │           │   (React + TypeScript)   │        │
│  │                         │           │                          │        │
│  │   • Product Catalog     │           │   • Analytics & KPIs     │        │
│  │   • Shopping Cart       │           │   • User Management      │        │
│  │   • Checkout            │           │   • ML Insights          │        │
│  │   • User Profile        │           │   • Forecasting          │        │
│  └─────────────────────────┘           └──────────────────────────┘        │
└────────────────────────────┬────────────────────────┬───────────────────────┘
                             │                        │
                             ▼                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API Gateway Layer                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Node.js + Express API                            │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Auth      │  │   Product   │  │   Order     │              │   │
│  │  │   Service   │  │   Service   │  │   Service   │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Payment   │  │   Search    │  │   Analytics │              │   │
│  │  │   Service   │  │   Service   │  │   Service   │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Optimization Layer (C++)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Trie       │  │   LRU Cache  │  │   Segment    │  │   ALS Matrix │  │
│  │   Search     │  │              │  │   Tree       │  │   Factorization││
│  │   O(k)       │  │   O(1)       │  │   O(log n)   │  │   O(n²k)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Data Layer (OLTP)                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   MongoDB    │  │    Redis     │  │   S3/S3      │  │
│  │              │  │              │  │   (Cache)    │  │   (Assets)   │  │
│  │  • Users     │  │  • Sessions  │  │  • Sessions  │  │  • Images    │  │
│  │  • Products  │  │  • Events    │  │  • Hot Data  │  │  • Models    │  │
│  │  • Orders    │  │  • Logs      │  │  • Locks     │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ETL/ELT Layer (Data Engineering)                       │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                      Prefect Orchestration                         │   │
│  │                                                                    │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │                    dbt Transformations                      │  │   │
│  │  │                                                            │  │   │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────┐ │  │   │
│  │  │  │   Staging      │  │  Intermediate  │  │   Marts     │ │  │   │
│  │  │  │   Models       │→ │  Models        │→ │   Models    │ │  │   │
│  │  │  └────────────────┘  └────────────────┘  └─────────────┘ │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  │                                                                    │   │
│  │  ┌────────────────────────────────────────────────────────────┐  │   │
│  │  │           Great Expectations Validation                     │  │   │
│  │  │                                                            │  │   │
│  │  │  • Data Quality Checks                                     │  │   │
│  │  │  • Schema Validation                                       │  │   │
│  │  │  • Referential Integrity                                   │  │   │
│  │  └────────────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Analytics Warehouse                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │  PostgreSQL  │  │  BigQuery    │  │   Parquet    │                     │
│  │  Warehouse   │  │  (Optional)  │  │   Data Lake  │                     │
│  │              │  │              │  │   (S3)       │                     │
│  │  • OLAP      │  │  • Scale     │  │  • Archive   │                     │
│  │  • Reports   │  │  • Complex   │  │  • ML Input  │                     │
│  │              │  │    Queries   │  │              │                     │
│  └──────────────┘  └──────────────┘  └──────────────┘                     │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Machine Learning Services (FastAPI)                      │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │              Recommendation Service                        │ │   │
│  │  │  • ALS (Alternating Least Squares)                        │ │   │
│  │  │  • LightFM Hybrid                                          │ │   │
│  │  │  • Content-Based Fallback                                  │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │              Churn Prediction Service                       │ │   │
│  │  │  • XGBoost Classifier                                       │ │   │
│  │  │  • RFM Segmentation                                         │ │   │
│  │  │  • Feature Engineering                                      │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  │                                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │              Forecasting Service                            │ │   │
│  │  │  • Prophet (Facebook)                                       │ │   │
│  │  │  • XGBoost Regression                                       │ │   │
│  │  │  • Time-Series Features                                     │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                       MLflow Tracking                              │   │
│  │  • Experiment Management                                            │   │
│  │  • Model Registry                                                   │   │
│  │  • Artifact Storage                                                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BI & Visualization Layer                                │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                   Apache Superset                                  │   │
│  │                                                                    │   │
│  │  • Dashboards: Revenue, Funnel, Cohorts                           │   │
│  │  • Charts: Churn Trends, Forecasts, Recommendations               │   │
│  │  • SQL Lab: Ad-hoc Querying                                       │   │
│  │  • Security: RBAC, Row-Level Security                             │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Layer

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | React 18.x | Component-based UI |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State Management** | Zustand | Lightweight state |
| **Data Fetching** | React Query | Server state management |
| **Charts** | Recharts | Data visualization |
| **Routing** | React Router v6 | Client-side routing |
| **Forms** | React Hook Form + Zod | Form validation |

### Backend Layer

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js 20.x | JavaScript runtime |
| **Framework** | Express.js | Web server |
| **ORM** | Prisma | Type-safe database access |
| **Language** | TypeScript | Type safety |
| **Authentication** | JWT + bcrypt | Secure auth |
| **Validation** | Zod | Schema validation |
| **Rate Limiting** | express-rate-limit | DDoS protection |

### Optimization Layer

| Component | Language | Purpose |
|-----------|----------|---------|
| **Search** | C++17 | Trie-based autocomplete |
| **Cache** | C++17 | LRU cache implementation |
| **Filtering** | C++17 | Segment tree queries |
| **Recommendations** | C++17 | ALS matrix factorization |
| **Integration** | Node-API (N-API) | Node.js bindings |

### Data Engineering Layer

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **ETL/ELT** | dbt | Transformations |
| **Orchestration** | Prefect | Workflow management |
| **Validation** | Great Expectations | Data quality |
| **Warehouse** | PostgreSQL + BigQuery | Analytics storage |
| **Serialization** | Apache Parquet | Columnar storage |

### ML Layer

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | FastAPI | ML API service |
| **Recommendation** | LightFM, ALS | Collaborative filtering |
| **Churn** | XGBoost | Classification |
| **Forecasting** | Prophet, XGBoost | Time-series |
| **Tracking** | MLflow | Experiment management |
| **Features** | Pandas, NumPy | Data processing |

### Infrastructure Layer

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | App packaging |
| **Orchestration** | Docker Compose | Local dev |
| **Cloud** | AWS ECS | Production |
| **IaC** | Terraform | Infrastructure |
| **CI/CD** | GitHub Actions | Automation |
| **Monitoring** | Prometheus + Grafana | Metrics |
| **Logging** | ELK Stack | Centralized logs |

---

## Component Details

### 1. Frontend Storefront (`frontend/`)

**Structure:**
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProductCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── Cart.tsx
│   ├── pages/               # Page-level components
│   │   ├── Home.tsx
│   │   ├── ProductDetail.tsx
│   │   └── Checkout.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useSearch.ts
│   ├── services/            # API clients
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── store/               # State management
│   │   └── cartStore.ts
│   ├── types/               # TypeScript definitions
│   │   ├── product.ts
│   │   └── user.ts
│   └── App.tsx
```

**Key Features:**
- **Server-Side Rendering (SSR)**: Next.js for SEO
- **Code Splitting**: Dynamic imports for performance
- **Progressive Web App (PWA)**: Offline support
- **Accessibility**: WCAG 2.1 AA compliance

### 2. Backend API (`backend/`)

**Structure:**
```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── productController.ts
│   │   └── orderController.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   └── order.routes.ts
│   ├── services/            # Business logic
│   │   ├── productService.ts
│   │   └── recommendationService.ts
│   ├── models/              # Data models
│   │   └── index.ts
│   └── utils/               # Utilities
│       ├── logger.ts
│       └── errors.ts
├── cpp/                     # C++ modules
│   ├── search.cpp
│   ├── cache.cpp
│   ├── segment_tree.cpp
│   ├── recommender.cpp
│   └── binding.cpp
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── tests/
```

**Design Patterns:**
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **DTOs**: Data Transfer Objects
- **Factory Pattern**: Object creation

### 3. ML Service (`ml_service/`)

**Structure:**
```
ml_service/
├── src/
│   ├── api/                 # FastAPI endpoints
│   │   ├── recommendations.py
│   │   ├── churn.py
│   │   └── forecasting.py
│   ├── models/              # ML models
│   │   ├── als_model.py
│   │   ├── churn_model.py
│   │   └── prophet_model.py
│   ├── services/            # Training & inference
│   │   ├── trainer.py
│   │   └── predictor.py
│   ├── utils/               # Feature engineering
│   │   ├── features.py
│   │   └── preprocessing.py
│   └── main.py
├── mlflow/                  # MLflow tracking
│   └── experiments/
└── data/                    # Sample data
```

**ML Pipeline:**
1. **Data Ingestion**: From warehouse
2. **Feature Engineering**: Time-window features
3. **Training**: Hyperparameter tuning
4. **Validation**: Cross-validation
5. **Deployment**: Model registry
6. **Monitoring**: Drift detection

### 4. Data Engineering (`dbt_project/`)

**Structure:**
```
dbt_project/
├── models/
│   ├── staging/             # Raw → Staged
│   │   ├── stg_orders.sql
│   │   └── stg_products.sql
│   ├── intermediate/        # Reusable models
│   │   ├── int_order_items.sql
│   │   └── int_customer_segments.sql
│   └── marts/               # Business models
│       ├── core/
│       │   ├── fact_orders.sql
│       │   └── dim_products.sql
│       ├── analytics/
│       │   ├── rfm_analysis.sql
│       │   └── cohort_analysis.sql
│       └── ml/
│           └── features.sql
├── macros/
│   └── generate_surrogate_key.sql
├── seeds/
│   └── products.csv
├── tests/
│   ├── relationships.sql
│   └── accepted_values.sql
└── dbt_project.yml
```

---

## Data Flow

### 1. Customer Purchase Flow

```
1. User browses products → React Frontend
2. Add to cart → LocalStorage + API call
3. Search products → Trie C++ module
4. View recommendations → FastAPI ML Service
5. Checkout → Stripe API
6. Order created → PostgreSQL (OLTP)
7. Order event → Kafka/MQ (async)
8. Warehouse update → dbt transformation
9. Analytics dashboard → Superset visualization
```

### 2. ML Prediction Flow

```
1. Scheduled job → Prefect Flow
2. Extract features → dbt models
3. Load model → MLflow registry
4. Generate predictions → XGBoost/Prophet
5. Store results → PostgreSQL
6. Update cache → Redis
7. Serve recommendations → FastAPI endpoint
8. Display on frontend → React dashboard
```

### 3. Analytics Pipeline Flow

```
1. OLTP Events → PostgreSQL
2. Extract → Airbyte/Singer
3. Load → Staging tables
4. Transform → dbt models
5. Validate → Great Expectations
6. Load → Marts (DWH)
7. Visualize → Superset dashboards
8. Alert → Anomaly detection
```

---

## Security Architecture

### Defense in Depth

1. **Perimeter**: WAF, DDoS protection
2. **Network**: VPC, VPN, firewalls
3. **Application**: Authentication, authorization, input validation
4. **Data**: Encryption at rest and in transit
5. **Monitoring**: Intrusion detection, audit logs

### Authentication & Authorization

- **JWT Tokens**: Stateless authentication
- **Refresh Tokens**: Secure rotation
- **RBAC**: Role-based access control
- **OAuth 2.0**: Social login support
- **MFA**: Multi-factor authentication (optional)

### Data Protection

- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Hashing**: bcrypt for passwords
- **PII Scrambling**: Data masking
- **Backup**: Encrypted backups

See [SECURITY.md](./security.md) for detailed threat model.

---

## Scalability & Performance

### Horizontal Scaling

- **Stateless APIs**: Load balanced
- **Cache Layer**: Redis clusters
- **Database**: Read replicas
- **ML Service**: Containerized, auto-scaled

### Performance Optimizations

- **Caching**: Multi-level (Redis, CDN)
- **CDN**: Static asset delivery
- **Compression**: Gzip, Brotli
- **Lazy Loading**: React code splitting
- **Database Indexing**: B-tree, GIN, GiST
- **Query Optimization**: dbt compiled SQL

### Load Testing

- **Target**: 10,000 requests/second
- **P95 Latency**: < 200ms
- **Uptime**: 99.9% SLA

---

## Deployment Architecture

### AWS ECS Deployment

```
┌─────────────────────────────────────────────────────┐
│                  AWS CloudFront (CDN)               │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│              Application Load Balancer              │
└──────────┬──────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌──────────┐  ┌──────────┐
│   ECS    │  │   ECS    │
│ Cluster  │  │ Cluster  │
│          │  │          │
│ Frontend │  │  Backend │
└──────────┘  └──────────┘
    │             │
    │             ▼
    │     ┌──────────────┐
    │     │   ECS Task   │
    │     │  (ML Service)│
    └─────┘  └───────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌─────────┐      ┌─────────┐
│   RDS   │      │ DynamoDB│
│ Postgres│      │ (Cache) │
└─────────┘      └─────────┘
    │
    ▼
┌──────────┐
│  S3      │
│ (Models) │
└──────────┘
```

### CI/CD Pipeline

1. **Code Push** → GitHub
2. **Triggers** → GitHub Actions
3. **Tests** → Unit, integration, E2E
4. **Security Scan** → Trivy, CodeQL
5. **Build** → Docker images
6. **Deploy** → AWS ECS via Terraform
7. **Monitor** → CloudWatch alerts

---

## Monitoring & Observability

### Metrics

- **Application**: Response times, error rates
- **Infrastructure**: CPU, memory, disk
- **Business**: Revenue, conversion rate
- **ML**: Model accuracy, drift

### Logging

- **Centralized**: ELK Stack
- **Structured**: JSON logs
- **Searchable**: Elasticsearch
- **Alerting**: PagerDuty integration

### Tracing

- **Distributed**: OpenTelemetry
- **Visualization**: Jaeger UI
- **Performance**: Latency analysis

---

## Next Steps

1. **Read**: [API Contracts](./api_contracts.yaml)
2. **Read**: [Security Documentation](./security.md)
3. **Read**: [DSA Notes](./dsa.md)
4. **Deploy**: See [deployment.md](./deployment.md)

---

## References

- [React Best Practices](https://react.dev/)
- [Node.js Production Practices](https://nodejs.org/en/docs/guides/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [dbt Documentation](https://docs.getdbt.com/)
- [MLflow Documentation](https://www.mlflow.org/docs/latest/index.html)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained by**: Ocean & Sameer

