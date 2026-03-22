import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signToken } from "../lib/jwt.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use((req, _res, next) => {
  console.log("Auth route hit:", req.originalUrl);
  next();
});

const signupBody = z.object({
  email: z.string().email(),
  full_name: z.string().max(120).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

async function signupHandler(req, res, next) {
  try {
    const { email, full_name, password } = req.body || {};
    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.status = 400;
      throw err;
    }
    const normalized = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalized });
    if (existing) {
      const err = new Error("An account with this email already exists");
      err.status = 409;
      throw err;
    }

    const password_hash = await bcrypt.hash(String(password), 10);
    const fn = (full_name && String(full_name).trim()) || normalized.split("@")[0];
    const user = await User.create({
      email: normalized,
      full_name: fn,
      role: "student",
      password_hash,
    });

    const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
    res.status(201).json({
      ok: true,
      token,
      user: user.toJSON(),
    });
  } catch (e) {
    next(e);
  }
}

async function loginHandler(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.status = 400;
      throw err;
    }
    const normalized = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalized });
    if (!user) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    // Legacy / invited users: set password on first successful login attempt
    if (!user.password_hash) {
      user.password_hash = await bcrypt.hash(String(password), 10);
      await user.save();
    }

    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) {
      const err = new Error("Invalid email or password");
      err.status = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
    res.json({
      ok: true,
      token,
      user: user.toJSON(),
    });
  } catch (e) {
    next(e);
  }
}

router.post("/signup", validate({ body: signupBody }), signupHandler);
router.post("/register", validate({ body: signupBody }), signupHandler);
router.post("/login", validate({ body: loginBody }), loginHandler);
router.post("/admin/login", validate({ body: loginBody }), loginHandler);

router.get("/me", authMiddleware.required, async (req, res) => {
  res.json(req.user);
});

export default router;
