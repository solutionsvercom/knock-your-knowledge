import mongoose from "mongoose";
import { INTERNSHIP_TRACKS, LIVE_CLASS_TYPES } from "../config/tracks.js";

const liveClassSchema = new mongoose.Schema(
  {
    trackId: {
      type: String,
      required: true,
      enum: INTERNSHIP_TRACKS.map((t) => t.id),
      index: true,
    },
    trackTitle: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    instructor: { type: String, default: "KYK Mentor" },
    classType: {
      type: String,
      enum: LIVE_CLASS_TYPES,
      default: "lecture",
    },
    date: { type: Date, required: true, index: true },
    durationMins: { type: Number, default: 60 },
    meetLink: { type: String, default: "" },
    isLive: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    maxStudents: { type: Number, default: 120 },
    registeredCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

liveClassSchema.index({ trackId: 1, date: 1 });

export function serializeLiveClass(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  const date = o.date ? new Date(o.date) : null;
  const durationMins = Number(o.durationMins || 60);
  const end = date ? new Date(date.getTime() + durationMins * 60000) : null;
  const now = Date.now();
  const autoLive = Boolean(date && end && now >= date.getTime() && now <= end.getTime());
  return {
    id: String(o._id),
    track_id: o.trackId,
    track_title: o.trackTitle,
    title: o.title,
    description: o.description || "",
    instructor: o.instructor || "KYK Mentor",
    class_type: o.classType || "lecture",
    date: date ? date.toISOString() : null,
    duration_mins: durationMins,
    meet_link: o.meetLink || "",
    is_live: Boolean(o.isLive) || autoLive,
    is_free: o.isFree !== false,
    max_students: o.maxStudents || 120,
    registered_count: o.registeredCount || 0,
    live_students: o.registeredCount || 0,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

export const LiveClass = mongoose.model("LiveClass", liveClassSchema);
