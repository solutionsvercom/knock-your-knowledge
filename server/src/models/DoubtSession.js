import mongoose from "mongoose";

const DoubtSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    course_id: { type: String, required: true, index: true },
    course_title: { type: String, default: "" },
    teacher_name: { type: String, default: "" },
    teacher_email: { type: String, default: "", index: true },
    session_date: { type: Date, required: true },
    meet_link: { type: String, default: "" },
    reminder_minutes: { type: Number, default: 30 },
    status: { type: String, default: "scheduled" },
  },
  { timestamps: true }
);

DoubtSessionSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const DoubtSession = mongoose.model("DoubtSession", DoubtSessionSchema);
