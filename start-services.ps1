# Easy11 - Start All Services
# This script opens each service in a separate PowerShell window

Write-Host "================================" -ForegroundColor Cyan
Write-Host "   Starting Easy11 Services" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot

# Check if backend/.env exists
if (!(Test-Path "$projectRoot\backend\.env")) {
    Write-Host "⚠ Backend .env not found!" -ForegroundColor Yellow
    Write-Host "  Run setup-manual.ps1 first" -ForegroundColor Yellow
    Write-Host ""
    $runSetup = Read-Host "Run setup now? (y/n)"
    if ($runSetup -eq "y") {
        & "$projectRoot\setup-manual.ps1"
    } else {
        exit 1
    }
}

Write-Host "Starting services in separate windows..." -ForegroundColor Yellow
Write-Host ""

# Function to start a service in a new window
function Start-Service {
    param(
        [string]$Title,
        [string]$Path,
        [string]$Command,
        [string]$Color = "Blue"
    )
    
    Write-Host "► Starting $Title..." -ForegroundColor $Color
    
    $fullPath = Join-Path $projectRoot $Path
    $scriptBlock = "cd '$fullPath'; $Command; Read-Host 'Press Enter to close'"
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock
    
    Start-Sleep -Seconds 1
}

# Start Backend
Start-Service -Title "Backend API" -Path "backend" -Command @"
Write-Host '================================' -ForegroundColor Cyan
Write-Host '   Easy11 Backend API' -ForegroundColor Cyan
Write-Host '================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Installing dependencies...' -ForegroundColor Yellow
npm install --silent
Write-Host ''
Write-Host 'Generating Prisma client...' -ForegroundColor Yellow
npx prisma generate
Write-Host ''
Write-Host 'Running migrations...' -ForegroundColor Yellow
npx prisma migrate deploy
Write-Host ''
Write-Host 'Starting backend...' -ForegroundColor Green
Write-Host 'API will be available at: http://localhost:5000' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@ -Color "Cyan"

Write-Host "  Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Start Admin Portal
Start-Service -Title "Admin Portal" -Path "apps\admin" -Command @"
Write-Host '================================' -ForegroundColor Magenta
Write-Host '   Easy11 Admin Portal' -ForegroundColor Magenta
Write-Host '================================' -ForegroundColor Magenta
Write-Host ''
Write-Host 'Installing dependencies...' -ForegroundColor Yellow
npm install --silent
Write-Host ''
Write-Host 'Starting admin portal...' -ForegroundColor Green
Write-Host 'Portal will be available at: http://localhost:3001' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@ -Color "Magenta"

Write-Host "  Waiting for admin portal to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Start ML Service
Start-Service -Title "ML Service" -Path "ml_service" -Command @"
Write-Host '================================' -ForegroundColor Green
Write-Host '   Easy11 ML Service' -ForegroundColor Green
Write-Host '================================' -ForegroundColor Green
Write-Host ''
if (!(Test-Path 'venv')) {
    Write-Host 'Creating virtual environment...' -ForegroundColor Yellow
    python -m venv venv
}
Write-Host 'Activating virtual environment...' -ForegroundColor Yellow
.\venv\Scripts\activate
Write-Host ''
Write-Host 'Installing dependencies...' -ForegroundColor Yellow
pip install -q -r requirements.txt
Write-Host ''
Write-Host 'Starting ML service...' -ForegroundColor Green
Write-Host 'API will be available at: http://localhost:8000' -ForegroundColor Cyan
Write-Host 'API Docs: http://localhost:8000/docs' -ForegroundColor Cyan
Write-Host ''
uvicorn src.main:app --reload --port 8000
"@ -Color "Green"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "   All Services Started!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services are starting in separate windows:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Backend API:     http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Admin Portal:    http://localhost:3001" -ForegroundColor Magenta
Write-Host "  ML Service:      http://localhost:8000" -ForegroundColor Green
Write-Host "  ML API Docs:     http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 30-60 seconds for all services to fully start." -ForegroundColor Yellow
Write-Host ""
Write-Host "To test, run in a new terminal:" -ForegroundColor Yellow
Write-Host "  curl http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "To stop services:" -ForegroundColor Yellow
Write-Host "  Close each PowerShell window" -ForegroundColor White
Write-Host "  Or press Ctrl+C in each window" -ForegroundColor White
Write-Host ""
Write-Host "Logs will appear in each service's window." -ForegroundColor Gray
Write-Host ""

# Keep this window open
Write-Host "This window can be closed. Services are running in other windows." -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to close this launcher"

