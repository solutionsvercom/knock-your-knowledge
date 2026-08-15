import mongoose from "mongoose";

export const INTERNSHIP_OPTIONS = [
  "Development",
  "AI & Prompt Engineering",
  "Business Analytics",
  "Advanced Digital Marketing",
];

const contactLeadSchema = new mongoose.Schema(
  {
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
