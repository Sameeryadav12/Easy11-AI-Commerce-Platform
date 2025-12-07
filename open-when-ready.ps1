# Wait for services and open browser when ready

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Waiting for Easy11 to be ready..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$maxAttempts = 60
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    
    $backendReady = $false
    $adminReady = $false
    
    # Check backend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        $backendReady = $true
    } catch {}
    
    # Check admin
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        $adminReady = $true
    } catch {}
    
    Write-Host "[$attempt/$maxAttempts] Backend: $(if($backendReady){'OK'}else{'...'}), Admin: $(if($adminReady){'OK'}else{'...'})" -ForegroundColor $(if($backendReady -and $adminReady){'Green'}else{'Yellow'})
    
    if ($backendReady -and $adminReady) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ ALL SERVICES READY!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opening Admin Portal in browser..." -ForegroundColor Cyan
        Start-Process "http://localhost:3001"
        Write-Host ""
        Write-Host "URLs:" -ForegroundColor Yellow
        Write-Host "  Admin Portal: http://localhost:3001" -ForegroundColor Cyan
        Write-Host "  Backend API:  http://localhost:5000" -ForegroundColor Cyan
        Write-Host ""
        exit 0
    }
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "  Timeout waiting for services" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Please check the PowerShell windows for errors." -ForegroundColor Yellow
Write-Host ""

