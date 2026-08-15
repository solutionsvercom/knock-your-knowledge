/** Public contact — update these as needed. */
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
