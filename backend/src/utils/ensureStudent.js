import { User } from "../models/User.js";
import { generateStudentPassword, hashPassword, newSessionToken, verifyPassword } from "./password.js";

export function serializeUser(user) {
  if (!user) return null;
  const o = user.toObject ? user.toObject() : user;
  const role = o.role === "user" ? "student" : o.role || "student";
  return {
    id: String(o._id),
    email: o.email,
    full_name: o.full_name || "",
    phone: o.phone || "",
    role,
    created_date: o.createdAt || o.created_date || new Date().toISOString(),
  };
}

export async function issueSession(userDoc) {
  userDoc.sessionToken = newSessionToken();
  await userDoc.save();
  return userDoc.sessionToken;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isPlaceholderEmail(email) {
  const e = normalizeEmail(email);
  return !e.includes("@") || e.endsWith("@kyk.local") || e.endsWith("@checkout.local");
}

/**
 * Create or update the Mongo student used for website login.
 * Returns a plaintext password only when it is safe to email (new account, or the
 * password they just typed matches the stored hash).
 */
export async function ensureStudentAccount({ email, name, phone, password } = {}) {
  const e = normalizeEmail(email);
  if (isPlaceholderEmail(e)) {
    return { user: null, passwordForEmail: "", created: false };
  }

  let user = await User.findOne({ email: e });
  const incoming = String(password || "").trim().slice(0, 80);
  let passwordForEmail = "";
  let created = false;

  if (!user) {
    passwordForEmail = incoming || generateStudentPassword();
    user = await User.create({
      email: e,
      full_name: String(name || "").trim() || e.split("@")[0],
      phone: String(phone || "").replace(/\D/g, "").slice(-10),
      passwordHash: hashPassword(passwordForEmail),
      role: "student",
    });
    created = true;
  } else {
    if (incoming && verifyPassword(incoming, user.passwordHash)) {
      passwordForEmail = incoming;
    } else if (incoming && !user.passwordHash) {
      user.passwordHash = hashPassword(incoming);
      passwordForEmail = incoming;
    }

    if (name && !user.full_name) user.full_name = String(name).trim();
    const digits = String(phone || "").replace(/\D/g, "").slice(-10);
    if (digits.length === 10 && !user.phone) user.phone = digits;
    await user.save();
  }

  return { user, passwordForEmail, created };
}

export async function findUserByToken(token) {
  const t = String(token || "").trim();
  if (!t) return null;
  return User.findOne({ sessionToken: t });
}
