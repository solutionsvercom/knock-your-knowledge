/**
 * Backend API base URL.
 * Leave empty so the UI calls same-origin `/api` (local Vite proxy and
 * Hostinger, where Express serves the built frontend from backend/public).
 */
const raw = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const API_BASE = raw;

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE) return `/api${p.startsWith("/api") ? p.slice(4) : p}`;
  // API_BASE already ends with /api
  if (p.startsWith("/api/")) return `${API_BASE}${p.slice(4)}`;
  if (p.startsWith("/api")) return `${API_BASE}${p.slice(4) || ""}`;
  return `${API_BASE}${p}`;
}
