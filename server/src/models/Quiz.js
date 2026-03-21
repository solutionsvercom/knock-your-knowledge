import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    course_id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

QuizSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Quiz = mongoose.model("Quiz", QuizSchema);
