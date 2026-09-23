import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    type: { type: String, default: "session" },
    isRead: { type: Boolean, default: false },
    senderName: { type: String, default: "KYK Admin" },
    trackId: { type: String, default: "" },
    liveClassId: { type: String, default: "" },
    meetLink: { type: String, default: "" },
  },
  { timestamps: true }
);

notificationSchema.index({ userEmail: 1, createdAt: -1 });

export function serializeNotification(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(o._id),
    user_email: o.userEmail,
    title: o.title,
    message: o.message || "",
    type: o.type || "session",
    is_read: Boolean(o.isRead),
    sender_name: o.senderName || "KYK Admin",
    track_id: o.trackId || "",
    live_class_id: o.liveClassId || "",
    meet_link: o.meetLink || "",
    created_date: o.createdAt,
  };
}

export const Notification = mongoose.model("Notification", notificationSchema);
