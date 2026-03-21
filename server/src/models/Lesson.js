import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    course_id: { type: String, required: true, index: true },
    course_title: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    module_order: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    video_url: { type: String, default: "" },
    duration_mins: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LessonSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Lesson = mongoose.model("Lesson", LessonSchema);
