/** Public contact — update these as needed. */
import { INTERNSHIP_OPTIONS } from "@/api/contactApi";

export const WHATSAPP_APPLY_NUMBER = "918384045913";
export const CONTACT_EMAIL = "kyourk2024@gmail.com";
export const CONTACT_PHONE = "+91 83840 45913";
export const CONTACT_PHONE_TEL = "+918384045913";

export const SOCIAL_INSTAGRAM_URL =
  "https://www.instagram.com/kyk20.24?igsh=MXU1YzY5bzZzd3A2Mg==";
export const SOCIAL_FACEBOOK_URL = "https://www.facebook.com/share/p/1EWAUHwdDj/";

export const KYK_LOGO_SRC = "/kyk-logo.png";

/** Company UPI QR — place image at frontend/public/upi-qr.png */
export const UPI_QR_SRC = "/upi-qr.png";
/** Optional UPI VPA shown under the QR (e.g. business@okaxis) */
export const UPI_ID = "";

export function whatsappApplyUrl(programName) {
  const message = `Hi, I am interested in applying for the "${programName}" internship program at Knock Your Knowledge. Please share the next steps.`;
  return `https://wa.me/${WHATSAPP_APPLY_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappGetStartedUrl() {
  const message =
    "Hi, I want to get started with Knock Your Knowledge. Please share details about your internship courses and programs.";
  return `https://wa.me/${WHATSAPP_APPLY_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Pre-filled WhatsApp note for people who found KYK via search. */
export function whatsappCoursesInquiryUrl() {
  const lines = INTERNSHIP_OPTIONS.map((opt) => `• ${opt}`).join("\n");
  const message = [
    "Hi Knock Your Knowledge 👋",
    "I found your website while searching and want to know more about the internship courses you offer:",
    lines,
    "Please share details, fees, and how I can enroll.",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_APPLY_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Indian mobile → WhatsApp digits (91 + 10-digit number). */
export function whatsappDigitsFromPhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return "";
}

/** Admin → prospect: follow-up after Apply Now / Get Started. */
export function whatsappProspectFollowUpUrl({ name, phone, internshipInterest } = {}) {
  const to = whatsappDigitsFromPhone(phone);
  if (!to) return "";
  const student = String(name || "").trim() || "there";
  const course = String(internshipInterest || "").trim();
  const lines = INTERNSHIP_OPTIONS.map((opt) => `• ${opt}`).join("\n");
  const message = [
    `Hi ${student},`,
    "Thank you for applying at Knock Your Knowledge.",
    course ? `You showed interest in: ${course}.` : "",
    "",
    "Our internship courses:",
    lines,
    "",
    "Fee is ₹3,999/- + 18% GST. Reply here and we will share the next steps to enroll.",
    "",
    "Knock Your Knowledge",
    "https://knockyourknowledge.com",
  ]
    .filter((line) => line !== "")
    .join("\n");
  return `https://wa.me/${to}?text=${encodeURIComponent(message)}`;
}
