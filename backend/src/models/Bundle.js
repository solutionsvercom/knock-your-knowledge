import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema(
  {
    /** Display name (preferred; falls back to title for legacy docs) */
    name: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    course_ids: { type: [mongoose.Schema.Types.ObjectId], ref: "Course", default: [] },
    status: { type: String, default: "published" },
  },
  { timestamps: true }
);

BundleSchema.pre("save", function (next) {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;
  next();
});

BundleSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    const ids = (ret.course_ids || []).map((v) => String(v));
    ret.course_ids = ids;
    /** API-friendly alias */
    ret.courses = ids;
    ret.name = ret.name || ret.title || "Bundle";
    ret.title = ret.title || ret.name;
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Bundle = mongoose.model("Bundle", BundleSchema);

