# Frontend - Easy11 Commerce Intelligence Platform

React + TypeScript + Tailwind CSS storefront and admin dashboard.

## Setup

1. Install dependencies and start the dev server
   ```bash
   npm install
   npm run dev
   ```

2. Configure environment variables (create `.env.local`)

   ```bash
   # apps/web/frontend/.env.local
   VITE_ML_SERVICE_URL=http://localhost:8000
   ```

   `VITE_ML_SERVICE_URL` should point to the FastAPI ML service (recommendations, pricing, forecasting).  
   If not set, the frontend falls back to `http://localhost:8000`.

## Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── hooks/          # Custom React hooks
├── services/       # API clients
├── store/          # State management
└── App.tsx
```

## Features

- Modern React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for visualizations
- React Query for data fetching
- Zustand for state management
- AI-driven experiences (personalized recommendations, explainability)

## Coming Soon

Implementation pending.

