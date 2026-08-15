import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function normalizePem(raw) {
  const text = String(raw || "")
    .trim()
    .replace(/\\n/g, "\n");
  if (!text) return "";
  if (text.includes("BEGIN")) return text;
  const body = text.replace(/\s+/g, "");
  const lines = body.match(/.{1,64}/g) || [body];
  return `-----BEGIN PUBLIC KEY-----\n${lines.join("\n")}\n-----END PUBLIC KEY-----`;
}

export function loadCashfreePublicKey() {
  const inline = normalizePem(process.env.CASHFREE_PUBLIC_KEY);
  if (inline) return assertUsablePublicKey(inline);

  const keyPath = String(process.env.CASHFREE_PUBLIC_KEY_PATH || "").trim();
  if (!keyPath) return "";

  const resolved = path.isAbsolute(keyPath)
    ? keyPath
    : path.resolve(backendRoot, keyPath);
  if (!fs.existsSync(resolved)) {
    const err = new Error(
      "Cashfree 2FA public key file not found. Extract the .pem from public-key.zip into backend/keys/cashfree_public_key.pem (Cashfree emails the zip password)."
    );
    err.status = 503;
    throw err;
  }
  return assertUsablePublicKey(normalizePem(fs.readFileSync(resolved, "utf8")));
}

function assertUsablePublicKey(pem) {
  if (!pem || !pem.includes("BEGIN")) {
    const err = new Error(
      "Cashfree 2FA public key file is empty or invalid. Extract the .pem from public-key.zip into backend/keys/cashfree_public_key.pem (Cashfree emails the zip password)."
    );
    err.status = 503;
    throw err;
  }
  return pem;
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
    const err = new Error(
      "Could not build Cashfree 2FA signature. Check that CASHFREE_PUBLIC_KEY_PATH points to the Cashfree public key .pem file."
    );
    err.status = 503;
    err.cause = cause;
    throw err;
  }
}
