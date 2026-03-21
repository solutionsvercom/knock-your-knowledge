import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient_email: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    type: { type: String, default: "system" },
    sender_name: { type: String, default: "" },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Notification = mongoose.model("Notification", NotificationSchema);

