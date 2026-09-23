import { apiUrl } from "@/config/api";

export const INTERNSHIP_OPTIONS = [
  "Development",
  "AI & Prompt Engineering",
  "Business Analytics",
  "Advanced Digital Marketing",
];

export function matchInternshipOption(title) {
  const t = String(title || "").trim();
  if (INTERNSHIP_OPTIONS.includes(t)) return t;
  const lower = t.toLowerCase();
  const exact = INTERNSHIP_OPTIONS.find((opt) => opt.toLowerCase() === lower);
  if (exact) return exact;
  if (lower.includes("prompt") || (lower.includes("ai") && lower.includes("engineer"))) {
    return "AI & Prompt Engineering";
  }
  if (lower.includes("develop")) return "Development";
  if (lower.includes("analytic")) return "Business Analytics";
  if (lower.includes("market")) return "Advanced Digital Marketing";
  return "";
}

export async function submitContactLead({
  name,
  email,
  phone,
  internshipInterest,
  source = "get-started",
}) {
  const res = await fetch(apiUrl("/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, internshipInterest, source }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Could not submit the form. Is the API running?");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
