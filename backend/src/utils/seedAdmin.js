import { User } from "../models/User.js";
import { hashPassword } from "./password.js";

export async function seedDefaultAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "vinay@gmail.com").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "12345678");
  if (!email.includes("@") || !password) return;

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return;
  }

  await User.create({
    email,
    full_name: "Vinay Admin",
    passwordHash: hashPassword(password),
    role: "admin",
  });
  console.log("[API] Seeded admin account", email);
}
