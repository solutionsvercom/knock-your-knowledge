/** Shared internship / checkout pricing */
export const INTERNSHIP_FEE_AMOUNT = 3999;
export const INTERNSHIP_FEE_LABEL = "₹3999/-";
export const GST_RATE = 0.18; // 18% GST as applicable

export function formatInr(amount) {
  return `₹${Math.round(Number(amount) || 0).toLocaleString("en-IN")}/-`;
}

/** Apply coupon fraction to original (e.g. 0.7 = pay 70%). */
export function discountedPrice(original, payFraction = 1) {
  return Math.round((Number(original) || 0) * Number(payFraction || 1));
}

/**
 * GST on taxable base (after any discount).
 * Returns { base, gst, total }.
 */
export function withGst(baseAmount) {
  const base = Math.round(Number(baseAmount) || 0);
  const gst = Math.round(base * GST_RATE);
  return { base, gst, total: base + gst };
}

export function feeLabelWithGst(base = INTERNSHIP_FEE_AMOUNT) {
  return `${formatInr(base)} + 18% GST`;
}
