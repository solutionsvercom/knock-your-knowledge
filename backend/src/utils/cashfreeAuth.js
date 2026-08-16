import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = path.resolve(backendRoot, "..");

function envText(name) {
  return String(process.env[name] || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .trim();
}

function normalizePem(raw) {
  const text = String(raw || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\r/g, "")
    .replace(/\\n/g, "\n");
  if (!text) return "";
  if (text.includes("BEGIN")) return text;
  const body = text.replace(/\s+/g, "");
  const lines = body.match(/.{1,64}/g) || [body];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join("\n")}\n-----END PUBLIC KEY-----`;
}

function readPemFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return "";
  try {
    return normalizePem(fs.readFileSync(filePath, "utf8"));
  } catch {
    return "";
  }
}

function hostingerKeyError(detail) {
  const err = new Error(
    `${detail} On Hostinger, open the Node.js app → Environment variables, remove CASHFREE_PUBLIC_KEY_PATH, and set CASHFREE_PUBLIC_KEY to the full PEM text from backend/keys/cashfree_public_key.pem (including BEGIN/END lines). Redeploy after saving.`
  );
  err.status = 503;
  return err;
}

export function loadCashfreePublicKey() {
  const inline = normalizePem(
    envText("CASHFREE_PUBLIC_KEY") || envText("CASHFREE_2FA_PUBLIC_KEY")
  );
  if (inline.includes("BEGIN")) return inline;

  const configuredPath = envText("CASHFREE_PUBLIC_KEY_PATH");
  const candidates = [
    configuredPath
      ? path.isAbsolute(configuredPath)
        ? configuredPath
        : path.resolve(backendRoot, configuredPath)
      : "",
    configuredPath ? path.resolve(process.cwd(), configuredPath) : "",
    path.join(backendRoot, "keys/cashfree_public_key.pem"),
    path.join(repoRoot, "backend/keys/cashfree_public_key.pem"),
    path.join(process.cwd(), "backend/keys/cashfree_public_key.pem"),
    path.join(process.cwd(), "keys/cashfree_public_key.pem"),
  ].filter(Boolean);

  for (const filePath of candidates) {
    const pem = readPemFile(filePath);
    if (pem.includes("BEGIN")) return pem;
  }

  if (inline || configuredPath) {
    throw hostingerKeyError(
      "Cashfree 2FA public key was not found on the server (the .pem file is not deployed)."
    );
  }

  return "";
}

/** RSA-OAEP signature for Cashfree X-Cf-Signature (clientId.unixTimestamp). */
export function cashfreeTwoFactorSignature(clientId) {
  const publicKey = loadCashfreePublicKey();
  if (!publicKey) return null;

  const payload = `${clientId}.${Math.floor(Date.now() / 1000)}`;
  try {
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha1",
      },
      Buffer.from(payload, "utf8")
    );
    return encrypted.toString("base64");
  } catch (cause) {
    const err = hostingerKeyError(
      "Could not build the Cashfree 2FA signature from CASHFREE_PUBLIC_KEY."
    );
    err.cause = cause;
    throw err;
  }
}
