import mongoose from "mongoose";

const CourseInterestSchema = new mongoose.Schema(
  {
    student_email: { type: String, required: true, index: true },
    course_id: { type: String, required: true, index: true },
    course_title: { type: String, default: "" },
    last_viewed: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

CourseInterestSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CourseInterest = mongoose.model("CourseInterest", CourseInterestSchema);
