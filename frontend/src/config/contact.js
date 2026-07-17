/** Public contact — update these as needed. */
export const WHATSAPP_APPLY_NUMBER = "919876543210";
export const CONTACT_EMAIL = "knockyourknowledge@gmail.com";
export const CONTACT_PHONE = "+91 98765 43210";
export const CONTACT_PHONE_TEL = "+919876543210";

export function whatsappApplyUrl(programName) {
  const message = `Hi, I am interested in applying for the "${programName}" internship program at Knock Your Knowledge. Please share the next steps.`;
  return `https://wa.me/${WHATSAPP_APPLY_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappGetStartedUrl() {
  const message =
    "Hi, I want to get started with Knock Your Knowledge. Please share details about your internship courses and programs.";
  return `https://wa.me/${WHATSAPP_APPLY_NUMBER}?text=${encodeURIComponent(message)}`;
}
