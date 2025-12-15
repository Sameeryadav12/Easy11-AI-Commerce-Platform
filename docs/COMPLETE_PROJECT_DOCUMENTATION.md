# 📘 Easy11 Commerce Intelligence Platform - Complete Project Documentation

> **A comprehensive guide to the Easy11 Commerce Intelligence Platform - A secure, AI-driven, full-stack e-commerce and analytics ecosystem combining data engineering, machine learning, and scalable web technologies.**

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Active Development & Testing  
**License**: MIT

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features & Capabilities](#features--capabilities)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Installation & Setup](#installation--setup)
7. [Development Guide](#development-guide)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Security](#security)
11. [Performance Metrics](#performance-metrics)
12. [Team & Contributions](#team--contributions)
13. [Documentation Index](#documentation-index)

---

## 📖 Project Overview

### What is Easy11?

**Easy11 Commerce Intelligence Platform** is a next-generation e-commerce system designed to demonstrate real-world proficiency in:

- **Data Engineering**: ETL/ELT pipelines with dbt, Great Expectations, and Prefect
- **Machine Learning**: XGBoost, Prophet, ALS, and LightFM for recommendations, churn, and forecasting
- **System Design**: Scalable microservices architecture with C++ optimization modules
- **Full-Stack Development**: React + TypeScript frontend, Node.js + Express backend
- **Algorithmic Excellence**: Trie-based search, segment trees, LRU caches, and heap-based retrieval

### Key Highlights

- 🏗️ **Microservices Architecture**: Scalable, independent services
- 🤖 **AI/ML Powered**: Recommendation engine, churn prediction, demand forecasting
- 🔒 **Security-First**: JWT auth, RBAC, encryption, audit logging
- 📊 **Data-Driven**: Complete analytics pipeline with dbt and BI dashboards
- ⚡ **High Performance**: C++ optimization modules for critical paths
- 🎨 **Modern UI**: Responsive React applications with TypeScript

### Project Status

**Current Status**: Active Development & Testing

This project is currently under active development and testing. We are continuously working on:
- **Feature Development**: Building and enhancing core functionality
- **Testing & Quality Assurance**: Comprehensive testing across all components
- **Performance Optimization**: Improving system performance and scalability
- **Documentation**: Keeping documentation up-to-date with latest changes
- **Bug Fixes**: Addressing issues and improving stability

**Note**: As this is an active development project, some features may be in progress or subject to change.

---

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Applications                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ Customer Portal  │  │  Admin Portal    │  │ Vendor Portal│ │
│  │ (React + Vite)   │  │  (Next.js)       │  │ (React+Vite) │ │
│  │ Port: 5173       │  │  Port: 3001      │  │ Port: 5174   │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                  Backend API (Node.js + Express)                 │
│                         Port: 5000                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Auth       │  │   Products   │  │   Orders     │         │
│  │   Routes     │  │   Routes     │  │   Routes     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Search     │  │  Analytics   │  │  Admin       │         │
│  │   Routes     │  │   Routes     │  │   Routes     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              C++ Optimization Layer (N-API)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Trie Search  │  │  LRU Cache   │  │ Segment Tree │         │
│  │   O(k)       │  │    O(1)      │  │  O(log n)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐                                               │
│  │ ALS Matrix   │                                               │
│  │ Factorization│                                               │
│  │   O(n²k)     │                                               │
│  └──────────────┘                                               │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    Data Layer (OLTP)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │   MongoDB    │  │    Redis     │         │
│  │  (Primary)   │  │  (Sessions)  │  │   (Cache)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              Data Engineering Layer                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Prefect Orchestration                      │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │              dbt Transformations                   │  │   │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │   │
│  │  │  │  Staging   │→ │Intermediate│→ │   Marts    │  │  │   │
│  │  │  └────────────┘  └────────────┘  └────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │         Great Expectations Validation              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              Analytics Warehouse                                 │
│                    PostgreSQL / BigQuery                          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              ML Service (FastAPI)                                 │
│                         Port: 8000                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Recommendations│  │Churn Predict │  │ Forecasting  │         │
│  │   (ALS)       │  │  (XGBoost)   │  │  (Prophet)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │  Pricing     │  │  Governance │                            │
│  │  (ML)        │  │  (ML)       │                            │
│  └──────────────┘  └──────────────┘                            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│              BI & Visualization                                  │
│              Apache Superset                                      │
└───────────────────────────────────────────────────────────────────┘
```

### Architectural Principles

1. **Microservices**: Independent, deployable services
2. **API-First**: RESTful APIs with OpenAPI specifications
3. **Event-Driven**: Asynchronous event processing
4. **CQRS**: Command Query Responsibility Segregation
5. **Security-First**: Defense in depth approach
6. **Observability**: Comprehensive logging and monitoring

---

## 🌟 Features & Capabilities

### 🛒 Customer-Facing Features

#### E-commerce Core
- **Product Catalog**: Browse products with pagination, filtering, and sorting
- **Smart Search**: Trie-based autocomplete with TF-IDF ranking
- **Product Details**: Detailed product pages with images, reviews, and specifications
- **Shopping Cart**: Persistent cart with real-time updates
- **Checkout System**: Secure checkout with multiple payment options
- **Order Management**: Order history, tracking, and returns

#### User Experience
- **User Authentication**: Secure login/register with JWT tokens
- **Multi-Factor Authentication (MFA)**: TOTP, SMS, and Passkey support
- **User Profile**: Account management, preferences, and settings
- **Wishlist**: Save favorite products for later
- **Personalized Recommendations**: AI-powered product suggestions
- **Loyalty Program**: Rewards, badges, and tier progression

#### Advanced Features
- **Voice Commerce**: Voice-activated shopping
- **AR Try-On**: Augmented reality product visualization
- **AI Assistant**: Conversational shopping assistant
- **Community Hub**: Reviews, Q&A, and user-generated content

### 📊 Admin Portal Features

#### Dashboard & Analytics
- **Command Center**: Executive overview of platform health, KPIs, and alerts
- **Real-Time KPIs**: Revenue, cohorts, conversion funnel
- **Churn & CLV Visualization**: XGBoost-based predictions with RFM segmentation
- **Forecasted Sales Trends**: Prophet/XGBoost time-series forecasting
- **Systems Analytics**: Platform load, revenue, and anomaly diagnostics

#### Management
- **Vendor Control**: Approve, suspend, and monitor vendors with risk insights
- **Customer Intelligence**: Surface churn risks, loyalty health, and intervention actions
- **Catalog Management**: Product management, categories, and inventory
- **Order Management**: Process and manage customer orders

#### AI & ML Operations
- **AI Control Center**: Adjust personalization levers and monitor model health
- **MLOps**: Model training, deployment, and monitoring
- **Recommendation Management**: Tune recommendation algorithms
- **A/B Testing**: Experiment management and analysis

#### Governance & Compliance
- **Compliance & Consent**: Manage SARs, retention policies, and consent statuses
- **Voice & AR Moderation**: Review voice intents, AR assets, and regional policies
- **Activity Explorer**: Immutable audit trail of every admin action and event
- **Data Quality Dashboard**: Monitor data quality with Great Expectations

#### Business Intelligence
- **Retail Media**: Manage ad campaigns, inventory, and reports
- **ESG Intelligence**: Carbon analytics, ethics, and sustainability KPIs
- **Workflow Studio**: Automate approvals, escalations, and compliance workflows
- **Embedded Dashboards**: Apache Superset integration

### 🏪 Vendor Portal Features

- **Vendor Dashboard**: Analytics and performance metrics
- **Product Management**: Add, edit, and manage products
- **Order Management**: View and process orders
- **Analytics**: Sales reports and insights
- **Settings**: Account and payment settings

### 🤖 ML & Analytics Features

#### Machine Learning Models
- **Recommendation System**: ALS matrix factorization + content-based fallback
  - HitRate@10 > 0.24
  - Collaborative filtering with implicit feedback
- **Churn Prediction**: XGBoost with RFM segmentation
  - AUC > 0.83
  - Real-time risk scoring
- **Demand Forecasting**: Prophet for seasonal patterns
  - sMAPE < 12.5%
  - Time-series forecasting
- **Dynamic Pricing**: ML-based pricing optimization
- **Content Generation**: AI-powered content creation

#### Data Engineering
- **ETL/ELT Pipelines**: Prefect-orchestrated data pipelines
- **dbt Transformations**: Staging → Intermediate → Marts
- **Data Validation**: Great Expectations for data quality
- **Feature Store**: Centralized feature management
- **MLflow Tracking**: Experiment tracking and model registry

#### Business Intelligence
- **Apache Superset**: Interactive dashboards
- **Real-Time Analytics**: Live metrics and KPIs
- **Export Capabilities**: CSV, PDF, and image exports
- **Custom Reports**: Ad-hoc report generation

---

## 🛠️ Technology Stack

### Frontend Technologies

#### Customer Portal (`apps/web/frontend`)
- **Framework**: React 18.x with TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion

#### Admin Portal (`apps/admin`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI)
- **State**: TanStack Query
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

#### Vendor Portal (`apps/vendor-portal`)
- **Framework**: React 18.x with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM

### Backend Technologies

#### API Server (`backend/`)
- **Runtime**: Node.js 20.x
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Cache**: Redis
- **Auth**: JWT with refresh tokens
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod schemas
- **Logging**: Winston

#### C++ Optimization Layer (`backend/cpp/`)
- **Language**: C++17
- **Integration**: Node-API (N-API)
- **Modules**:
  - Trie-based search (`search.cpp`)
  - LRU Cache (`cache.cpp`)
  - Segment Tree (`segment_tree.cpp`)
  - ALS Matrix Factorization (`recommender.cpp`)

### ML & Analytics

#### ML Service (`ml_service/`)
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ML Libraries**:
  - XGBoost (churn prediction)
  - Prophet (forecasting)
  - LightFM (recommendations)
  - Pandas, NumPy (data processing)
- **Tracking**: MLflow
- **Feature Store**: Feast (or custom implementation)

#### Data Engineering
- **dbt**: ELT transformations
- **Prefect**: Workflow orchestration
- **Great Expectations**: Data validation
- **Apache Superset**: BI dashboards

### Data Storage

- **PostgreSQL**: Primary database (OLTP + Warehouse)
- **MongoDB**: Session data and event logs
- **Redis**: Caching and session management
- **BigQuery**: Optional large-scale analytics

### DevOps & Infrastructure

- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Infrastructure as Code**: Terraform
- **Security Scanning**: Trivy, CodeQL
- **Monitoring**: Prometheus + Grafana
- **Error Tracking**: Sentry

---

## 📁 Project Structure

```
easy11/
├── apps/
│   ├── admin/                      # Next.js Admin Portal (Port 3001)
│   │   ├── src/
│   │   │   ├── app/                # Next.js App Router pages
│   │   │   │   ├── dashboard/      # Dashboard pages
│   │   │   │   ├── api/            # API routes
│   │   │   │   └── auth/           # Authentication pages
│   │   │   ├── components/         # UI components
│   │   │   │   ├── dashboard/      # Dashboard components
│   │   │   │   ├── layout/         # Layout components
│   │   │   │   └── ui/             # shadcn/ui components
│   │   │   └── lib/                # Utilities & helpers
│   │   │       ├── navigation.ts    # Navigation configuration
│   │   │       ├── rbac.ts         # Role-based access control
│   │   │       └── utils.ts        # Utility functions
│   │   ├── public/                 # Static assets
│   │   └── package.json
│   │
│   ├── web/
│   │   └── frontend/               # React + Vite Customer Site (Port 5173)
│   │       ├── src/
│   │       │   ├── components/      # Reusable components
│   │       │   │   ├── home/       # Homepage components
│   │       │   │   ├── products/   # Product components
│   │       │   │   ├── cart/       # Cart components
│   │       │   │   ├── auth/       # Auth components
│   │       │   │   ├── account/    # Account components
│   │       │   │   └── ui/         # UI components
│   │       │   ├── pages/          # Page components
│   │       │   ├── hooks/          # Custom hooks
│   │       │   ├── services/       # API clients
│   │       │   ├── store/          # State management (Zustand)
│   │       │   ├── types/          # TypeScript types
│   │       │   └── utils/          # Utility functions
│   │       ├── public/             # Static assets
│   │       └── package.json
│   │
│   └── vendor-portal/              # React + Vite Vendor Portal (Port 5174)
│       ├── src/
│       │   ├── components/          # Vendor components
│       │   └── App.tsx
│       ├── public/
│       └── package.json
│
├── backend/                        # Node.js + Express Backend (Port 5000)
│   ├── src/
│   │   ├── middleware/             # Express middleware
│   │   │   ├── auth.middleware.ts  # Authentication
│   │   │   ├── error.middleware.ts # Error handling
│   │   │   └── cache.middleware.ts # Caching
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.routes.ts      # Authentication routes
│   │   │   ├── product.routes.ts   # Product routes
│   │   │   ├── order.routes.ts     # Order routes
│   │   │   ├── admin.routes.ts     # Admin routes
│   │   │   └── analytics.routes.ts # Analytics routes
│   │   ├── services/               # Business logic
│   │   ├── utils/                  # Utilities
│   │   │   ├── logger.ts           # Logging
│   │   │   └── audit.ts            # Audit logging
│   │   └── server.ts               # Main server file
│   ├── cpp/                        # C++ optimization modules
│   │   ├── search.cpp              # Trie-based search
│   │   ├── cache.cpp               # LRU cache
│   │   ├── segment_tree.cpp         # Range queries
│   │   ├── recommender.cpp         # ALS matrix factorization
│   │   └── Makefile                # Build configuration
│   ├── prisma/                     # Database schema & migrations
│   │   ├── schema.prisma           # Prisma schema
│   │   ├── migrations/             # Database migrations
│   │   └── seed.ts                 # Database seeding
│   └── package.json
│
├── ml_service/                     # FastAPI ML Service (Port 8000)
│   ├── src/
│   │   ├── api/                    # API endpoints
│   │   │   ├── recommendations.py  # Recommendation endpoints
│   │   │   ├── churn.py            # Churn prediction endpoints
│   │   │   ├── forecasting.py     # Forecasting endpoints
│   │   │   ├── pricing.py         # Pricing endpoints
│   │   │   └── governance.py      # Governance endpoints
│   │   ├── services/               # ML services
│   │   │   ├── recommendation_service.py
│   │   │   ├── churn_service.py
│   │   │   └── forecasting_service.py
│   │   └── utils/                  # Utilities
│   ├── feature_store/              # Feature store implementation
│   ├── mlflow/                     # MLflow experiment tracking
│   └── requirements.txt
│
├── packages/                       # Shared packages
│   ├── telemetry-client/           # Telemetry SDK
│   │   ├── index.js
│   │   ├── index.d.ts
│   │   └── package.json
│   └── sdk/                        # TypeScript SDK
│       └── easy11-sdk.ts
│
├── dbt_project/                    # dbt transformations
│   ├── models/
│   │   ├── staging/                # Raw data cleanup
│   │   ├── intermediate/           # Reusable models
│   │   └── marts/                  # Business models
│   ├── macros/                     # dbt macros
│   ├── tests/                      # Data tests
│   └── dbt_project.yml
│
├── great_expectations/             # Data validation
│   ├── expectations/               # Validation rules
│   └── great_expectations.yml
│
├── prefect_flows/                  # Prefect workflows
│   ├── etl_flow.py                 # ETL pipeline
│   └── ml_retrain.py               # Model retraining
│
├── infra/                          # Infrastructure
│   ├── terraform/                  # Infrastructure as Code
│   │   ├── main.tf
│   │   └── variables.tf
│   └── telemetry/                  # Telemetry configuration
│
├── docs/                           # Documentation
│   ├── README.md                   # Documentation index
│   ├── QUICK_START.md             # Quick start guide
│   ├── architecture.md            # System architecture
│   ├── api_contracts.yaml         # OpenAPI specs
│   ├── security.md                # Security documentation
│   ├── deployment.md              # Deployment guide
│   ├── TESTING_GUIDE.md           # Testing documentation
│   ├── dsa.md                     # Algorithms explained
│   ├── admin-portal/              # Admin portal docs
│   ├── customer-website/           # Customer site docs
│   ├── runbooks/                  # Operations runbooks
│   ├── sprints/                   # Sprint documentation
│   └── archive/                   # Archived documentation
│
├── scripts/                        # Utility scripts
│   ├── demo.ps1 / demo.sh         # Demo scripts
│   └── verify_dev.ps1 / .sh       # Development verification
│
├── docker-compose.yml             # Local development
├── docker-compose.superset.yml    # Superset configuration
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI/CD pipeline
│       └── security.yml           # Security scans
├── README.md                      # Main README
├── LICENSE                        # MIT License
└── CONTRIBUTING.md                # Contribution guidelines
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 20.x or higher
- **Python** 3.11+
- **Docker** 20.10+ and Docker Compose
- **PostgreSQL** 15+ (or use Docker)
- **Redis** (or use Docker)
- **Git**

### Quick Setup with Docker

```bash
# 1. Clone the repository
git clone https://github.com/Sameeryadav12/Easy11-AI-Commerce-Platform.git
cd Easy11-AI-Commerce-Platform

# 2. Start all services
docker-compose up -d

# 3. Check service health
curl http://localhost:5000/health
```

### Manual Setup

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

#### 2. Admin Portal Setup

```bash
cd apps/admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Admin Portal will run on: `http://localhost:3001`

#### 3. Customer Frontend Setup

```bash
cd apps/web/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Customer Frontend will run on: `http://localhost:5173` (Vite default)

#### 4. Vendor Portal Setup

```bash
cd apps/vendor-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

Vendor Portal will run on: `http://localhost:5174` (or next available port)

#### 5. ML Service Setup

```bash
cd ml_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start service
uvicorn src.main:app --reload --port 8000
```

ML Service will run on: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

#### 6. dbt Setup

```bash
cd dbt_project

# Install dbt dependencies
dbt deps

# Run transformations
dbt run

# Run tests
dbt test
```

### Environment Variables

Create `.env` files in each service directory:

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
ADMIN_URL=http://localhost:3001
```

**Admin Portal** (`apps/admin/.env.local`):
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**ML Service** (`ml_service/.env`):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
MLFLOW_TRACKING_URI=file://./mlflow
REDIS_URL=redis://localhost:6379
```

---

## 💻 Development Guide

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**

3. **Commit changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Running Services Locally

Use the provided scripts:

**Windows**:
```powershell
.\start-services.ps1
```

**Linux/Mac**:
```bash
./start-services.sh
```

Or use the comprehensive setup script:
```powershell
.\run-easy11.ps1
```

### Code Quality

#### Backend
```bash
cd backend

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

#### Frontend
```bash
cd apps/web/frontend

# Lint code
npm run lint

# Format code
npm run format
```

#### ML Service
```bash
cd ml_service

# Lint code
pylint src/

# Format code
black src/
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Frontend Tests

```bash
cd apps/web/frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### ML Service Tests

```bash
cd ml_service

# Run tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html
```

### Integration Tests

```bash
# Using Docker Compose
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build all images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

See [Deployment Guide](./deployment.md) for detailed production deployment instructions including:
- AWS ECS deployment
- Terraform infrastructure setup
- Environment configuration
- Database migrations
- SSL/TLS setup

---

## 🔐 Security

### Authentication & Authorization

- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **Role-Based Access Control (RBAC)**: System admin, ops analyst, AI manager, support agent, compliance officer
- **Multi-Factor Authentication (MFA)**: TOTP, SMS, Passkey support
- **Password Security**: bcrypt hashing (12 rounds)

### Data Protection

- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: Content Security Policy headers

### API Security

- **Rate Limiting**: Express-rate-limit middleware
- **CORS**: Configured for allowed origins
- **Helmet.js**: Security headers
- **Audit Logging**: Comprehensive event tracking

### Security Scanning

- **CodeQL**: Automated code security analysis
- **Trivy**: Container vulnerability scanning
- **Dependency Review**: Automated dependency vulnerability checks

See [Security Documentation](./security.md) for detailed security practices.

---

## 📊 Performance Metrics

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Recommendation HitRate@10 | > 0.20 | 0.24 | ✅ |
| Churn Prediction AUC | ≥ 0.80 | 0.83 | ✅ |
| Forecast sMAPE | < 15% | 12.5% | ✅ |
| API Latency (p95) | < 200ms | 145ms | ✅ |
| Test Coverage | ≥ 85% | 87% | ✅ |
| Security Vulnerabilities | 0 Critical | 0 | ✅ |

### Algorithm Performance

| Algorithm | Complexity | Use Case | Performance |
|-----------|-----------|----------|-------------|
| Trie Search | O(k) | Autocomplete | < 50ms |
| LRU Cache | O(1) | Query caching | < 1ms |
| Segment Tree | O(log n) | Range queries | < 10ms |
| ALS Matrix Factorization | O(n²k) | Recommendations | < 200ms |

---

## 👥 Team & Contributions

### Ocean — Data Engineer & ML Specialist

**Responsibilities:**
- Architected data pipelines and ML services
- Implemented XGBoost, Prophet, ALS, and LightFM models
- Designed ETL/ELT with dbt and Great Expectations
- Containerized FastAPI ML microservices with MLflow
- Implemented heap-based retrieval, hash maps, and sparse matrices
- RFM-based churn scoring and time-series forecasting

**Contact:**
- LinkedIn: [https://www.linkedin.com/in/ocean-ocean/](https://www.linkedin.com/in/ocean-ocean/)
- Email: oceanocean1823@gmail.com

### Sameer — Full Stack & Systems Engineer

**Responsibilities:**
- Built React + TypeScript storefront and admin dashboard
- Integrated Stripe, JWT Auth, real-time analytics, and A/B testing
- Developed search, caching, and pagination algorithms in C++
- Deployed via Docker, GitHub Actions, and Terraform to AWS ECS
- Applied SOLID OOP principles and managed CI/CD
- Implemented Trie-based autocomplete and segment tree filtering

**Contact:**
- LinkedIn: [https://www.linkedin.com/in/sameer-yadav1](https://www.linkedin.com/in/sameer-yadav1)
- Email: rishisameer7@gmail.com

---

## 📚 Documentation Index

### Getting Started
- **[Quick Start Guide](./QUICK_START.md)**: Get the platform running in minutes
- **[Testing Guide](./TESTING_GUIDE.md)**: Comprehensive testing documentation
- **[Installation Guide](./INSTALL_DATABASES_MANUAL.md)**: Manual database setup

### Core Documentation
- **[Architecture](./architecture.md)**: System design, components, and data flow
- **[API Contracts](./api_contracts.yaml)**: OpenAPI 3.0 specifications
- **[Security](./security.md)**: Security practices and threat model
- **[Deployment](./deployment.md)**: Production deployment guide
- **[DSA Notes](./dsa.md)**: Algorithms and data structures explained

### Application Documentation
- **[Admin Portal](./admin-portal/ADMIN_PORTAL_SPECIFICATION.md)**: Admin portal features
- **[Customer Website](./customer-website/)**: Complete customer-facing features
- **[Backend Authentication](./backend/AUTHENTICATION_SPECIFICATION.md)**: Auth system details

### Operations
- **[Runbooks](./runbooks/)**: Operational runbooks and playbooks
- **[Compliance](./compliance/)**: Compliance and security policies
- **[Performance](./perf/LOAD_TESTING.md)**: Performance testing guides

### Development
- **[Sprint Documentation](./sprints/)**: Sprint plans and implementations
- **[Implementation Roadmap](./COMPLETE_IMPLEMENTATION_ROADMAP.md)**: Complete roadmap

For the complete documentation index, see [docs/README.md](./README.md).

---

## 🔄 Development Roadmap

### ✅ Completed Sprints

#### Sprint 1: Foundations & MVP Storefront
- ✅ Basic storefront with auth and checkout
- ✅ C++ modules (Trie + LRU)
- ✅ Event tracking + OLTP schema
- ✅ CI/CD configured

#### Sprint 2: Analytics & Data Models
- ✅ dbt models for orders and RFM
- ✅ Great Expectations validation
- ✅ Superset dashboards
- ✅ Segment tree filtering

#### Sprint 3: Machine Learning Services
- ✅ ALS + XGBoost models
- ✅ FastAPI ML endpoints
- ✅ MLflow tracking
- ✅ Prefect orchestration

#### Sprint 4: Forecasts & Final Polish
- ✅ Prophet forecasting
- ✅ A/B testing framework
- ✅ Audit logs + encryption
- ✅ Documentation

### 🚧 Current Work

- Active development and testing
- Feature enhancements
- Performance optimization
- Bug fixes and stability improvements

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) for details.

---

## 🙏 Acknowledgments

- **Apache Superset** for BI dashboards
- **dbt** for ELT transformations
- **MLflow** for experiment tracking
- **Prefect** for workflow orchestration
- **Trivy** for security scanning
- **CodeQL** for code security analysis

---

## 📧 Contact

- **Ocean**: [LinkedIn](https://www.linkedin.com/in/ocean-ocean/) | [Email](mailto:oceanocean1823@gmail.com)
- **Sameer**: [LinkedIn](https://www.linkedin.com/in/sameer-yadav1) | [Email](mailto:rishisameer7@gmail.com)

---

<div align="center">
  <p>Built with ❤️ by Ocean & Sameer</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Active Development & Testing

