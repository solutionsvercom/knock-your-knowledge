import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    full_name: { type: String, default: "" },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "sales", "admin", "user"],
      default: "student",
    },
    sessionToken: { type: String, default: null, index: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
