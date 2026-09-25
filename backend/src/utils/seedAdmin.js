import { User } from "../models/User.js";
import { hashPassword } from "./password.js";

export async function seedDefaultAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "vinay@gmail.com").trim().toLowerCase();
  const explicitPassword = String(process.env.ADMIN_PASSWORD || "").trim();
  if (!email.includes("@")) return;

  const existing = await User.findOne({ email });
  if (existing) {
    let changed = false;
    if (existing.role !== "admin") {
      existing.role = "admin";
      changed = true;
    }
    if (explicitPassword) {
      existing.passwordHash = hashPassword(explicitPassword);
      existing.sessionToken = null;
      changed = true;
      console.log("[API] Admin password updated from ADMIN_PASSWORD");
    }
    if (changed) await existing.save();
    return;
  }

  await User.create({
    email,
    full_name: "Vinay Admin",
    passwordHash: hashPassword(explicitPassword || "12345678"),
    role: "admin",
  });
  console.log("[API] Seeded admin account", email);
}
