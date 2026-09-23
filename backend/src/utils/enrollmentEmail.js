import { LIVE_SITE_URL } from "../config/site.js";
import { sendMail } from "./mailer.js";

const DASHBOARD_URL = `${LIVE_SITE_URL}/Dashboard`;
const LOGIN_URL = `${LIVE_SITE_URL}/login`;

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInr(amount) {
  return `₹${Math.round(Number(amount) || 0).toLocaleString("en-IN")}/-`;
}

export function enrollmentEmailContent({ name, email, password, courses, amountInr }) {
  const student = String(name || "").trim() || "Student";
  const courseList = Array.isArray(courses) && courses.length ? courses.join(", ") : "KYK internship program";
  const amount = formatInr(amountInr);
  const passwordLine = password
    ? password
    : "Use the password you created when you signed up on the website.";

  const text = [
    `Hi ${student},`,
    "",
    "Thank you for your payment. Your enrollment at Knock Your Knowledge is confirmed.",
    "",
    `Course enrolled: ${courseList}`,
    `Amount paid: ${amount}`,
    "",
    "Your login credentials:",
    `Email / login ID: ${email}`,
    `Password: ${passwordLine}`,
    "",
    `Log in to your student dashboard here: ${DASHBOARD_URL}`,
    `(If asked to sign in first, use ${LOGIN_URL} with the same email and password.)`,
    "",
    "Keep this email safe. If you have any questions, reply to this message or write to kyourk2024@gmail.com.",
    "",
    "Knock Your Knowledge",
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#020817;color:#e2e8f0;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#0b1224;border:1px solid rgba(167,139,250,0.25);border-radius:16px;padding:28px">
        <p style="font-size:20px;font-weight:800;color:#a78bfa;margin:0 0 8px">Knock Your Knowledge</p>
        <p style="color:#94a3b8;margin:0 0 20px">Payment confirmation &amp; login details</p>
        <p>Hi ${escapeHtml(student)},</p>
        <p>Thank you for your payment. Your enrollment is confirmed.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr>
            <td style="padding:8px 0;color:#94a3b8">Course enrolled</td>
            <td style="padding:8px 0;font-weight:700;color:#fff">${escapeHtml(courseList)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#94a3b8">Amount paid</td>
            <td style="padding:8px 0;font-weight:700;color:#34d399">${escapeHtml(amount)}</td>
          </tr>
        </table>
        <p style="margin:16px 0 8px;font-weight:700">Your login credentials</p>
        <p style="margin:4px 0">Email / login ID: <strong>${escapeHtml(email)}</strong></p>
        <p style="margin:4px 0 16px">Password: <strong>${escapeHtml(passwordLine)}</strong></p>
        <p>
          <a href="${DASHBOARD_URL}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">
            Open student dashboard
          </a>
        </p>
        <p style="color:#94a3b8;font-size:13px">
          Login link: <a href="${DASHBOARD_URL}" style="color:#67e8f9">${DASHBOARD_URL}</a><br/>
          If you need to sign in first: <a href="${LOGIN_URL}" style="color:#67e8f9">${LOGIN_URL}</a>
        </p>
        <p style="color:#64748b;font-size:12px;margin-top:24px">Keep this email safe. For help: kyourk2024@gmail.com</p>
      </div>
    </div>
  `;

  return {
    subject: `KYK enrollment confirmed — ${courseList}`,
    text,
    html,
  };
}

export async function sendEnrollmentWelcomeEmail({ name, email, password, courses, amountInr }) {
  const to = String(email || "").trim().toLowerCase();
  if (!to.includes("@")) return { skipped: true, reason: "no_email" };
  const content = enrollmentEmailContent({ name, email: to, password, courses, amountInr });
  return sendMail({ to, ...content });
}
