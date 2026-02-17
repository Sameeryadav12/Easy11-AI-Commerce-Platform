# Run Easy11 Completely

One command from the repo root:

```bash
npm run dev
```

This will:

1. **Start Postgres & Redis** via Docker (`docker compose up -d postgres redis`).  
   → **Start Docker Desktop first** if you're on Windows.

2. **Set up the database**: Prisma generate, migrate, and seed (admin user, sample products).

3. **Start backend** (http://localhost:5000) and **frontend** (http://localhost:3000) together.

---

### Option 2: Run app without Docker (frontend + backend only)

In one terminal: `npm run dev:backend`  
In a second: `npm run dev:frontend`  

Or: `npm run start:app` (opens two windows).  
Then open **http://localhost:3000**. For login/products, start Docker and run `docker compose up -d postgres redis`, then `npm run dev:db`.

---

### If Docker isn’t running

- Start **Docker Desktop**, then run `npm run dev` again.  
- Or run Postgres and Redis yourself (e.g. local install or another compose), then:

```bash
npm run dev:db     # once: generate, migrate, seed
npm run dev:backend   # terminal 1
npm run dev:frontend  # terminal 2 (or use npm run dev after dev:db)
```

---

### Useful commands (from repo root)

| Command | Description |
|--------|-------------|
| `npm run dev` | Full stack (infra + DB setup + backend + frontend) |
| `npm run dev:infra` | Start only Postgres + Redis (Docker) |
| `npm run dev:infra:down` | Stop Postgres + Redis |
| `npm run dev:db` | Prisma generate, migrate deploy, seed |
| `npm run dev:backend` | Backend only (port 5000) |
| `npm run dev:frontend` | Frontend only (port 3000) |
| `npm run start:app` | Start backend + frontend in two windows (no Docker) |

---

### Default logins (after seed)

- **Admin**: `admin@easy11.com` / `admin123`
- **Customer**: `customer@easy11.com` / `admin123`

---

### Documentation and production

- **Full documentation:** [docs/README.md](docs/README.md)
- **Production deployment:** [docs/deployment.md](docs/deployment.md)
