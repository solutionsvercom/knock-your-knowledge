import mongoose from "mongoose";

const salesStaffSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, default: "", trim: true },
    couponCode: { type: String, required: true, unique: true },
    discountPercent: { type: Number, default: 30 },
    active: { type: Boolean, default: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SalesStaff = mongoose.model("SalesStaff", salesStaffSchema);
