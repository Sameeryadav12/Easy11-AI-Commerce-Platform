# 🚀 Backend Startup Guide - Fixed Issues

## ✅ Fixes Applied

### 1. Made Redis Optional
- Backend now works without Redis
- Cache operations gracefully handle Redis unavailability

### 2. Made Kafka Optional  
- Backend now works without Kafka
- Telemetry events logged locally if Kafka unavailable

### 3. Improved Health Check
- Health check now shows status of all services
- Database connection failures don't crash the server
- Returns `degraded` status if optional services unavailable

## 🔧 How to Start Backend

### Step 1: Ensure Database is Running
```powershell
# Check if PostgreSQL is running
# If not, start PostgreSQL service
```

### Step 2: Check Environment File
```powershell
cd backend
# Verify .env file exists
# Should contain DATABASE_URL
```

### Step 3: Generate Prisma Client
```powershell
npx prisma generate
```

### Step 4: Run Database Migrations (if needed)
```powershell
npx prisma migrate deploy
```

### Step 5: Start Backend
```powershell
npm run dev
```

## ✅ Expected Output

When backend starts successfully, you should see:
```
🚀 Server running on port 5000
📝 Environment: development
🔗 API: http://localhost:5000/api/v1
```

## 🧪 Test Backend

### Health Check
```powershell
# In browser or PowerShell:
Invoke-WebRequest -Uri "http://localhost:5000/health"
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "service": "easy11-backend",
  "version": "1.0.0",
  "checks": {
    "database": "connected",
    "redis": "not configured" or "connected"
  }
}
```

## 🐛 Troubleshooting

### Backend Not Starting

1. **Check Database Connection**
   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in `.env` is correct
   - Test connection: `psql -U postgres -d easy11_dev`

2. **Check Port Availability**
   - Port 5000 might be in use
   - Change PORT in `.env` if needed

3. **Check Dependencies**
   ```powershell
   npm install
   ```

4. **Check TypeScript Compilation**
   ```powershell
   npx tsc --noEmit
   ```

5. **Check Logs**
   - Look for error messages in console
   - Check `logs/error.log` if it exists

### Common Errors

**Error: Cannot find module**
- Run: `npm install`

**Error: Database connection failed**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`

**Error: Port already in use**
- Change PORT in `.env`
- Or kill process using port 5000

## 📝 Files Modified

- `backend/src/middleware/cache.middleware.ts` - Made Redis optional
- `backend/src/services/telemetry.service.ts` - Made Kafka optional
- `backend/src/routes/mlops.routes.ts` - Handle Redis unavailability
- `backend/src/server.ts` - Improved health check

---

**Status**: ✅ All fixes applied, ready to test
