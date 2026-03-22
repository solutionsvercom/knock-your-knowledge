import mongoose from "mongoose";

const LiveClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    duration_mins: { type: Number, default: 60 },
    class_type: { type: String, default: "lecture" },
    instructor: { type: String, default: "" },
    registered_count: { type: Number, default: 0 },
    max_students: { type: Number, default: 100 },
    is_live: { type: Boolean, default: false },
    is_free: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LiveClassSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const LiveClass = mongoose.model("LiveClass", LiveClassSchema);

