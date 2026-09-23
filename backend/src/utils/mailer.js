import nodemailer from "nodemailer";

let transporter = null;

function smtpConfigured() {
  return Boolean(String(process.env.SMTP_USER || "").trim() && String(process.env.SMTP_PASS || "").trim());
}

function getTransporter() {
  if (!smtpConfigured()) return null;
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;

  transporter = nodemailer.createTransport({
    host: String(process.env.SMTP_HOST || "smtp.gmail.com").trim(),
    port,
    secure,
    auth: {
      user: String(process.env.SMTP_USER).trim(),
      pass: String(process.env.SMTP_PASS).trim(),
    },
  });
  return transporter;
}

export function mailFromAddress() {
  const from = String(process.env.MAIL_FROM || "").trim();
  if (from) return from;
  const user = String(process.env.SMTP_USER || "kyourk2024@gmail.com").trim();
  return `Knock Your Knowledge <${user}>`;
}

export async function sendMail({ to, subject, text, html }) {
  const tx = getTransporter();
  if (!tx) {
    console.warn("[mail] SMTP_USER / SMTP_PASS not set; skipped email to", to);
    return { skipped: true };
  }
  await tx.sendMail({
    from: mailFromAddress(),
    to,
    subject,
    text,
    html,
  });
  return { ok: true };
}
