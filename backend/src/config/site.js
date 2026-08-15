/** Canonical public site — Hostinger + Cashfree production. */
export const LIVE_SITE_URL = "https://knockyourknowledge.com";
export const LIVE_SITE_WWW_URL = "https://www.knockyourknowledge.com";

export function defaultAllowedOrigins() {
  return [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    LIVE_SITE_URL,
    LIVE_SITE_WWW_URL,
  ];
}
