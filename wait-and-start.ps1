# Wait for installation to complete, then start Easy11

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Waiting for Installation..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$maxWait = 300  # 5 minutes
$elapsed = 0
$checkInterval = 10

Write-Host "Checking every 10 seconds..." -ForegroundColor Yellow
Write-Host "Max wait time: 5 minutes" -ForegroundColor Gray
Write-Host ""

while ($elapsed -lt $maxWait) {
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    $pgReady = Get-Command "psql" -ErrorAction SilentlyContinue
    $redisReady = Get-Command "redis-server" -ErrorAction SilentlyContinue
    
    Write-Host "[$elapsed`s] Checking... " -NoNewline -ForegroundColor Gray
    
    if ($pgReady) {
        Write-Host "PostgreSQL: OK " -NoNewline -ForegroundColor Green
    } else {
        Write-Host "PostgreSQL: ... " -NoNewline -ForegroundColor Yellow
    }
    
    if ($redisReady) {
        Write-Host "Redis: OK" -ForegroundColor Green
    } else {
        Write-Host "Redis: ..." -ForegroundColor Yellow
    }
    
    if ($pgReady -and $redisReady) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "   Installation Complete!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Starting Easy11 in 3 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        
        & "$PSScriptRoot\run-easy11.ps1"
        exit 0
    }
    
    Start-Sleep -Seconds $checkInterval
    $elapsed += $checkInterval
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "   Installation Timeout" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "The installation is taking longer than expected." -ForegroundColor Yellow
Write-Host ""
Write-Host "Please check:" -ForegroundColor Yellow
Write-Host "  1. Is the Administrator window still open?" -ForegroundColor White
Write-Host "  2. Are there any error messages?" -ForegroundColor White
Write-Host "  3. Check: .\check-installation.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or try manual installation:" -ForegroundColor Yellow
Write-Host "  See: INSTALL_DATABASES_MANUAL.md" -ForegroundColor Cyan
Write-Host ""

