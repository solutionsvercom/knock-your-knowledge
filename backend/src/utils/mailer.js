import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: path.join(backendRoot, ".env") });
dotenv.config({ path: path.join(backendRoot, "..", ".env") });

let transporter = null;

export function smtpUser() {
  return String(process.env.SMTP_USER || process.env.MAIL_USER || "").trim();
}

export function smtpPass() {
  return String(process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.MAIL_PASS || "")
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export function smtpConfigured() {
  return Boolean(smtpUser() && smtpPass() && smtpPass().length >= 8);
}

export function mailFromAddress() {
  const from = String(process.env.MAIL_FROM || "")
    .trim()
    .replace(/^["']|["']$/g, "");
  if (from) return from;
  const user = smtpUser() || "kyourk2024@gmail.com";
  return `Knock Your Knowledge <${user}>`;
}

function createGmailTransport(port) {
  const user = smtpUser();
  const pass = smtpPass();
  if (port === 465) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
  });
}

function createCustomTransport() {
  const user = smtpUser();
  const pass = smtpPass();
  const host = String(process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465,
    auth: { user, pass },
  });
}

function isGmail() {
  const host = String(process.env.SMTP_HOST || "smtp.gmail.com").trim();
  return /gmail/i.test(host) || /@gmail\.com$/i.test(smtpUser());
}

async function getVerifiedTransporter() {
  if (!smtpConfigured()) return null;
  if (transporter) return transporter;

  const attempts = isGmail()
    ? [() => createGmailTransport(587), () => createGmailTransport(465)]
    : [() => createCustomTransport()];

  let lastErr = null;
  for (const make of attempts) {
    const tx = make();
    try {
      await tx.verify();
      transporter = tx;
      return transporter;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("Could not connect to SMTP");
}

export async function sendMail({ to, subject, text, html }) {
  if (!smtpConfigured()) {
    console.warn(
      "[mail] SMTP_PASS is empty — enrollment emails are NOT sending. Set a Gmail App Password for",
      smtpUser() || "SMTP_USER"
    );
    return { skipped: true, reason: "smtp_not_configured" };
  }
  try {
    const tx = await getVerifiedTransporter();
    const info = await tx.sendMail({
      from: mailFromAddress(),
      to,
      replyTo: smtpUser() || undefined,
      subject,
      text,
      html,
    });
    console.log("[mail] sent", subject, "→", to, info?.messageId || "");
    return { ok: true, messageId: info?.messageId };
  } catch (err) {
    transporter = null;
    console.error("[mail] send failed:", err?.message || err);
    return { ok: false, error: err?.message || "send_failed" };
  }
}

export async function logMailStatus() {
  if (!smtpConfigured()) {
    console.warn(
      "[mail] DISABLED (missing SMTP_USER or SMTP_PASS). Students will not receive welcome emails after payment."
    );
    return { ok: false, reason: "smtp_not_configured" };
  }
  try {
    await getVerifiedTransporter();
    console.log("[mail] SMTP ready as", smtpUser(), `(pass length ${smtpPass().length})`);
    return { ok: true, user: smtpUser() };
  } catch (err) {
    transporter = null;
    console.error("[mail] SMTP verify failed:", err?.message || err);
    return { ok: false, error: err?.message || "verify_failed" };
  }
}
