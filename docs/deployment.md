# 🚀 Easy11 Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [AWS ECS Deployment](#aws-ecs-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Monitoring & Logging](#monitoring--logging)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Development Tools

- **Node.js** 20.x or higher
- **Python** 3.11+
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **PostgreSQL** 15+ (or use Docker)
- **Redis** 7+ (or use Docker)
- **Git** 2.30+

### Cloud Services

- **AWS Account** (for production)
- **AWS ECS** cluster
- **AWS RDS** (PostgreSQL)
- **AWS ElastiCache** (Redis)
- **AWS S3** (model artifacts)
- **AWS Secrets Manager**
- **AWS CloudWatch** (monitoring)
- **CloudFlare** (CDN and WAF)

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/ocean-sameer/easy11.git
cd easy11
```

### 2. Environment Setup

```bash
# Copy environment files
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Start Services with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Manual Setup (Alternative)

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### ML Service Setup

```bash
cd ml_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run ML service
uvicorn main:app --reload
```

#### dbt Setup

```bash
cd dbt_project

# Install dependencies
dbt deps

# Run transformations
dbt run

# Run tests
dbt test
```

---

## AWS ECS Deployment

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CloudFlare (CDN + WAF)              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                Application Load Balancer                │
└───────┬──────────────────────┬─────────────────────────┘
        │                      │
        ▼                      ▼
┌─────────────┐         ┌─────────────┐
│   ECS       │         │   ECS       │
│  Frontend   │         │  Backend    │
│  Service    │         │  Service    │
└─────────────┘         └──────┬──────┘
                               │
                      ┌────────▼─────────┐
                      │    ECS Task      │
                      │  (ML Service)    │
                      └────────┬─────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
      ┌─────────────┐                  ┌─────────────┐
      │     RDS     │                  │ ElastiCache │
      │ PostgreSQL  │                  │   Redis     │
      └─────────────┘                  └─────────────┘
              │
              ▼
      ┌─────────────┐
      │      S3     │
      │ (Artifacts) │
      └─────────────┘
```

### 1. Infrastructure as Code (Terraform)

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

**Key Resources**:
- ECS Cluster
- Application Load Balancer
- RDS PostgreSQL
- ElastiCache Redis
- S3 Buckets
- IAM Roles and Policies
- Security Groups
- CloudWatch Log Groups

### 2. Build Docker Images

```bash
# Backend
docker build -t easy11/backend:latest backend/
docker tag easy11/backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/easy11/backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/easy11/backend:latest

# Frontend
docker build -t easy11/frontend:latest frontend/
docker tag easy11/frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/easy11/frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/easy11/frontend:latest

# ML Service
docker build -t easy11/ml-service:latest ml_service/
docker tag easy11/ml-service:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/easy11/ml-service:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/easy11/ml-service:latest
```

### 3. Deploy to ECS

```bash
# Update ECS service
aws ecs update-service \
  --cluster easy11-cluster \
  --service backend-service \
  --force-new-deployment

# Monitor deployment
aws ecs describe-services \
  --cluster easy11-cluster \
  --services backend-service frontend-service ml-service
```

### 4. CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to ECR
        run: |
          aws ecr get-login-password --region us-east-1 | \
          docker login --username AWS --password-stdin $ECR_REGISTRY
      
      - name: Build and push Docker images
        run: |
          docker-compose -f docker-compose.prod.yml build
          docker-compose -f docker-compose.prod.yml push
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster easy11-cluster --service $SERVICE_NAME --force-new-deployment
```

---

## Environment Configuration

### Development

```env
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/easy11_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key
STRIPE_SECRET_KEY=sk_test_...
ML_SERVICE_URL=http://localhost:8000
```

### Staging

```env
# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://user:password@staging-rds.amazonaws.com:5432/easy11_staging
REDIS_URL=redis://staging-redis.amazonaws.com:6379
JWT_SECRET=staging-secret-key-from-secrets-manager
STRIPE_SECRET_KEY=sk_test_...
ML_SERVICE_URL=https://ml-service-staging.easy11.com
SUPERSET_URL=https://superset-staging.easy11.com
```

### Production

```env
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-rds.amazonaws.com:5432/easy11_prod
REDIS_URL=redis://prod-redis.amazonaws.com:6379
JWT_SECRET=<from-secrets-manager>
STRIPE_SECRET_KEY=<from-secrets-manager>
ML_SERVICE_URL=https://ml-service.easy11.com
SUPERSET_URL=https://superset.easy11.com
SENTRY_DSN=<from-secrets-manager>
AWS_ACCESS_KEY_ID=<from-secrets-manager>
AWS_SECRET_ACCESS_KEY=<from-secrets-manager>
```

---

## Database Setup

### 1. PostgreSQL Setup

