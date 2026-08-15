/**
 * Backend API base URL.
 * Dev: leave empty to use Vite proxy (`/api` → localhost:5001).
 * Prod: set VITE_API_BASE_URL to your API host including `/api`
 *   e.g. https://kyk-api.up.railway.app/api
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
