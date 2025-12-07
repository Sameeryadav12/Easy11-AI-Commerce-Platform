# Easy11 - Complete Startup Script
# This will check, setup, and start everything

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Easy11 - Complete Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if PostgreSQL is ready
Write-Host "[1/5] Checking PostgreSQL..." -ForegroundColor Yellow
$pgReady = $false
$retries = 0
$maxRetries = 3

while (-not $pgReady -and $retries -lt $maxRetries) {
    if (Get-Command "psql" -ErrorAction SilentlyContinue) {
        Write-Host "  [OK] PostgreSQL found!" -ForegroundColor Green
        $pgReady = $true
    } else {
        $retries++
        if ($retries -lt $maxRetries) {
            Write-Host "  [!!] PostgreSQL not found, retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        }
    }
}

if (-not $pgReady) {
    Write-Host "  [X] PostgreSQL not installed yet" -ForegroundColor Red
    Write-Host "      The installation may still be running." -ForegroundColor Yellow
    Write-Host "      Please wait for it to complete and try again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Check if Redis is ready
Write-Host "`n[2/5] Checking Redis..." -ForegroundColor Yellow
$redisReady = $false
$retries = 0

while (-not $redisReady -and $retries -lt $maxRetries) {
    if (Get-Command "redis-server" -ErrorAction SilentlyContinue) {
        Write-Host "  [OK] Redis found!" -ForegroundColor Green
        $redisReady = $true
    } else {
        $retries++
        if ($retries -lt $maxRetries) {
            Write-Host "  [!!] Redis not found, retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        }
    }
}

if (-not $redisReady) {
    Write-Host "  [X] Redis not installed yet" -ForegroundColor Red
    Write-Host "      The installation may still be running." -ForegroundColor Yellow
    Write-Host "      Please wait for it to complete and try again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Ensure PostgreSQL service is running
Write-Host "`n[3/5] Starting PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService) {
    if ($pgService.Status -ne 'Running') {
        try {
            Start-Service $pgService.Name
            Start-Sleep -Seconds 3
            Write-Host "  [OK] PostgreSQL service started" -ForegroundColor Green
        } catch {
            Write-Host "  [!!] Could not start PostgreSQL service" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  [OK] PostgreSQL service already running" -ForegroundColor Green
    }
} else {
    Write-Host "  [!!] PostgreSQL service not found (may need restart)" -ForegroundColor Yellow
}

# Step 4: Start Redis in background
Write-Host "`n[4/5] Starting Redis..." -ForegroundColor Yellow
$redisRunning = $false
try {
    $redisPing = redis-cli ping 2>&1
    if ($redisPing -eq "PONG") {
        Write-Host "  [OK] Redis already running" -ForegroundColor Green
        $redisRunning = $true
    }
} catch {}

if (-not $redisRunning) {
    try {
        Start-Process "redis-server" -WindowStyle Hidden
        Start-Sleep -Seconds 2
        Write-Host "  [OK] Redis started" -ForegroundColor Green
    } catch {
        Write-Host "  [!!] Could not start Redis" -ForegroundColor Yellow
        Write-Host "      Start manually: redis-server" -ForegroundColor Gray
    }
}

# Step 5: Create environment files
Write-Host "`n[5/5] Setting up environment..." -ForegroundColor Yellow

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

$backendEnvPath = "backend\.env"
if (!(Test-Path $backendEnvPath)) {
    $backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding utf8
    Write-Host "  [OK] Created backend/.env" -ForegroundColor Green
} else {
    Write-Host "  [-] backend/.env exists" -ForegroundColor Gray
}

# Admin .env.local
$adminEnvContent = @"
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-nextauth-secret-$randomSuffix
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
"@

$adminEnvPath = "apps\admin\.env.local"
if (!(Test-Path $adminEnvPath)) {
    $adminEnvContent | Out-File -FilePath $adminEnvPath -Encoding utf8
    Write-Host "  [OK] Created apps/admin/.env.local" -ForegroundColor Green
} else {
    Write-Host "  [-] apps/admin/.env.local exists" -ForegroundColor Gray
}

# ML Service .env
$mlEnvContent = @"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
MLFLOW_TRACKING_URI=file://./mlflow
REDIS_URL=redis://localhost:6379
"@

$mlEnvPath = "ml_service\.env"
if (!(Test-Path $mlEnvPath)) {
    $mlEnvContent | Out-File -FilePath $mlEnvPath -Encoding utf8
    Write-Host "  [OK] Created ml_service/.env" -ForegroundColor Green
} else {
    Write-Host "  [-] ml_service/.env exists" -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete - Starting Services" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Now start services
Write-Host "Starting Easy11 services in separate windows..." -ForegroundColor Yellow
Write-Host ""

& "$PSScriptRoot\start-services.ps1"

