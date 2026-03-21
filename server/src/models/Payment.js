import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    student_email: { type: String, required: true, index: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    amount: { type: Number, required: true, default: 0 },
    status: { type: String, default: "completed" },
  },
  { timestamps: true }
);

PaymentSchema.set("toJSON", {
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

export const Payment = mongoose.model("Payment", PaymentSchema);

