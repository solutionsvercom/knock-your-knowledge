import mongoose from "mongoose";

const AIConversationSchema = new mongoose.Schema(
  {
    student_email: { type: String, required: true, index: true },
    course_id: { type: String, default: "" },
    course_title: { type: String, default: "" },
    lesson_title: { type: String, default: "" },
    summary: { type: String, default: "" },
    messages: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

AIConversationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const AIConversation = mongoose.model("AIConversation", AIConversationSchema);

