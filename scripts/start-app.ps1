# Start Easy11 frontend and backend (no Docker required for the app to load).
# For full features (login, products from DB), start Docker Desktop first and run: docker compose up -d postgres redis

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root

Write-Host "Starting Backend (port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Starting Frontend (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\apps\web\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "For database (login, products): start Docker Desktop, then run: docker compose up -d postgres redis" -ForegroundColor Yellow
