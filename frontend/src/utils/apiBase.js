const isLocalDev =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]");

/**
 * Local: empty string → Axios uses same origin (Vite dev server); `/api/*` is proxied to Express (vite.config.js).
 * Production: full origin of your API (browser calls this host directly).
 */
export const API_BASE = isLocalDev ? "" : "https://knockyourknowledge.com";
