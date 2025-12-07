# Easy11 Manual Setup Script (No Docker Required)
# Run this as Administrator

Write-Host "================================" -ForegroundColor Cyan
Write-Host "   Easy11 Manual Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "OK Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR Node.js NOT found!" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Python
Write-Host "`n[2/5] Checking Python..." -ForegroundColor Yellow
if (Test-Command "python") {
    $pythonVersion = python --version
    Write-Host "OK Python installed: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR Python NOT found!" -ForegroundColor Red
    Write-Host "  Download from: https://www.python.org/" -ForegroundColor Yellow
    exit 1
}

# Check PostgreSQL
Write-Host "`n[3/5] Checking PostgreSQL..." -ForegroundColor Yellow
if (Test-Command "psql") {
    $pgVersion = psql --version
    Write-Host "OK PostgreSQL installed: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "WARNING PostgreSQL NOT found!" -ForegroundColor Yellow
    Write-Host "  You need to install it:" -ForegroundColor Yellow
    Write-Host "  https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

# Check Redis
Write-Host "`n[4/5] Checking Redis..." -ForegroundColor Yellow
if (Test-Command "redis-server") {
    Write-Host "OK Redis installed" -ForegroundColor Green
} else {
    Write-Host "WARNING Redis NOT found!" -ForegroundColor Yellow
    Write-Host "  Download from:" -ForegroundColor Yellow
    Write-Host "  https://github.com/tporadowski/redis/releases" -ForegroundColor Cyan
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

# Create environment files
Write-Host "`n[5/5] Creating environment files..." -ForegroundColor Yellow

$randomSuffix = Get-Random

# Backend .env
$backendEnvContent = @"
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-change-in-production-$randomSuffix
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-$randomSuffix
FRONTEND_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
ADMIN_URL=http://localhost:3001
"@

$backendEnvPath = Join-Path $PSScriptRoot "backend\.env"
if (!(Test-Path $backendEnvPath)) {
    $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding utf8
    Write-Host "OK Created backend/.env" -ForegroundColor Green
} else {
    Write-Host "  backend/.env already exists" -ForegroundColor Gray
}

# Admin .env.local
$adminEnvContent = @"
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-nextauth-secret-$randomSuffix
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_OIDC_CLIENT_ID=easy11-admin
NEXTAUTH_OIDC_CLIENT_SECRET=dev-secret
NEXTAUTH_OIDC_ISSUER=http://localhost:8080/realms/easy11
"@

$adminEnvPath = Join-Path $PSScriptRoot "apps\admin\.env.local"
if (!(Test-Path $adminEnvPath)) {
    $adminEnvContent | Out-File -FilePath $adminEnvPath -Encoding utf8
    Write-Host "OK Created apps/admin/.env.local" -ForegroundColor Green
} else {
    Write-Host "  apps/admin/.env.local already exists" -ForegroundColor Gray
}

# ML Service .env
$mlEnvContent = @"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
MLFLOW_TRACKING_URI=file://./mlflow
REDIS_URL=redis://localhost:6379
"@

$mlEnvPath = Join-Path $PSScriptRoot "ml_service\.env"
if (!(Test-Path $mlEnvPath)) {
    $mlEnvContent | Out-File -FilePath $mlEnvPath -Encoding utf8
    Write-Host "OK Created ml_service/.env" -ForegroundColor Green
} else {
    Write-Host "  ml_service/.env already exists" -ForegroundColor Gray
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start PostgreSQL:" -ForegroundColor Cyan
Write-Host "   net start postgresql-x64-15" -ForegroundColor White
Write-Host ""
Write-Host "2. Create database:" -ForegroundColor Cyan
Write-Host "   psql -U postgres -c CREATE DATABASE easy11_dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Start Redis (in a new terminal):" -ForegroundColor Cyan
Write-Host "   redis-server" -ForegroundColor White
Write-Host ""
Write-Host "4. Setup and Start Backend (in a new terminal):" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npx prisma generate" -ForegroundColor White
Write-Host "   npx prisma migrate dev" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "5. Start Admin Portal (in a new terminal):" -ForegroundColor Cyan
Write-Host "   cd apps\admin" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "6. Start ML Service (in a new terminal):" -ForegroundColor Cyan
Write-Host "   cd ml_service" -ForegroundColor White
Write-Host "   python -m venv venv" -ForegroundColor White
Write-Host "   .\venv\Scripts\activate" -ForegroundColor White
Write-Host "   pip install -r requirements.txt" -ForegroundColor White
Write-Host "   uvicorn src.main:app --reload --port 8000" -ForegroundColor White
Write-Host ""
Write-Host "Or run: .\start-services.ps1" -ForegroundColor Yellow
Write-Host ""
