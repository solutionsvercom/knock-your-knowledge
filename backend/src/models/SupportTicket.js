import mongoose from "mongoose";

const SupportTicketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    message: { type: String, default: "" },
    category: { type: String, default: "general" },
    status: { type: String, default: "open" },
    priority: { type: String, default: "normal" },
    student_email: { type: String, default: "" },
    student_name: { type: String, default: "" },
    assigned_to: { type: String, default: "" },
    resolution: { type: String, default: "" },
  },
  { timestamps: true }
);

SupportTicketSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    ret.description = ret.message;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const SupportTicket = mongoose.model("SupportTicket", SupportTicketSchema);

