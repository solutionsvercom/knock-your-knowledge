/**
 * Vercel serverless: forwards browser calls to same-origin `/api/*` → your Express API.
 * Fixes 405 on POST /api/... when the site is static-only on Vercel.
 *
 * Vercel → Settings → Environment Variables (server-side, not VITE_*):
 *   KYK_BACKEND_ORIGIN=https://your-app.up.railway.app
 * No trailing slash, no `/api` suffix.
 *
 * Alternative: set VITE_API_BASE_URL at build time to `https://that-same-host/api` and skip this proxy.
 */

export default async function handler(req, res) {
  const raw = (process.env.KYK_BACKEND_ORIGIN || process.env.BACKEND_URL || "").trim();
  const backend = raw.replace(/\/$/, "");
  if (!backend || /your-express-host|your-api-host|example\.invalid|placeholder|changeme/i.test(backend)) {
    res.status(503).json({
      message:
        "Vercel API proxy: set KYK_BACKEND_ORIGIN to your Express base URL (e.g. https://xxx.up.railway.app). Or set VITE_API_BASE_URL at build time instead.",
      code: "PROXY_BACKEND_MISSING",
    });
    return;
  }

  const q = req.query || {};
  const pathParam = q.p;
  const pathStr = Array.isArray(pathParam) ? pathParam.join("/") : pathParam || "";
  // eslint-disable-next-line no-unused-vars
  const { p: _p, ...forwardQuery } = q;
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(forwardQuery)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) for (const item of v) sp.append(k, String(item));
    else sp.append(k, String(v));
  }
  const qs = sp.toString();
  const targetUrl = `${backend}/api/${pathStr}${qs ? `?${qs}` : ""}`;

  const headers = new Headers();
  for (const name of ["authorization", "content-type", "accept", "accept-language", "cookie", "x-requested-with"]) {
    const v = req.headers[name];
    if (v) headers.set(name, Array.isArray(v) ? v.join(", ") : String(v));
  }

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (typeof req.body === "string") body = req.body;
    else if (Buffer.isBuffer(req.body)) body = req.body;
    else if (req.body !== undefined && req.body !== null && typeof req.body === "object") {
      body = JSON.stringify(req.body);
      if (!headers.has("content-type")) headers.set("content-type", "application/json");
    }
  }

  let upstream;
  try {
    upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body ?? undefined,
    });
  } catch (e) {
    res.status(502).json({
      message: `Could not reach API: ${e?.message || String(e)}`,
      code: "PROXY_UPSTREAM_ERROR",
    });
    return;
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  const ct = upstream.headers.get("content-type");
  if (ct) res.setHeader("Content-Type", ct);
  res.status(upstream.status).send(buf);
}
