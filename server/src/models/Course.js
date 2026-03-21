import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    url: { type: String, required: true },
    duration_min: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "general" },
    level: { type: String, default: "beginner" },
    instructor: { type: String, default: "" },
    price: { type: Number, default: 0 },
    original_price: { type: Number, default: 0 },
    short_description: { type: String, default: "" },
    description: { type: String, default: "" },
    duration_hours: { type: Number, default: 0 },
    language: { type: String, default: "English" },
    has_certificate: { type: Boolean, default: false },
    /** Primary promo image (alias supported: image) */
    thumbnail: { type: String, default: "" },
    image: { type: String, default: "" },
    /** Ordered video lessons / previews */
    videos: { type: [VideoSchema], default: [] },
    tags: { type: [String], default: [] },
    modules: { type: [mongoose.Schema.Types.Mixed], default: [] },
    rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    students_count: { type: Number, default: 0 },
    lessons_count: { type: Number, default: 0 },
    status: { type: String, default: "published" },
  },
  { timestamps: true }
);

CourseSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    if (!ret.thumbnail && ret.image) ret.thumbnail = ret.image;
    if (!ret.image && ret.thumbnail) ret.image = ret.thumbnail;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Course = mongoose.model("Course", CourseSchema);

