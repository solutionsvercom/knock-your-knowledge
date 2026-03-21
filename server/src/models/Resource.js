import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    course_id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    file_url: { type: String, default: "" },
    type: { type: String, default: "file" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

ResourceSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Resource = mongoose.model("Resource", ResourceSchema);
