import mongoose from "mongoose";

const paymentOrderSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "cashfree" },
    /** Merchant order id (also sent to Cashfree as order_id). */
    orderId: { type: String, required: true, unique: true, index: true },
    paymentSessionId: { type: String, default: null },
    paymentId: { type: String, default: null },
    amountInr: { type: Number, required: true },
    amountPaise: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    coupon: { type: String, default: null },
    items: { type: Array, default: [] },
    customer: {
      name: String,
      email: String,
      contact: String,
    },
  },
  { timestamps: true }
);

export const PaymentOrder = mongoose.model("PaymentOrder", paymentOrderSchema);
