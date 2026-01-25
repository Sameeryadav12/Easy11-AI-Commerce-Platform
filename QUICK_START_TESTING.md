# 🚀 Quick Start - Testing Easy11

## Services Starting...

I've started the following services for you:

### ✅ Services Started:

1. **Backend API** - Port 5000
   - URL: http://localhost:5000
   - Health Check: http://localhost:5000/health
   - Status: Starting...

2. **Customer Frontend** - Port 3000
   - URL: http://localhost:3000
   - Status: Starting...

3. **Admin Portal** - Port 3001 (if started)
   - URL: http://localhost:3001

4. **ML Service** - Port 8000 (if started)
   - URL: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## ⏱️ Wait Time

**Please wait 30-60 seconds** for all services to fully start.

You'll see separate PowerShell windows for each service showing their logs.

---

## ✅ Verify Services Are Running

### Check Backend:
Open in browser: http://localhost:5000/health
- Should show: `{"status":"healthy",...}`

### Check Frontend:
Open in browser: http://localhost:3000
- Should show the Easy11 homepage

---

## 🧪 Start Testing

Once services are running:

1. **Open the testing guide**: `docs/STEP_BY_STEP_TESTING_GUIDE.md`
2. **Start with Part 1**: Authentication & User Management
3. **Follow each test case** step-by-step
4. **Document any issues** in `docs/TEST_EXECUTION_REPORT.md`

---

## 📋 Quick Test Checklist

### First Things to Test:

- [ ] **Homepage loads**: http://localhost:3000
- [ ] **Backend health**: http://localhost:5000/health
- [ ] **Registration**: http://localhost:3000/auth/register
- [ ] **Login**: http://localhost:3000/auth/login
- [ ] **Products page**: http://localhost:3000/products

---

## 🐛 If Services Don't Start

### Check PowerShell Windows:
- Look for error messages in the service windows
- Common issues:
  - Port already in use (close other apps using ports 3000, 5000)
  - Missing dependencies (run `npm install` in each directory)
  - Database not running (start PostgreSQL)

### Manual Start:

**Backend**:
```powershell
cd backend
npm install
npm run dev
```

**Frontend**:
```powershell
cd apps/web/frontend
npm install
npm run dev
```

---

## 🛑 Stop Services

To stop all services:
- Close each PowerShell window
- Or press `Ctrl+C` in each service window

---

## 📞 Need Help?

If you encounter issues:
1. Check the service windows for error messages
2. Check browser console (F12) for frontend errors
3. Verify database is running
4. Document issues in the test execution report

---

**Happy Testing! 🎉**
