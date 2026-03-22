import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    full_name: { type: String, default: "" },
    role: { type: String, default: "student" },
    password_hash: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    ret.created_date = ret.createdAt;
    ret.updated_date = ret.updatedAt;
    delete ret.password_hash;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model("User", UserSchema);

