import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    student_email: { type: String, required: true, index: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    course_title: { type: String, default: "" },
    progress: { type: Number, default: 0 },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ student_email: 1, course_id: 1 }, { unique: true });

EnrollmentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.course_id = String(ret.course_id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

