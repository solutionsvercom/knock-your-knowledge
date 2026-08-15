import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: false },
    type: { type: String, enum: ["sales", "promo", "referral"], default: "sales" },
    label: { type: String, default: "" },
    /** Percent off (30 = pay 70%). */
    discountPercent: { type: Number, default: 30, min: 0, max: 100 },
    salesStaffId: { type: mongoose.Schema.Types.ObjectId, ref: "SalesStaff", default: null },
    salesStaffName: { type: String, default: "" },
    active: { type: Boolean, default: true },
    maxUses: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

couponSchema.virtual("payFraction").get(function payFraction() {
  return Math.max(0, Math.min(1, 1 - Number(this.discountPercent || 0) / 100));
});

export const Coupon = mongoose.model("Coupon", couponSchema);
