import { apiUrl } from "@/config/api";

export const INTERNSHIP_OPTIONS = [
  "Development",
  "AI & Prompt Engineering",
  "Business Analytics",
  "Advanced Digital Marketing",
];

export async function submitContactLead({ email, phone, internshipInterest, source = "get-started" }) {
  const res = await fetch(apiUrl("/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, phone, internshipInterest, source }),
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
