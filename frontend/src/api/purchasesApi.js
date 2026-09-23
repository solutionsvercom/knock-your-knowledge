import { apiUrl } from "@/config/api";

export async function fetchMyPurchases(email) {
  const key = String(email || "").trim().toLowerCase();
  if (!key) return { enrollments: [], payments: [] };

  const res = await fetch(`${apiUrl("/payments/mine")}?email=${encodeURIComponent(key)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not load purchases.");
  }
  return {
    enrollments: data.enrollments || [],
    payments: data.payments || [],
  };
}
