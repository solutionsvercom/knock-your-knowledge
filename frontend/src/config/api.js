const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "[::1]";

/** Production: replace `YOUR_SERVER_IP` with your live backend host or IP (Express must listen here). */
const LIVE_API_ORIGIN = "http://YOUR_SERVER_IP:5000";

/**
 * Local: "" → browser calls same origin as Vite (e.g. :5173); `/api/*` is forwarded to Express (vite.config.js reads backend/.env PORT).
 * Production: direct API host (no same-origin /api).
 */
export const API_BASE = isLocalhost ? "" : LIVE_API_ORIGIN;

console.log("Using API BASE:", API_BASE || "(dev: Vite proxy → backend)");
