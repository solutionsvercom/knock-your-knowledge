import mongoose from "mongoose";

export async function connectDb(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy backend/.env.example to backend/.env");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log("[API] MongoDB connected");
}
