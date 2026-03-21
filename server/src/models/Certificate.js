import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    student_email: { type: String, required: true, index: true },
    student_name: { type: String, default: "" },
    course_id: { type: String, required: true, index: true },
    course_title: { type: String, default: "" },
    issued_date: { type: String, default: "" },
    certificate_id: { type: String, default: "" },
    instructor: { type: String, default: "" },
  },
  { timestamps: true }
);

CertificateSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Certificate = mongoose.model("Certificate", CertificateSchema);
