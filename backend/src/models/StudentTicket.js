import mongoose from "mongoose";

/** Student referral ticket — 1 ticket = ₹500 credit value. */
const studentTicketSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    studentEmail: { type: String, required: true, trim: true, lowercase: true },
    studentPhone: { type: String, default: "", trim: true },
    referralCode: { type: String, required: true, unique: true },
    valueInr: { type: Number, default: 500 },
    status: {
      type: String,
      enum: ["open", "active", "used", "closed"],
      default: "active",
    },
    notes: { type: String, default: "" },
    raisedBy: { type: String, default: "admin" },
    referralsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TICKET_VALUE_INR = 500;
export const StudentTicket = mongoose.model("StudentTicket", studentTicketSchema);
