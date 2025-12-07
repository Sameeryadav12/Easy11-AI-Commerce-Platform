# 📦 Manual Database Installation Guide

If you prefer to install PostgreSQL and Redis manually (without the automated script), follow these steps:

---

## Option 1: Use Automated Script (RECOMMENDED)

**Run as Administrator**:
```powershell
cd D:\Projects\Easy11
.\install-databases.ps1
```

This will:
- Install Chocolatey (package manager)
- Install PostgreSQL 15
- Install Redis
- Create the `easy11_dev` database
- Configure everything automatically

**Time**: 10-15 minutes

---

## Option 2: Manual Installation

### Step 1: Install PostgreSQL

**Download**:
1. Go to: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Download **PostgreSQL 15** for Windows
3. Run the installer

**During Installation**:
- **Password**: Set to `postgres` (or remember what you choose)
- **Port**: Leave as `5432`
- **Locale**: Default
- **Components**: Select all (PostgreSQL Server, pgAdmin, Command Line Tools)

**After Installation**:
```powershell
# Test PostgreSQL
psql --version

# Create database
psql -U postgres -c "CREATE DATABASE easy11_dev;"
```

**Time**: 15-20 minutes

---

### Step 2: Install Redis

**Option A: Using Memurai (Redis for Windows)**
1. Go to: https://www.memurai.com/get-memurai
2. Download Memurai (Redis-compatible for Windows)
3. Run installer
4. Accept defaults

**Option B: Using Redis for Windows (Unofficial)**
1. Go to: https://github.com/tporadowski/redis/releases
2. Download `Redis-x64-5.0.14.1.zip` (latest)
3. Extract to `C:\Redis`
4. Double-click `redis-server.exe` to start

**Option C: Using WSL2 (Windows Subsystem for Linux)**
```bash
# In WSL2
sudo apt update
sudo apt install redis-server
redis-server
```

**Test Redis**:
```powershell
# If Redis is in PATH
redis-cli ping
# Should return: PONG

# Or navigate to Redis folder
cd C:\Redis
.\redis-cli.exe ping
```

**Time**: 10-15 minutes

---

## Verification

After installation, verify both are working:

```powershell
# Test PostgreSQL
psql --version
# Expected: psql (PostgreSQL) 15.x

# Test Redis
redis-cli ping
# Expected: PONG

# Check PostgreSQL service
Get-Service -Name "postgresql*"
# Expected: Running

# List databases
psql -U postgres -c "\l"
# Should show easy11_dev
```

---

## Configuration

### PostgreSQL Configuration

**Default Settings**:
- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres (or what you set)
- **Database**: easy11_dev

**Connection String**:
```
postgresql://postgres:postgres@localhost:5432/easy11_dev
```

### Redis Configuration

**Default Settings**:
- **Host**: localhost
- **Port**: 6379
- **No password** (default for local development)

**Connection String**:
```
redis://localhost:6379
```

---

## Troubleshooting

### PostgreSQL Issues

**Problem**: "psql: command not found"
**Solution**: Add PostgreSQL to PATH
```powershell
# Add to PATH (replace version if needed)
$env:Path += ";C:\Program Files\PostgreSQL\15\bin"
```

**Problem**: "Connection refused"
**Solution**: Start PostgreSQL service
```powershell
# Find service name
Get-Service -Name "postgresql*"

# Start service
Start-Service postgresql-x64-15
```

**Problem**: "Database creation failed"
**Solution**: Create manually
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE easy11_dev;

# Exit
\q
```

### Redis Issues

**Problem**: "redis-cli not found"
**Solution**: Run from Redis folder
```powershell
cd C:\Redis
.\redis-cli.exe ping
```

**Problem**: "Could not connect to Redis"
**Solution**: Start Redis server
```powershell
cd C:\Redis
.\redis-server.exe
```

**Problem**: Redis window closes immediately
**Solution**: Run in PowerShell
```powershell
cd C:\Redis
Start-Process .\redis-server.exe
```

---

## Starting Services

### Start PostgreSQL (Windows Service)
```powershell
# Start service
Start-Service postgresql-x64-15

# Stop service
Stop-Service postgresql-x64-15

# Check status
Get-Service postgresql-x64-15
```

PostgreSQL runs as a Windows service and starts automatically.

### Start Redis (Manual)

**Option 1: Run in foreground**
```powershell
cd C:\Redis
.\redis-server.exe
# Keep this window open
```

**Option 2: Run as service (if installed as service)**
```powershell
redis-server --service-start
```

**Option 3: Run in background**
```powershell
cd C:\Redis
Start-Process .\redis-server.exe -WindowStyle Hidden
```

---

## Next Steps

After both are installed and running:

### 1. Verify Installation
```powershell
cd D:\Projects\Easy11

# Run verification
.\setup-manual.ps1
```

### 2. Start Easy11 Services
```powershell
# This will start all services in separate windows
.\start-services.ps1
```

### 3. Access Applications

Wait 1-2 minutes for services to start, then open:

- **Backend API**: http://localhost:5000
- **Admin Portal**: http://localhost:3001
- **ML Service**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Environment Variables

The setup script creates these `.env` files:

**backend/.env**:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
REDIS_URL=redis://localhost:6379
PORT=5000
JWT_SECRET=<random>
```

**apps/admin/.env.local**:
```env
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**ml_service/.env**:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
REDIS_URL=redis://localhost:6379
```

If you used a different password, update these files!

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start PostgreSQL | `Start-Service postgresql-x64-15` |
| Stop PostgreSQL | `Stop-Service postgresql-x64-15` |
| Start Redis | `cd C:\Redis; .\redis-server.exe` |
| Test PostgreSQL | `psql -U postgres -c "SELECT version();"` |
| Test Redis | `redis-cli ping` |
| Create DB | `psql -U postgres -c "CREATE DATABASE easy11_dev;"` |
| List DBs | `psql -U postgres -c "\l"` |
| Connect to DB | `psql -U postgres -d easy11_dev` |

---

## Summary

**Automated Installation** (Recommended):
```powershell
# Run as Administrator
.\install-databases.ps1
```

**Manual Installation**:
1. Install PostgreSQL → https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Install Redis → https://github.com/tporadowski/redis/releases
3. Create database: `psql -U postgres -c "CREATE DATABASE easy11_dev;"`
4. Run setup: `.\setup-manual.ps1`
5. Start services: `.\start-services.ps1`

**Either way works!** The automated script is faster, but manual installation gives you more control.

---

**Need help?** See `START_HERE.md` or `DOCKER_TROUBLESHOOTING.md`

