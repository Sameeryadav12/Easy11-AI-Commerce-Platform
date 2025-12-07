# 🚀 Easy11 Quick Start Guide

Get the Easy11 Commerce Intelligence Platform up and running in minutes!

---

## Prerequisites

- **Node.js** 20.x or higher
- **Python** 3.11+
- **Docker** 20.10+
- **PostgreSQL** 15+ (or use Docker)
- **Git**

---

## Quick Setup

### 1. Clone Repository

```bash
git clone https://github.com/ocean-sameer/easy11.git
cd easy11
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit with your configuration
nano .env
```

### 3. Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check health
curl http://localhost:5000/health
```

### 4. Access Services

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:5000 | Main API server |
| Frontend | http://localhost:3000 | React storefront |
| ML Service | http://localhost:8000 | FastAPI ML service |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

---

## Manual Setup (Alternative)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Seed data
npm run prisma:seed

# Start server
npm run dev
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### ML Service

```bash
cd ml_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start service
uvicorn main:app --reload
```

---

## First Steps

### 1. Create Admin Account

```bash
# Use Prisma Studio
cd backend
npx prisma studio

# Or via API
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@easy11.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@easy11.com",
    "password": "admin123"
  }'
```

### 3. Browse Products

```bash
curl http://localhost:5000/api/v1/products
```

---

## Development Workflow

### Backend Development

```bash
cd backend

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Generate Prisma client
npx prisma generate

# Database migrations
npx prisma migrate dev
```

### Frontend Development

```bash
cd frontend

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### ML Service Development

```bash
cd ml_service

# Run tests
pytest

# Run linter
pylint src/

# Format code
black src/
```

---

## Testing

### Run All Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# ML Service
cd ml_service && pytest

# Integration tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Coverage Reports

```bash
# Backend coverage
cd backend && npm run test:coverage

# ML Service coverage
cd ml_service && pytest --cov
```

---

## Database Management

### View Database

```bash
cd backend
npx prisma studio
```

### Run Migrations

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Reset Database

```bash
npx prisma migrate reset
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Database Connection Issues

```bash
# Check PostgreSQL
docker-compose ps postgres
docker-compose logs postgres

# Test connection
psql -h localhost -U postgres -d easy11_dev
```

---

## Production Deployment

### Build Docker Images

```bash
docker build -t easy11/backend:latest backend/
docker build -t easy11/frontend:latest frontend/
docker build -t easy11/ml-service:latest ml_service/
```

### Deploy to AWS ECS

```bash
# Configure AWS credentials
aws configure

# Terraform deploy
cd terraform
terraform init
terraform plan
terraform apply
```

---

## Useful Commands

```bash
# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# View running containers
docker-compose ps

# Execute command in container
docker-compose exec backend sh

# View resource usage
docker stats

# Clean Docker
docker system prune -a
```

---

## Next Steps

1. Read [README.md](./README.md) for full documentation
2. Check [docs/architecture.md](./docs/architecture.md) for system design
3. Review [docs/api_contracts.yaml](./docs/api_contracts.yaml) for API specs
4. Explore [docs/dsa.md](./docs/dsa.md) for algorithms
5. See [docs/deployment.md](./docs/deployment.md) for production setup

---

## Need Help?

- **Documentation**: See `/docs` folder
- **Issues**: Open a GitHub issue
- **Team**: ocean@easy11.com, sameer@easy11.com

---

**Happy Coding! 🚀**

