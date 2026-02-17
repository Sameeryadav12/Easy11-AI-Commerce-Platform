#!/usr/bin/env node
/**
 * Start the full Easy11 stack: Postgres + Redis, DB setup, backend, frontend.
 * Usage: npm run dev (from repo root)
 */
const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const backendDir = path.join(root, 'backend');

function run(cmd, opts = {}) {
  execSync(cmd, { ...opts, stdio: 'inherit', shell: true, cwd: opts.cwd ?? root });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('🚀 Easy11 – starting full stack...\n');

  // 1. Start Postgres + Redis
  console.log('1️⃣  Starting Postgres & Redis (Docker)...');
  try {
    run('docker compose up -d postgres redis', { cwd: root });
  } catch (e) {
    console.warn('Docker start failed (start Docker Desktop for Postgres/Redis). Continuing without infra...');
  }
  await wait(8000);

  // 2. DB setup
  console.log('\n2️⃣  Setting up database (Prisma generate, migrate, seed)...');
  run('npx prisma generate', { cwd: backendDir });
  try {
    run('npx prisma migrate deploy', { cwd: backendDir });
  } catch (e) {
    console.warn('migrate deploy failed (e.g. no migrations). Try: cd backend && npx prisma migrate dev');
  }
  try {
    run('npm run prisma:seed', { cwd: backendDir });
  } catch (e) {
    console.warn('Seed failed or already done.');
  }

  // 3. Backend + Frontend with concurrently (uses root npm scripts dev:backend, dev:frontend)
  console.log('\n3️⃣  Starting backend and frontend...\n');
  run('npx concurrently -k -n backend,frontend -c blue,green "npm run dev:backend" "npm run dev:frontend"', { cwd: root });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
