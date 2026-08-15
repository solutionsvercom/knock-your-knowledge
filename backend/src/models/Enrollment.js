import mongoose from "mongoose";

/** Enrollment / purchase record created after successful Cashfree payment. */
const enrollmentSchema = new mongoose.Schema(
  {
    studentName: { type: String, default: "" },
    studentEmail: { type: String, required: true, lowercase: true, trim: true },
    studentPhone: { type: String, default: "" },
    itemType: { type: String, default: "internship" },
    itemId: { type: String, default: "" },
    itemTitle: { type: String, default: "" },
    amountPaid: { type: Number, default: 0 },
    taxableAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    coupon: { type: String, default: null },
    orderId: { type: String, default: "" },
    paymentId: { type: String, default: "", index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ["paid", "refunded"], default: "paid" },
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
