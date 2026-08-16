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

/** Rebuild a valid PEM. Hostinger env vars often flatten newlines into spaces or \n. */
export function normalizePem(raw) {
  let text = String(raw || "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\r/g, "")
    .replace(/\\n/g, "\n");
  if (!text) return "";

  const labeled = text.match(
    /-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/
  );
  let type = "PUBLIC KEY";
  let body = "";
  if (labeled) {
    type = labeled[1].trim();
    body = labeled[2];
  } else {
    body = text
      .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
      .replace(/-----END [A-Z0-9 ]+-----/g, "");
  }
  body = body.replace(/\s+/g, "");
  if (body.length < 120 || /[^A-Za-z0-9+/=]/.test(body)) return "";
  const lines = body.match(/.{1,64}/g) || [body];
  return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
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
    `${detail} Paste CASHFREE_PUBLIC_KEY as one line using \\n between PEM lines (copy from local backend/keys/cashfree_public_key.pem). Remove CASHFREE_PUBLIC_KEY_PATH. Save and redeploy.`
  );
  err.status = 503;
  return err;
}

export function loadCashfreePublicKey() {
  const inline = normalizePem(
    envText("CASHFREE_PUBLIC_KEY") || envText("CASHFREE_2FA_PUBLIC_KEY")
  );
  if (inline) return inline;

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
    if (pem) return pem;
  }

  if (envText("CASHFREE_PUBLIC_KEY") || envText("CASHFREE_2FA_PUBLIC_KEY") || configuredPath) {
    throw hostingerKeyError("Cashfree 2FA public key is set but is not a valid PEM.");
  }

  return "";
}

function encryptWithPublicKey(publicKey, payload) {
  const keyObject = crypto.createPublicKey(publicKey);
  return crypto.publicEncrypt(
    {
      key: keyObject,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha1",
    },
    Buffer.from(payload, "utf8")
  );
}

/** RSA-OAEP signature for Cashfree X-Cf-Signature (clientId.unixTimestamp). */
export function cashfreeTwoFactorSignature(clientId) {
  const publicKey = loadCashfreePublicKey();
  if (!publicKey) return null;

  const payload = `${clientId}.${Math.floor(Date.now() / 1000)}`;
  try {
    return encryptWithPublicKey(publicKey, payload).toString("base64");
  } catch (cause) {
    const reason = cause?.message || "unknown crypto error";
    const err = hostingerKeyError(
      `Could not build the Cashfree 2FA signature (${reason}).`
    );
    err.cause = cause;
    throw err;
  }
}
