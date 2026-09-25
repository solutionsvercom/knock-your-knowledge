import { Router } from "express";
import { User } from "../models/User.js";
import { Enrollment } from "../models/Enrollment.js";
import { hashPassword, hashResetToken, makeResetToken, verifyPassword } from "../utils/password.js";
import { issueSession, serializeUser, findUserByToken } from "../utils/ensureStudent.js";
import { smtpConfigured } from "../utils/mailer.js";
import { sendPasswordResetEmail } from "../utils/resetEmail.js";
import { LIVE_SITE_URL } from "../config/site.js";

const router = Router();

function readToken(req) {
  const header = String(req.headers.authorization || "");
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  return String(req.headers["x-auth-token"] || "").trim();
}

async function requireAuth(req, res, next) {
  const user = await findUserByToken(readToken(req));
  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  req.user = user;
  return next();
}

function resetPageBase(req) {
  const origin = String(req.headers.origin || "").trim().replace(/\/$/, "");
  if (origin && /knockyourknowledge\.com|localhost|127\.0\.0\.1/i.test(origin)) {
    return origin;
  }
  const first = String(process.env.FRONTEND_URL || "")
    .split(",")[0]
    .trim()
    .replace(/\/$/, "");
  if (first) return first;
  return LIVE_SITE_URL;
}

const GENERIC_RESET_MSG =
  "If that email is registered, we sent a password reset link. Check your inbox and spam folder.";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRole(role) {
  const r = String(role || "student").toLowerCase();
  if (r === "user") return "student";
  if (["student", "teacher", "sales", "admin"].includes(r)) return r;
  return "student";
}

router.post("/signup", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const full_name = String(req.body?.full_name || "").trim();
    const phone = String(req.body?.phone || "").replace(/\D/g, "").slice(-10);

    if (!email.includes("@") || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (password.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      email,
      full_name: full_name || email.split("@")[0],
      phone: phone.length === 10 ? phone : "",
      passwordHash: hashPassword(password),
      role: "student",
    });
    const token = await issueSession(user);
    return res.status(201).json({ ok: true, token, user: serializeUser(user) });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }
    console.error("[API] POST /api/auth/signup", err);
    return res.status(500).json({ message: "Could not create account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    if (!email.includes("@") || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      const paid = await Enrollment.findOne({ studentEmail: email });
      if (!user && paid) {
        return res.status(401).json({
          message:
            "Payment is saved for this email, but no login password exists yet. Open Sign up, use this same email, and create a password.",
        });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await issueSession(user);
    return res.json({ ok: true, token, user: serializeUser(user) });
  } catch (err) {
    console.error("[API] POST /api/auth/login", err);
    return res.status(500).json({ message: "Could not sign in." });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Enter the email you use to sign in." });
    }
    if (!smtpConfigured()) {
      return res.status(503).json({
        message: "Password reset email is not configured yet. Please contact KYK support.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ ok: true, message: GENERIC_RESET_MSG });
    }

    const { token, tokenHash } = makeResetToken();
    user.resetTokenHash = tokenHash;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${resetPageBase(req)}/login?mode=reset&token=${encodeURIComponent(token)}`;
    const sent = await sendPasswordResetEmail({
      name: user.full_name,
      email: user.email,
      resetUrl,
    });
    if (!sent?.ok) {
      console.error("[mail] password reset not sent", sent?.reason || sent?.error);
      return res.status(500).json({ message: "Could not send the reset email. Try again in a minute." });
    }

    return res.json({ ok: true, message: GENERIC_RESET_MSG });
  } catch (err) {
    console.error("[API] POST /api/auth/forgot-password", err);
    return res.status(500).json({ message: "Could not start password reset." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const newPassword = String(req.body?.newPassword || "");
    if (!token) {
      return res.status(400).json({ message: "Reset link is missing or invalid." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const tokenHash = hashResetToken(token);
    const user = await User.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired. Request a new one from the login page.",
      });
    }

    user.passwordHash = hashPassword(newPassword);
    user.resetTokenHash = null;
    user.resetTokenExpires = null;
    const sessionToken = await issueSession(user);
    return res.json({ ok: true, token: sessionToken, user: serializeUser(user) });
  } catch (err) {
    console.error("[API] POST /api/auth/reset-password", err);
    return res.status(500).json({ message: "Could not reset password." });
  }
});

router.post("/admin-login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const user = await User.findOne({ email });
    if (
      !user ||
      !verifyPassword(password, user.passwordHash) ||
      (user.role !== "admin" && user.role !== "teacher")
    ) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
    const token = await issueSession(user);
    return res.json({ ok: true, token, user: serializeUser(user) });
  } catch (err) {
    console.error("[API] POST /api/auth/admin-login", err);
    return res.status(500).json({ message: "Could not sign in." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

router.post("/logout", requireAuth, async (req, res) => {
  req.user.sessionToken = null;
  await req.user.save();
  return res.json({ ok: true });
});

router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required." });
    }
    if (!verifyPassword(currentPassword, req.user.passwordHash)) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }
    if (!email && !newPassword) {
      return res.status(400).json({ message: "Enter a new Gmail or a new password." });
    }

    if (email) {
      if (!email.includes("@")) {
        return res.status(400).json({ message: "Enter a valid Gmail / email address." });
      }
      const taken = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (taken) {
        return res.status(400).json({ message: "That email is already used by another account." });
      }
      req.user.email = email;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters." });
      }
      req.user.passwordHash = hashPassword(newPassword);
    }

    const token = await issueSession(req.user);
    return res.json({ ok: true, token, user: serializeUser(req.user) });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "That email is already used by another account." });
    }
    console.error("[API] POST /api/auth/change-password", err);
    return res.status(500).json({ message: "Could not update login details." });
  }
});

router.get("/users", requireAuth, async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return res.json(users.map((u) => serializeUser(u)));
});

router.patch("/users/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.body?.role) user.role = normalizeRole(req.body.role);
    if (req.body?.full_name) user.full_name = String(req.body.full_name).trim();
    await user.save();
    return res.json(serializeUser(user));
  } catch (err) {
    console.error("[API] PATCH /api/auth/users", err);
    return res.status(500).json({ message: "Could not update user." });
  }
});

router.delete("/users/:id", requireAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[API] DELETE /api/auth/users", err);
    return res.status(500).json({ message: "Could not delete user." });
  }
});

router.post("/invite", requireAuth, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const role = normalizeRole(req.body?.role);
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Email is required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    const user = await User.create({
      email,
      full_name: email.split("@")[0],
      passwordHash: hashPassword("changeme"),
      role,
    });
    return res.status(201).json(serializeUser(user));
  } catch (err) {
    console.error("[API] POST /api/auth/invite", err);
    return res.status(500).json({ message: "Could not invite user." });
  }
});

export default router;
