# Push this project to GitHub (step-by-step)

Use these steps to push your local Easy11 project to:

**https://github.com/Sameeryadav12/Easy11-AI-Commerce-Platform**

---

## Step 1 — Open a terminal in the project

1. Open **PowerShell** or **Command Prompt**.
2. Go to the project root:
   ```bash
   cd d:\Projects\Easy11
   ```

---

## Step 2 — Check the remote

Run:

```bash
git remote -v
```

You should see:

- `origin  https://github.com/Sameeryadav12/Easy11-AI-Commerce-Platform.git (fetch)`
- `origin  https://github.com/Sameeryadav12/Easy11-AI-Commerce-Platform.git (push)`

If not, add it:

```bash
git remote add origin https://github.com/Sameeryadav12/Easy11-AI-Commerce-Platform.git
```

If `origin` points to a different URL, fix it:

```bash
git remote set-url origin https://github.com/Sameeryadav12/Easy11-AI-Commerce-Platform.git
```

---

## Step 3 — Stage all changes

```bash
git add -A
```

This adds:

- All modified files
- All new files (docs, config, components, etc.)
- All deletions (e.g. files moved from root to `docs/archive` or `docs/guides`)

---

## Step 4 — Check what will be committed

```bash
git status
```

Skim the list. Make sure there is **no** `.env` or file containing passwords or API keys.  
(The project `.gitignore` already excludes `.env`.)

---

## Step 5 — Commit

```bash
git commit -m "GitHub-ready: docs, deployment (Neon/Render/Vercel), API config, orders/rewards/support backend, frontend polish"
```

If Git asks you to set `user.name` and `user.email` (first time), run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Then run the `git commit` command again.

---

## Step 6 — Push to GitHub

```bash
git push -u origin main
```

If your branch is named `master` instead of `main`:

```bash
git push -u origin master
```

- If GitHub asks for a **password**, use a **Personal Access Token (PAT)**, not your GitHub password.  
  Create one: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**. Give it `repo` scope.
- If you use **SSH** and the remote is HTTPS, you can switch to SSH:
  ```bash
  git remote set-url origin git@github.com:Sameeryadav12/Easy11-AI-Commerce-Platform.git
  git push -u origin main
  ```

---

## Step 7 — Verify on GitHub

1. Open: **https://github.com/Sameeryadav12/Easy11-AI-Commerce-Platform**
2. Check that the latest commit appears.
3. Open **README.md** and confirm it shows the new docs and deployment links.

Done. The repo is up to date and GitHub-ready.
