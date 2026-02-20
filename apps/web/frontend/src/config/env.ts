/**
 * Single configuration point for API base URL.
 * - Development: use relative /api/v1 (Vite proxy to backend).
 * - Production: set VITE_API_URL (e.g. https://your-api.onrender.com/api/v1).
 */
const raw = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL;
export const apiBaseUrl = (raw && String(raw).trim()) ? String(raw).replace(/\/$/, '') : '/api/v1';

/** True when app is in production but API URL is relative (likely VITE_API_URL not set). */
export function isApiUrlLikelyMisconfigured(): boolean {
  if (typeof window === 'undefined') return false;
  const isProd = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
  return isProd && apiBaseUrl.startsWith('/');
}

