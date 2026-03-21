import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    status: { type: String, default: "cold" },
    source: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

LeadSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Lead = mongoose.model("Lead", LeadSchema);
