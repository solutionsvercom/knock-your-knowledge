import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "Remote" },
    work_type: { type: String, default: "remote" },
    duration: { type: String, default: "3 months" },
    stipend: { type: String, default: "$0" },
    skills: { type: [String], default: [] },
    deadline: { type: Date, default: null },
    applicants: { type: Number, default: 0 },
    openings: { type: Number, default: 1 },
    company_logo: { type: String, default: "" },
  },
  { timestamps: true }
);

InternshipSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Internship = mongoose.model("Internship", InternshipSchema);