```bash
# Create database
createdb easy11_prod

# Run migrations
cd backend
npx prisma migrate deploy

# Seed data (optional)
npx prisma db seed
```

### 2. Create Read Replicas

```bash
# Using AWS RDS Console or Terraform
aws rds create-db-instance-read-replica \
  --db-instance-identifier easy11-prod-readonly \
  --source-db-instance-identifier easy11-prod-master
```

### 3. Connection Pooling

```typescript
// backend/src/db/connection.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
});

// Connection pooling configuration
const poolConfig = {
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};
```

---

## Monitoring & Logging

### CloudWatch Logs

```typescript
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';

const cloudWatch = new CloudWatchLogs();

const createLogGroup = async (logGroupName: string) => {
  await cloudWatch.createLogGroup({
    logGroupName
  }).promise();
};

const sendLog = async (logGroupName: string, message: string) => {
  await cloudWatch.putLogEvents({
    logGroupName,
    logStreamName: 'app',
    logEvents: [
      {
        message,
        timestamp: Date.now()
      }
    ]
  }).promise();
};
```

### Prometheus & Grafana

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Health Checks

```typescript
// backend/src/routes/health.ts
import { Router, Request, Response } from 'express';
import { prisma } from '../db/connection';
import Redis from 'ioredis';

const router = Router();
const redis = new Redis(process.env.REDIS_URL);

router.get('/health', async (req: Request, res: Response) => {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      cache: 'unknown',
      ml_service: 'unknown'
    }
  };
  
  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.services.database = 'healthy';
  } catch (error) {
    checks.services.database = 'unhealthy';
    checks.status = 'degraded';
  }
  
  // Check cache
  try {
    await redis.ping();
    checks.services.cache = 'healthy';
  } catch (error) {
    checks.services.cache = 'unhealthy';
    checks.status = 'degraded';
  }
  
  // Check ML service
  try {
    const response = await fetch(`${process.env.ML_SERVICE_URL}/health`);
    if (response.ok) {
      checks.services.ml_service = 'healthy';
    } else {
      checks.services.ml_service = 'unhealthy';
      checks.status = 'degraded';
    }
  } catch (error) {
    checks.services.ml_service = 'unhealthy';
    checks.status = 'degraded';
  }
  
  const statusCode = checks.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(checks);
});

export default router;
```

---

## Rollback Procedures

### 1. Rollback Database Migration

```bash
cd backend

# List migrations
npx prisma migrate status

# Rollback to specific migration
npx prisma migrate resolve --rolled-back <migration-name>
```

### 2. Rollback Docker Image

```bash
# Rollback to previous ECS task definition
aws ecs update-service \
  --cluster easy11-cluster \
  --service backend-service \
  --task-definition backend-service:previous-version
```

### 3. Rollback Terraform Infrastructure

```bash
cd terraform

# View previous state
terraform state list

# Rollback to previous state
terraform apply -state=previous-state.tfstate
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check PostgreSQL logs
docker logs postgres-container

# Test connection
psql -h localhost -U user -d easy11_dev

# Check connection pool
SELECT * FROM pg_stat_activity;
```

#### 2. Docker Container Crashes

```bash
# View container logs
docker logs -f <container-id>

# Check container resource usage
docker stats

# Restart container
docker restart <container-id>
```

#### 3. ECS Service Not Starting

```bash
# View service events
aws ecs describe-services \
  --cluster easy11-cluster \
  --services backend-service

# View task logs
aws logs tail /ecs/backend-service --follow

# Check task definition
aws ecs describe-task-definition \
  --task-definition backend-service
```

#### 4. Memory Issues

```typescript
// Add memory profiling
import { performance } from 'perf_hooks';

const monitorMemory = () => {
  const usage = process.memoryUsage();
  console.log({
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`
  });
};

setInterval(monitorMemory, 60000);
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security scans complete
- [ ] Code review approved
- [ ] Database migrations tested
- [ ] Documentation updated
- [ ] Rollback plan prepared

### Deployment

- [ ] Environment variables configured
- [ ] Docker images built and pushed
- [ ] Database migrations deployed
- [ ] ECS services updated
- [ ] Health checks passing
- [ ] Monitoring dashboards operational

### Post-Deployment

- [ ] Smoke tests executed
- [ ] Performance metrics verified
- [ ] Error rates monitored
- [ ] User acceptance testing
- [ ] Team notification sent

---

## Quick Reference

### URLs

- **Production**: https://easy11.com
- **Staging**: https://staging.easy11.com
- **API Docs**: https://api.easy11.com/docs
- **Superset**: https://superset.easy11.com
- **Grafana**: https://grafana.easy11.com

### Commands

```bash
# Start local development
docker-compose up -d

# Run tests
npm test

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production

# View logs
docker-compose logs -f backend
```

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained by**: Ocean & Sameer

