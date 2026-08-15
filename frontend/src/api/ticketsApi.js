import { apiUrl } from "@/config/api";

/** Tickets raised by admin for the logged-in student (matched by email). */
export async function fetchMyReferralTickets(email) {
  const key = String(email || "").trim().toLowerCase();
  if (!key) return { tickets: [], walletValue: 0, ticketValueInr: 500, count: 0 };

  const res = await fetch(`${apiUrl("/tickets/mine")}?email=${encodeURIComponent(key)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Could not load tickets.");
  }
  return data;
}
