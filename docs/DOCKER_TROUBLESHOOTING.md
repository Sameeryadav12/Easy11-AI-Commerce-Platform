# 🐳 Docker Troubleshooting Guide - Easy11

## Problem

Docker is showing:
```
http: server gave HTTP response to HTTPS client
```

This means Docker Desktop has a configuration issue preventing it from pulling images securely.

---

## Solution 1: Restart Docker Desktop (FASTEST)

1. **Right-click Docker Desktop icon** in system tray
2. Click **Quit Docker Desktop**
3. Wait 10 seconds
4. **Open Docker Desktop as Administrator**:
   - Press Windows key
   - Type "Docker Desktop"
   - Right-click → "Run as administrator"
5. Wait for Docker to fully start (whale icon green)
6. **Test**:
   ```powershell
   docker pull postgres:15-alpine
   ```

---

## Solution 2: Fix Docker Engine Configuration

1. **Open Docker Desktop**
2. Click the **gear icon** (Settings)
3. Go to **Docker Engine** tab
4. You'll see JSON config. Add this:

```json
{
  "dns": ["8.8.8.8", "8.8.4.4"],
  "registry-mirrors": [],
  "insecure-registries": [],
  "debug": false,
  "experimental": false
}
```

5. Click **Apply & Restart**
6. Wait for Docker to restart completely
7. **Test again**:
   ```powershell
   docker pull postgres:15-alpine
   ```

---

## Solution 3: Reset Docker to Factory Defaults

**⚠️ Warning: This will delete all containers, images, and volumes!**

1. **Open Docker Desktop**
2. Click **gear icon** (Settings)
3. Go to **Troubleshoot** tab
4. Click **Reset to factory defaults**
5. Click **Reset**
6. Wait for Docker to reinstall (5-10 minutes)
7. **Test**:
   ```powershell
   docker pull postgres:15-alpine
   ```

---

## Solution 4: Check Windows Firewall/Antivirus

Sometimes antivirus blocks Docker connections:

1. **Open Windows Security**
2. Go to **Firewall & network protection**
3. Click **Allow an app through firewall**
4. Find **Docker Desktop** and ensure both:
   - ✅ Private networks
   - ✅ Public networks
5. Click **OK**
6. **Restart Docker Desktop**
7. **Test**:
   ```powershell
   docker pull postgres:15-alpine
   ```

---

## Solution 5: Check Proxy Settings

If you're on a corporate network:

1. **Open Docker Desktop**
2. Go to **Settings** → **Resources** → **Proxies**
3. If you're NOT behind a proxy:
   - Ensure **Manual proxy configuration** is OFF
4. If you ARE behind a proxy:
   - Enable manual configuration
   - Enter your proxy details
5. Click **Apply & Restart**

---

## Solution 6: Reinstall Docker Desktop

If nothing works:

1. **Uninstall Docker Desktop**:
   - Windows Settings → Apps → Docker Desktop → Uninstall
2. **Download latest version**: https://www.docker.com/products/docker-desktop/
3. **Install as Administrator**
4. **Start Docker Desktop**
5. **Test**:
   ```powershell
   docker pull postgres:15-alpine
   ```

---

## Alternative: Run Without Docker (Skip All Issues!)

Since Docker is being problematic, you can run Easy11 **directly on your machine**:

### Step 1: Install PostgreSQL

```powershell
# Download installer
# https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

# Or use Chocolatey
choco install postgresql15

# Start PostgreSQL service
net start postgresql-x64-15

# Create database
psql -U postgres
CREATE DATABASE easy11_dev;
\q
```

### Step 2: Install Redis

```powershell
# Download for Windows
# https://github.com/tporadowski/redis/releases

# Or use Chocolatey
choco install redis-64

# Start Redis
redis-server
```

### Step 3: Setup Environment Variables

Create `.env` in the `backend` folder:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/easy11_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
FRONTEND_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
```

### Step 4: Start Backend

```powershell
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Start backend
npm run dev
```

**Backend will be at: http://localhost:5000**

### Step 5: Start Admin Portal

Open a **NEW PowerShell window**:

```powershell
cd apps\admin

# Install dependencies
npm install

# Create .env.local
@"
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-nextauth-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
"@ | Out-File -FilePath .env.local -Encoding utf8

# Start admin portal
npm run dev
```

**Admin Portal will be at: http://localhost:3001**

### Step 6: Start ML Service (Optional)

Open **ANOTHER PowerShell window**:

```powershell
cd ml_service

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start ML service
uvicorn src.main:app --reload --port 8000
```

**ML Service will be at: http://localhost:8000**

---

## Quick Test Commands

After ANY solution, test with:

```powershell
# Test Docker
docker --version
docker pull hello-world
docker run hello-world

# If that works, try:
docker pull postgres:15-alpine
docker pull redis:7-alpine

# Then start Easy11:
docker-compose up -d postgres redis
docker-compose logs -f
```

---

## What to Do Next

### ✅ If Docker Works:
```powershell
cd D:\Projects\Easy11
docker-compose up -d
docker-compose logs -f
```

### ✅ If Running Manually:
Follow the "Alternative: Run Without Docker" section above

### ✅ If Still Stuck:
The project is **COMPLETE** and can be showcased through:
- Code review
- Documentation walkthrough
- Architecture presentation
- Algorithm explanations

**You don't need to run it to prove you built it!** 🚀

---

## Success Criteria

You'll know it's working when you see:

```
✅ Backend API: http://localhost:5000 (returns JSON)
✅ Admin Portal: http://localhost:3001 (shows login page)
✅ ML Service: http://localhost:8000/docs (shows API docs)
✅ PostgreSQL: Connection successful
✅ Redis: Connection successful
```

---

**Need help? Check `NEXT_STEPS.md` for alternatives!**

