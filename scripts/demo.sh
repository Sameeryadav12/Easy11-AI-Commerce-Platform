#!/bin/bash

# Easy11 One-Click Demo Script
# Launches both customer and admin sites with seeded data

set -e

echo "🚀 Easy11 Commerce Intelligence Platform - Demo Setup"
echo "======================================================"
echo ""

# Colors for output
GREEN='\033[0.32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting." >&2; exit 1; }
echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Step 2: Stop existing containers
echo -e "${BLUE}Step 2: Cleaning up existing containers...${NC}"
docker-compose down -v 2>/dev/null || true
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Step 3: Start services
echo -e "${BLUE}Step 3: Starting all services...${NC}"
docker-compose up -d
echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Step 4: Wait for services to be healthy
echo -e "${BLUE}Step 4: Waiting for services to be healthy...${NC}"
echo "Waiting for PostgreSQL..."
sleep 10

echo "Waiting for Backend API..."
timeout=60
counter=0
until curl -s http://localhost:5000/health > /dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo -e "${YELLOW}⚠️  Backend took longer than expected${NC}"
        break
    fi
done
echo -e "${GREEN}✅ Backend API is healthy${NC}"

echo "Waiting for ML Service..."
until curl -s http://localhost:8000/health > /dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo -e "${YELLOW}⚠️  ML Service took longer than expected${NC}"
        break
    fi
done
echo -e "${GREEN}✅ ML Service is healthy${NC}"
echo ""

# Step 5: Run database migrations and seed
echo -e "${BLUE}Step 5: Setting up database...${NC}"
docker-compose exec -T backend npx prisma migrate deploy
docker-compose exec -T backend npx prisma db seed
echo -e "${GREEN}✅ Database seeded with demo data${NC}"
echo ""

# Step 6: Display access information
echo ""
echo "======================================================"
echo -e "${GREEN}🎉 Demo Environment Ready!${NC}"
echo "======================================================"
echo ""
echo "📱 Access the platforms:"
echo ""
echo -e "  ${BLUE}Customer Site:${NC}"
echo "    URL: http://localhost:3000"
echo "    Test Account: customer@easy11.com / admin123"
echo ""
echo -e "  ${BLUE}Admin Portal:${NC}"
echo "    URL: http://localhost:3001"
echo "    Test Account: admin@easy11.com / admin123"
echo ""
echo -e "  ${BLUE}Backend API:${NC}"
echo "    URL: http://localhost:5000"
echo "    Health: http://localhost:5000/health"
echo ""
echo -e "  ${BLUE}ML Service:${NC}"
echo "    URL: http://localhost:8000"
echo "    Docs: http://localhost:8000/docs"
echo ""
echo -e "  ${BLUE}Superset (Optional):${NC}"
echo "    URL: http://localhost:8088"
echo "    Login: admin / admin123"
echo ""
echo "======================================================"
echo -e "${YELLOW}📖 Guided Tour:${NC}"
echo "======================================================"
echo ""
echo "1. Customer Site Experience:"
echo "   • Browse products"
echo "   • Add items to cart"
echo "   • Search with autocomplete (Trie-based)"
echo "   • View personalized recommendations"
echo ""
echo "2. Admin Portal Tour:"
echo "   • Overview Dashboard - See KPIs"
echo "   • Customers - View RFM segments and churn risks"
echo "   • ML Operations - Monitor model performance"
echo "   • Experiments - Review A/B test results"
echo "   • Data Quality - Check validation suites"
echo "   • BI Dashboards - Explore Superset charts"
echo ""
echo "3. API Exploration:"
echo "   • Try API: curl http://localhost:5000/api/v1/products"
echo "   • View ML: curl http://localhost:8000/health"
echo ""
echo "======================================================"
echo ""
echo -e "${GREEN}✨ Enjoy exploring Easy11!${NC}"
echo ""
echo "To stop: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo ""

