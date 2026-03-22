import bcrypt from "bcryptjs";
import { loadServerEnv } from "../lib/loadServerEnv.js";
import { connectDb } from "../lib/db.js";
import { User } from "../models/User.js";

loadServerEnv();

/** Defaults match local test admin; override via backend/.env in production. */
const email = (process.env.ADMIN_EMAIL || "vinay@gmail.com").trim().toLowerCase();
const fullName = process.env.ADMIN_FULL_NAME || "Vinay";
const password = (process.env.ADMIN_PASSWORD || "12345678").trim();

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be non-empty (set in backend/.env or use script defaults).");
  process.exit(1);
}

if (!process.env.ADMIN_EMAIL?.trim() || !process.env.ADMIN_PASSWORD?.trim()) {
  console.warn(
    "[seed:admin] Using default test credentials. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env for production."
  );
}

try {
  await connectDb();
  console.log("[seed:admin] Connected to MongoDB");

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        full_name: fullName,
        role: "admin",
        password_hash,
      },
      $setOnInsert: { email },
    },
    { new: true, upsert: true }
  );

  console.log(`Admin ready: ${user.email} (${user.role})`);
} catch (e) {
  console.error("[seed:admin] Failed:", e?.message || e);
  console.error(
    "Check: MongoDB is running, MONGODB_URI in backend/.env is correct, and you can write to the database."
  );
  process.exit(1);
}

process.exit(0);
