import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

export function hashPassword(plain) {
  const password = String(plain || "");
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(plain, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  try {
    const next = scryptSync(String(plain || ""), salt, 64);
    const prev = Buffer.from(hash, "hex");
    if (next.length !== prev.length) return false;
    return timingSafeEqual(next, prev);
  } catch {
    return false;
  }
}

/** Short password students can type from the welcome email. */
export function generateStudentPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let body = "";
  const bytes = randomBytes(8);
  for (let i = 0; i < 8; i += 1) {
    body += alphabet[bytes[i] % alphabet.length];
  }
  return `Kyk${body}`;
}

export function newSessionToken() {
  return randomBytes(32).toString("hex");
}

export function makeResetToken() {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

export function hashResetToken(token) {
  return createHash("sha256").update(String(token || "")).digest("hex");
}
