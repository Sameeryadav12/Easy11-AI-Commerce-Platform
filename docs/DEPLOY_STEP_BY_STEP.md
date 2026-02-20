# Deploy Easy11 — Step-by-step (Neon + Render + Vercel)

You’ve created accounts on **Render** and **Neon**. This guide walks you through **exactly** what to do next so your customer site, API, and database are live.

---

## What you’ll have when done

- **Neon** → PostgreSQL database (users, orders, rewards, support tickets).
- **Render** → Backend API (Node.js) that talks to Neon.
- **Vercel** → Customer website (Vite SPA) that talks to the Render API.

Order of operations: **Neon first** → **Render second** → **Vercel last** (because Vercel needs the Render URL).

---

# Part 1 — Neon (database)

## Step 1.1 — Create a project and get the connection string

1. Go to **[neon.tech](https://neon.tech)** and log in.
2. Click **“New Project”** (or use the one you already created).
3. Choose a **name** (e.g. `easy11`) and **region** (pick one close to you).
4. Click **Create project**.
5. On the project dashboard you’ll see a **connection string**:
   - It looks like:  
     `postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require`
   - There may be a **“Copy”** button or a dropdown to choose “Connection string”.
6. **Copy that full connection string** and save it somewhere safe (e.g. a Notepad file). You’ll paste it into Render in Part 2.  
   - **Important:** If Neon shows a **password** separately, make sure the string you copy includes that password in place of `PASSWORD` in the format above.

You’re done with Neon for now. No need to create tables by hand — the backend will create them when we run migrations.

---

## Step 1.2 — Run migrations against Neon (from your PC)

So that your **production** database has the right tables (users, orders, support_tickets, etc.):

1. Open a terminal (PowerShell or Command Prompt).
2. Go to the **backend** folder of Easy11:
   ```bash
   cd d:\Projects\Easy11\backend
   ```
3. Set the Neon connection string for this terminal only (replace `YOUR_NEON_CONNECTION_STRING` with the string you copied):
   - **PowerShell:**
     ```powershell
     $env:DATABASE_URL="YOUR_NEON_CONNECTION_STRING"
     ```
   - **Command Prompt:**
     ```cmd
     set DATABASE_URL=YOUR_NEON_CONNECTION_STRING
     ```
   Example (fake password):
   ```powershell
   $env:DATABASE_URL="postgresql://myuser:abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
   You should see something like: “All migrations have been successfully applied.”
5. (Optional) Seed a test admin/customer:
   ```bash
   npm run prisma:seed
   ```
   If that fails (e.g. “unique constraint” because you already seeded once), you can skip it.

Neon is ready. Keep the connection string; you’ll use it in Render next.

---

# Part 2 — Render (backend API)

## Step 2.1 — Create a Web Service and connect GitHub

1. Go to **[render.com](https://render.com)** and log in.
2. Click **“New +”** → **“Web Service”**.
3. **Connect your GitHub** (or GitLab) if you haven’t already:
   - Click **“Connect account”** / **“Connect GitHub”** and authorize Render.
4. Find your **Easy11** repo in the list and click **“Connect”** (or “Connect repository” next to it).

## Step 2.2 — Configure the service

1. **Name:** e.g. `easy11-api` (or anything you like). This will become part of the URL: `https://easy11-api.onrender.com`.
2. **Region:** Choose one (e.g. Oregon).
3. **Branch:** `main` (or the branch you use for deployment).
4. **Root Directory:**  
   Type exactly: **`backend`**  
   (So Render only builds and runs the backend folder.)
5. **Runtime:** **Node**.
6. **Build Command:**  
   Type exactly (installs deps, generates Prisma, compiles TypeScript):
   ```bash
   npm install && npx prisma generate && npm run build
   ```
7. **Start Command:**  
   Type exactly:
   ```bash
   npm run start
   ```
   (This runs `node dist/server.js`, which the build step creates.)

## Step 2.3 — Add environment variables

In the same “Create Web Service” page, scroll to **Environment Variables** and click **“Add Environment Variable”**. Add these **one by one**:

| Key               | Value |
|-------------------|--------|
| `DATABASE_URL`    | Paste your **full Neon connection string** from Part 1. |
| `NODE_ENV`        | `production` |
| `JWT_ACCESS_SECRET`  | A long random string (e.g. 32+ characters). You can generate one at [randomkeygen.com](https://randomkeygen.com) (Code 128 bit). |
| `JWT_REFRESH_SECRET` | Another long random string (different from the first). |
| `FRONTEND_URL`    | For now use a placeholder: `https://your-app.vercel.app` (you’ll change this after you create the Vercel app in Part 3). |

- **Important:**  
  - No quotes around the values.  
  - For `DATABASE_URL`, paste the **entire** Neon string including `?sslmode=require`.  
  - Don’t commit these secrets to Git; they stay only in Render.

Click **“Create Web Service”**. Render will build and deploy. The first deploy can take a few minutes.

## Step 2.4 — Get your API URL and test health

1. When the deploy finishes, the top of the page shows the service URL, e.g.  
   `https://easy11-api.onrender.com`
2. Open in a browser (or use Postman/curl):
   ```text
   https://easy11-api.onrender.com/health
   ```
   You should see JSON with `"status":"healthy"` and something like `"database":"connected"`.
3. If you see “Application failed to respond” or 503:
   - Free tier can **spin down** when idle. Wait 30–60 seconds and try again.
   - Check the **Logs** tab on Render for errors (e.g. wrong `DATABASE_URL` or missing env var).

**Copy your Render URL** (e.g. `https://easy11-api.onrender.com`). You’ll need it for Vercel and for updating `FRONTEND_URL` later.

---

# Part 3 — Vercel (customer website)

## Step 3.1 — Create a project and connect GitHub

1. Go to **[vercel.com](https://vercel.com)** and log in (e.g. with GitHub).
2. Click **“Add New…”** → **“Project”**.
3. Import your **Easy11** repo (or select it if it’s already connected).
4. Click **Import** (or **Continue**).

## Step 3.2 — Configure build (root, framework, commands)

1. **Root Directory:**  
   Click **“Edit”** next to “Root Directory” and set it to:  
   **`apps/web/frontend`**  
   Then confirm (e.g. **Continue**).
2. **Framework Preset:**  
   Should be detected as **Vite**. If not, choose **Vite**.
3. **Build Command:**  
   Leave as **`npm run build`** (or whatever is pre-filled for Vite).
4. **Output Directory:**  
   Leave as **`dist`** (default for Vite).
5. **Install Command:**  
   Leave as **`npm install`**.

## Step 3.3 — Add environment variable (API URL)

1. Expand **“Environment Variables”**.
2. **Name:** `VITE_API_URL`  
   **Value:** Your **Render API base URL** + `/api/v1` (no trailing slash).  
   Examples:
   - If Render URL is `https://easy11-api.onrender.com`, then:
     ```text
     https://easy11-api.onrender.com/api/v1
     ```
   - If it’s `https://easy11-api-xyz.onrender.com`, then:
     ```text
     https://easy11-api-xyz.onrender.com/api/v1
     ```
3. Leave environment as **Production** (and optionally add the same variable for Preview if you want).
4. Click **Deploy**.

Vercel will build and deploy. When it’s done, you’ll get a URL like `https://easy11-xxx.vercel.app`.

## Step 3.4 — Point Render back to your real frontend URL

1. In **Render**, open your **easy11-api** (or whatever you named it) service.
2. Go to **Environment** (left sidebar).
3. Find **`FRONTEND_URL`** and change it from `https://your-app.vercel.app` to your **actual Vercel URL**, e.g.  
   `https://easy11-xxx.vercel.app`  
   (Use the exact URL Vercel gave you.)
4. Save. Render may redeploy automatically; if not, trigger a **Manual Deploy** so the new CORS origin is used.

---

# Part 4 — What to do next (testing and going forward)

## 4.1 — Test the live site

1. Open your **Vercel URL** (e.g. `https://easy11-xxx.vercel.app`).
2. If the API was sleeping, the first load might show “Service temporarily unavailable”. Wait a few seconds and refresh.
3. **Register** a new account (email + password).
4. **Log in** with that account.
5. **Browse products**, add to cart, go to **Checkout**, and **place an order**.
6. Open **Account → Orders**. The order should appear.
7. Open **Account → Rewards**. You should see points/tier.
8. Open **Account → Support** and **submit a support ticket**. It should succeed.
9. **Log out**, then **log in again**. Orders and rewards should still be there (persisted in Neon).

If anything fails, check:
- **Vercel:** Build logs; env var `VITE_API_URL` must be exactly `https://YOUR-RENDER-URL/api/v1`.
- **Render:** Logs tab; `DATABASE_URL` and `FRONTEND_URL` correct; `/health` returns healthy.
- **Neon:** In the Neon dashboard, check that the database has tables (e.g. after running migrations in Part 1.2).

### Fixing “Network error: Unable to reach server” or “Service temporarily unavailable”

If you see **“Network error: Unable to reach server”** when registering or logging in, or an orange **“Service temporarily unavailable”** banner, the frontend cannot reach your Render API. Fix it in this order:

1. **Set and redeploy Vercel (most common cause)**  
   - In **Vercel** → your project → **Settings** → **Environment Variables**, add or edit:
     - **Name:** `VITE_API_URL`  
     - **Value:** `https://YOUR-RENDER-URL/api/v1`  
       Example: `https://easy11-ai-commerce-platform.onrender.com/api/v1`  
       (Replace with your real Render service URL; no trailing slash.)
   - **Important:** Vite bakes this into the build. After changing it you **must redeploy**: **Deployments** → ⋮ on the latest deployment → **Redeploy**. Otherwise the app still uses the old (or empty) URL.

2. **Wake Render (free tier)**  
   - Free instances spin down after ~15 minutes of no traffic. The first request can take **50+ seconds**.
   - Open in a new tab: `https://YOUR-RENDER-URL/health` (e.g. `https://easy11-ai-commerce-platform.onrender.com/health`). Wait until you see `{"status":"healthy", ...}`.
   - Then try **Create Account** or **Sign in** again on your Vercel site.

3. **CORS: set FRONTEND_URL on Render (very common cause of “Network error”)**  
   - The browser sends your **Vercel site’s origin** (e.g. `https://easy11-xyz.vercel.app`) with each request. Render only allows requests when that origin is in **`FRONTEND_URL`**.
   - In **Render** → your service → **Environment**, set **`FRONTEND_URL`** to your **exact Vercel URL**:
     - Open your live site in the browser and **copy the URL from the address bar** (e.g. `https://easy11-xyz.vercel.app`).
     - Paste that as the value of `FRONTEND_URL` — **no trailing slash**, **same protocol (https)** and **exact domain**.
   - Save and run **Manual Deploy** so the new origin is allowed.
   - **If you use multiple Vercel URLs** (e.g. preview deployments), set `FRONTEND_URL` to a comma-separated list: `https://easy11-xyz.vercel.app,https://easy11-xyz-git-main.vercel.app`.

4. **Verify in the browser**  
   - On your **Vercel site**, open **Developer Tools** (F12) → **Network** tab.  
   - Click **Create Account** (or **Sign in**) and watch the first request:
     - **Request URL** should be `https://YOUR-RENDER-URL.onrender.com/api/v1/auth/register` (or `/auth/login`). If it shows your Vercel domain instead of Render, `VITE_API_URL` is not set or not applied — set it and **redeploy Vercel**.
     - If the request is **blocked** (red, “CORS” or “blocked by CORS policy” in Console), add that exact origin to **`FRONTEND_URL`** on Render and redeploy Render.
   - You can also test connectivity: on your Vercel site, open the **Console** tab and run:  
     `fetch('https://easy11-ai-commerce-platform.onrender.com/api/v1/ping').then(r=>r.json()).then(console.log)`  
     (Replace with your Render URL.) If you see `{ok: true, ...}`, the API and CORS are fine. If you get a CORS error, fix `FRONTEND_URL` on Render.

5. **Check Render logs**  
   - In **Render** → your service → **Logs**, look for a line like: **`CORS rejected origin (add to FRONTEND_URL on Render): https://your-vercel-url.vercel.app`**.  
   - If you see that, add that **exact** URL to **`FRONTEND_URL`** (or as an extra value in a comma-separated list), save, and **Manual Deploy**.

6. **Double-check**  
   - No typo in the Render URL in `VITE_API_URL`.  
   - `VITE_API_URL` has no trailing slash.  
   - You **redeployed Vercel** after setting or changing `VITE_API_URL`.  
   - `FRONTEND_URL` on Render matches the URL in your browser when you use the app (no trailing slash).

## 4.2 — Default logins (if you seeded)

If you ran `npm run prisma:seed` against Neon in Part 1.2, you can also log in with:

- **Admin:** `admin@easy11.com` / `admin123`
- **Customer:** `customer@easy11.com` / `admin123`

(Change these in production or disable them when you’re done demoing.)

## 4.3 — Summary checklist

- [ ] Neon: project created, connection string copied.
- [ ] Neon: `prisma migrate deploy` (and optionally `prisma:seed`) run with `DATABASE_URL` set to Neon.
- [ ] Render: Web Service created, root = `backend`, build = `npm install && npx prisma generate`, start = your server command.
- [ ] Render: `DATABASE_URL`, `NODE_ENV`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL` set.
- [ ] Render: `/health` returns healthy.
- [ ] Vercel: project created, root = `apps/web/frontend`, `VITE_API_URL` = `https://YOUR-RENDER-URL/api/v1`.
- [ ] Vercel: deploy successful.
- [ ] Render: `FRONTEND_URL` updated to real Vercel URL.
- [ ] Tested: register → login → order → orders list → rewards → support ticket → logout → login again.

## 4.4 — Where to get help

- **Neon:** [Neon docs](https://neon.tech/docs)  
- **Render:** [Render docs](https://render.com/docs)  
- **Vercel:** [Vercel docs](https://vercel.com/docs)  
- **This repo:** [docs/DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for a shorter reference and diagram.

You’re done. Your app is running locally and you have a path to run it live on Neon + Render + Vercel.
