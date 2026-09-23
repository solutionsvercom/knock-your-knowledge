import mongoose from "mongoose";

export const INTERNSHIP_OPTIONS = [
  "Development",
  "AI & Prompt Engineering",
  "Business Analytics",
  "Advanced Digital Marketing",
];

export function normalizeInternshipInterest(value) {
  const t = String(value || "").trim();
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

const contactLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    internshipInterest: {
      type: String,
      required: true,
      enum: INTERNSHIP_OPTIONS,
    },
    source: {
      type: String,
      default: "get-started",
    },
  },
  { timestamps: true }
);

contactLeadSchema.index({ email: 1, createdAt: -1 });

export const ContactLead = mongoose.model("ContactLead", contactLeadSchema);
