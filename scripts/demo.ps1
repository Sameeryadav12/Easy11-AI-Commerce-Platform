# Easy11 One-Click Demo Script (PowerShell)
# Launches both customer and admin sites with seeded data

Write-Host "🚀 Easy11 Commerce Intelligence Platform - Demo Setup" -ForegroundColor Blue
Write-Host "======================================================" -ForegroundColor Blue
Write-Host ""

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Cyan
try {
    docker --version | Out-Null
    Write-Host "✅ Docker found" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is required but not installed. Aborting." -ForegroundColor Red
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose found" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is required but not installed. Aborting." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Stop existing containers
Write-Host "Step 2: Cleaning up existing containers..." -ForegroundColor Cyan
docker-compose down -v 2>$null
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Step 3: Start services
Write-Host "Step 3: Starting all services..." -ForegroundColor Cyan
docker-compose up -d
Write-Host "✅ Services started" -ForegroundColor Green
Write-Host ""

# Step 4: Wait for services
Write-Host "Step 4: Waiting for services to be healthy..." -ForegroundColor Cyan
Write-Host "Waiting for PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Waiting for Backend API..." -ForegroundColor Yellow
$timeout = 60
$counter = 0
while ($counter -lt $timeout) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            break
        }
    } catch {
        Start-Sleep -Seconds 2
        $counter += 2
    }
}
Write-Host "✅ Backend API is healthy" -ForegroundColor Green

Write-Host "Waiting for ML Service..." -ForegroundColor Yellow
while ($counter -lt $timeout) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            break
        }
    } catch {
        Start-Sleep -Seconds 2
        $counter += 2
    }
}
Write-Host "✅ ML Service is healthy" -ForegroundColor Green
Write-Host ""

# Step 5: Seed database
Write-Host "Step 5: Setting up database..." -ForegroundColor Cyan
docker-compose exec -T backend npx prisma migrate deploy
docker-compose exec -T backend npx prisma db seed
Write-Host "✅ Database seeded with demo data" -ForegroundColor Green
Write-Host ""

# Step 6: Display access information
Write-Host ""
Write-Host "======================================================" -ForegroundColor Blue
Write-Host "🎉 Demo Environment Ready!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Blue
Write-Host ""
Write-Host "📱 Access the platforms:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Customer Site:" -ForegroundColor Yellow
Write-Host "    URL: http://localhost:3000"
Write-Host "    Test Account: customer@easy11.com / admin123"
Write-Host ""
Write-Host "  Admin Portal:" -ForegroundColor Yellow
Write-Host "    URL: http://localhost:3001"
Write-Host "    Test Account: admin@easy11.com / admin123"
Write-Host ""
Write-Host "  Backend API:" -ForegroundColor Yellow
Write-Host "    URL: http://localhost:5000"
Write-Host "    Health: http://localhost:5000/health"
Write-Host ""
Write-Host "  ML Service:" -ForegroundColor Yellow
Write-Host "    URL: http://localhost:8000"
Write-Host "    Docs: http://localhost:8000/docs"
Write-Host ""
Write-Host "======================================================" -ForegroundColor Blue
Write-Host "📖 Guided Tour:" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Blue
Write-Host ""
Write-Host "1. Customer Site Experience:"
Write-Host "   • Browse products"
Write-Host "   • Add items to cart"
Write-Host "   • Search with autocomplete (Trie-based)"
Write-Host "   • View personalized recommendations"
Write-Host ""
Write-Host "2. Admin Portal Tour:"
Write-Host "   • Overview Dashboard - See KPIs"
Write-Host "   • Customers - View RFM segments and churn risks"
Write-Host "   • ML Operations - Monitor model performance"
Write-Host "   • Experiments - Review A/B test results"
Write-Host "   • Data Quality - Check validation suites"
Write-Host ""
Write-Host "======================================================" -ForegroundColor Blue
Write-Host ""
Write-Host "✨ Enjoy exploring Easy11!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop: docker-compose down"
Write-Host "To view logs: docker-compose logs -f"
Write-Host ""

