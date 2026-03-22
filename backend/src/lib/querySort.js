/**
 * Safe Mongoose sort/limit from Express query (Zod + invalid sort strings can break .sort()).
 */
export function listQuerySort(raw, allowedFields, fallback = "-createdAt") {
  const allowed = new Set(allowedFields);
  let s = Array.isArray(raw) ? raw[0] : raw;
  if (typeof s !== "string") s = fallback;
  s = s.trim();
  const base = s.replace(/^-/, "");
  if (!allowed.has(base) || /[$.{}\[\]]/.test(s)) return fallback;
  return s;
}

export function listQueryLimit(raw) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 1) return undefined;
  return Math.min(Math.floor(n), 500);
}
