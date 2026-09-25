import { Router } from "express";
import { User } from "../models/User.js";
import { Enrollment } from "../models/Enrollment.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { issueSession, serializeUser, findUserByToken } from "../utils/ensureStudent.js";

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
