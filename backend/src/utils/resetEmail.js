import { LIVE_SITE_URL } from "../config/site.js";
import { sendMail } from "./mailer.js";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPasswordResetEmail({ name, email, resetUrl }) {
  const to = String(email || "").trim().toLowerCase();
  if (!to.includes("@")) return { skipped: true, reason: "no_email" };
  const student = String(name || "").trim() || "Student";
  const link = String(resetUrl || `${LIVE_SITE_URL}/login`);

  const text = [
    `Hi ${student},`,
    "",
    "We received a request to reset your Knock Your Knowledge student password.",
    "",
    `Open this link to choose a new password (valid for 1 hour):`,
    link,
    "",
    "If you did not ask for this, you can ignore this email. Your password will stay the same.",
    "",
    "Knock Your Knowledge",
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#020817;color:#e2e8f0;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#0b1224;border:1px solid rgba(167,139,250,0.25);border-radius:16px;padding:28px">
        <p style="font-size:20px;font-weight:800;color:#a78bfa;margin:0 0 8px">Knock Your Knowledge</p>
        <p style="color:#94a3b8;margin:0 0 20px">Student password reset</p>
        <p>Hi ${escapeHtml(student)},</p>
        <p>We received a request to reset your student password.</p>
        <p>
          <a href="${escapeHtml(link)}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">
            Reset password
          </a>
        </p>
        <p style="color:#94a3b8;font-size:13px">This link expires in 1 hour.<br/>${escapeHtml(link)}</p>
        <p style="color:#64748b;font-size:12px;margin-top:24px">If you did not ask for this, ignore this email.</p>
      </div>
    </div>
  `;

  return sendMail({
    to,
    subject: "Reset your KYK student password",
    text,
    html,
  });
}
