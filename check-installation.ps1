# Check if PostgreSQL and Redis are installed and ready

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Easy11 - Installation Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
if (Get-Command "psql" -ErrorAction SilentlyContinue) {
    $pgVersion = psql --version
    Write-Host "  [OK] $pgVersion" -ForegroundColor Green
    
    # Check if service is running
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgService -and $pgService.Status -eq 'Running') {
        Write-Host "  [OK] PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "  [!!] PostgreSQL service not running" -ForegroundColor Yellow
        $allGood = $false
    }
    
    # Check database
    $env:PGPASSWORD = "postgres"
    $dbCheck = psql -U postgres -c "\l" 2>&1 | Select-String "easy11_dev"
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    
    if ($dbCheck) {
        Write-Host "  [OK] Database easy11_dev exists" -ForegroundColor Green
    } else {
        Write-Host "  [!!] Database easy11_dev not found" -ForegroundColor Yellow
        $allGood = $false
    }
} else {
    Write-Host "  [X] PostgreSQL not installed or not in PATH" -ForegroundColor Red
    Write-Host "      Restart PowerShell and try again" -ForegroundColor Gray
    $allGood = $false
}

Write-Host ""

# Check Redis
Write-Host "Checking Redis..." -ForegroundColor Yellow
if (Get-Command "redis-server" -ErrorAction SilentlyContinue) {
    Write-Host "  [OK] Redis is installed" -ForegroundColor Green
    
    # Try to ping Redis
    $redisRunning = $false
    try {
        $redisPing = redis-cli ping 2>&1
        if ($redisPing -eq "PONG") {
            Write-Host "  [OK] Redis is running" -ForegroundColor Green
            $redisRunning = $true
        }
    } catch {}
    
    if (-not $redisRunning) {
        Write-Host "  [!!] Redis not running (start with: redis-server)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [X] Redis not installed or not in PATH" -ForegroundColor Red
    Write-Host "      Restart PowerShell and try again" -ForegroundColor Gray
    $allGood = $false
}

Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (Get-Command "node" -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "  [OK] Node.js $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  [X] Node.js not found" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
if (Get-Command "python" -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "  [OK] $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  [X] Python not found" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "  Status: READY TO START!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run: .\setup-manual.ps1" -ForegroundColor White
    Write-Host "  2. Run: .\start-services.ps1" -ForegroundColor White
    Write-Host "  3. Open: http://localhost:3001" -ForegroundColor White
    Write-Host ""
    Write-Host "Or just run: .\start-services.ps1" -ForegroundColor Green
} else {
    Write-Host "  Status: NOT READY YET" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "If installation is still running:" -ForegroundColor Yellow
    Write-Host "  Wait for it to complete (10-15 min)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "If installation completed:" -ForegroundColor Yellow
    Write-Host "  1. Close this PowerShell" -ForegroundColor Gray
    Write-Host "  2. Open a NEW PowerShell" -ForegroundColor Gray
    Write-Host "  3. Run: .\check-installation.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "If installation failed:" -ForegroundColor Yellow
    Write-Host "  See: INSTALL_DATABASES_MANUAL.md" -ForegroundColor Gray
}

Write-Host ""

