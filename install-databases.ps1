# Easy11 - Install PostgreSQL and Redis
# Run this as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing PostgreSQL and Redis" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Chocolatey is installed
Write-Host "[1/4] Checking Chocolatey..." -ForegroundColor Yellow
if (!(Get-Command "choco" -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey not found. Installing Chocolatey..." -ForegroundColor Yellow
    Write-Host ""
    
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    
    try {
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "OK Chocolatey installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to install Chocolatey" -ForegroundColor Red
        Write-Host "Please install manually from: https://chocolatey.org/install" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    # Refresh environment
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    $chocoVersion = choco --version
    Write-Host "OK Chocolatey already installed: $chocoVersion" -ForegroundColor Green
}

Write-Host ""

# Install PostgreSQL
Write-Host "[2/4] Installing PostgreSQL..." -ForegroundColor Yellow
if (Get-Command "psql" -ErrorAction SilentlyContinue) {
    $pgVersion = psql --version
    Write-Host "OK PostgreSQL already installed: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "Downloading and installing PostgreSQL 15..." -ForegroundColor Yellow
    Write-Host "This may take 5-10 minutes..." -ForegroundColor Gray
    Write-Host ""
    
    try {
        choco install postgresql15 -y --params '/Password:postgres'
        
        # Refresh environment
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host ""
        Write-Host "OK PostgreSQL 15 installed successfully!" -ForegroundColor Green
        Write-Host "   Username: postgres" -ForegroundColor Gray
        Write-Host "   Password: postgres" -ForegroundColor Gray
        Write-Host "   Port: 5432" -ForegroundColor Gray
    } catch {
        Write-Host "ERROR: Failed to install PostgreSQL" -ForegroundColor Red
        Write-Host "Please install manually from:" -ForegroundColor Yellow
        Write-Host "https://www.enterprisedb.com/downloads/postgres-postgresql-downloads" -ForegroundColor Cyan
    }
}

Write-Host ""

# Install Redis
Write-Host "[3/4] Installing Redis..." -ForegroundColor Yellow
if (Get-Command "redis-server" -ErrorAction SilentlyContinue) {
    Write-Host "OK Redis already installed" -ForegroundColor Green
} else {
    Write-Host "Downloading and installing Redis..." -ForegroundColor Yellow
    Write-Host "This may take 2-5 minutes..." -ForegroundColor Gray
    Write-Host ""
    
    try {
        choco install redis-64 -y
        
        # Refresh environment
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host ""
        Write-Host "OK Redis installed successfully!" -ForegroundColor Green
        Write-Host "   Port: 6379" -ForegroundColor Gray
    } catch {
        Write-Host "ERROR: Failed to install Redis" -ForegroundColor Red
        Write-Host "Please install manually from:" -ForegroundColor Yellow
        Write-Host "https://github.com/tporadowski/redis/releases" -ForegroundColor Cyan
    }
}

Write-Host ""

# Create Easy11 database
Write-Host "[4/4] Setting up Easy11 database..." -ForegroundColor Yellow

# Wait for PostgreSQL service to start
Start-Sleep -Seconds 5

try {
    # Check if PostgreSQL service is running
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    
    if ($pgService) {
        if ($pgService.Status -ne 'Running') {
            Write-Host "Starting PostgreSQL service..." -ForegroundColor Yellow
            Start-Service $pgService.Name
            Start-Sleep -Seconds 3
        }
        
        Write-Host "PostgreSQL service is running" -ForegroundColor Green
        
        # Set PGPASSWORD environment variable temporarily
        $env:PGPASSWORD = "postgres"
        
        # Create database
        Write-Host "Creating easy11_dev database..." -ForegroundColor Yellow
        
        $createDbCommand = "CREATE DATABASE easy11_dev;"
        $result = & psql -U postgres -c $createDbCommand 2>&1
        
        if ($LASTEXITCODE -eq 0 -or $result -like "*already exists*") {
            Write-Host "OK Database easy11_dev ready!" -ForegroundColor Green
        } else {
            Write-Host "WARNING: Could not create database automatically" -ForegroundColor Yellow
            Write-Host "You can create it manually later with:" -ForegroundColor Gray
            Write-Host "  psql -U postgres -c `"CREATE DATABASE easy11_dev;`"" -ForegroundColor White
        }
        
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD
    } else {
        Write-Host "WARNING: PostgreSQL service not found" -ForegroundColor Yellow
        Write-Host "You may need to restart your computer" -ForegroundColor Gray
    }
} catch {
    Write-Host "WARNING: Could not setup database automatically" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify installations
Write-Host "Verification:" -ForegroundColor Yellow
Write-Host ""

if (Get-Command "psql" -ErrorAction SilentlyContinue) {
    $pgVer = psql --version
    Write-Host "  [OK] PostgreSQL: $pgVer" -ForegroundColor Green
} else {
    Write-Host "  [!!] PostgreSQL: Not found in PATH" -ForegroundColor Yellow
    Write-Host "      Restart PowerShell and try again" -ForegroundColor Gray
}

if (Get-Command "redis-server" -ErrorAction SilentlyContinue) {
    Write-Host "  [OK] Redis: Installed" -ForegroundColor Green
} else {
    Write-Host "  [!!] Redis: Not found in PATH" -ForegroundColor Yellow
    Write-Host "      Restart PowerShell and try again" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Close this PowerShell window" -ForegroundColor White
Write-Host "2. Open a NEW PowerShell window (to refresh PATH)" -ForegroundColor White
Write-Host "3. Navigate to project: cd D:\Projects\Easy11" -ForegroundColor White
Write-Host "4. Run setup: .\setup-manual.ps1" -ForegroundColor White
Write-Host "5. Start services: .\start-services.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Or just run: .\start-services.ps1" -ForegroundColor Green
Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Cyan
Write-Host "  Backend:      http://localhost:5000" -ForegroundColor White
Write-Host "  Admin Portal: http://localhost:3001" -ForegroundColor White
Write-Host "  ML Service:   http://localhost:8000" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to close"

