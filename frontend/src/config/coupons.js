/** Sample / live coupon codes for checkout. */
export const COUPONS = {
  kyk123: {
    code: "kyk123",
    /** Pay this fraction of original (0.7 = 30% off / charge 70%). */
    payFraction: 0.7,
    discountPercent: 30,
    label: "30% off — pay 70% of original price",
  },
};

export function getCoupon(code) {
  const key = String(code || "")
    .trim()
    .toLowerCase();
  return COUPONS[key] || null;
}

/** Resolve coupon from static list or MongoDB (sales / referral codes). */
export async function resolveCoupon(code) {
  const local = getCoupon(code);
  if (local) return local;

  const key = String(code || "").trim();
  if (!key) return null;

  try {
    const res = await fetch(`/api/coupons/${encodeURIComponent(key)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.coupon) return null;
    return data.coupon;
  } catch {
    return null;
  }
}
