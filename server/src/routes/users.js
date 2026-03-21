import express from "express";
import { User } from "../models/User.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireRole("admin"), async (_req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users.map((u) => u.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post("/invite", requireRole("admin"), async (req, res, next) => {
  try {
    const { email, role } = req.body || {};
    if (!email) {
      const err = new Error("Email is required");
      err.status = 400;
      throw err;
    }
    const normalized = String(email).trim().toLowerCase();
    const user = await User.findOneAndUpdate(
      { email: normalized },
      { $setOnInsert: { email: normalized }, $set: { role: role || "user" } },
      { new: true, upsert: true }
    );
    res.json({ ok: true, user: user.toJSON() });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireRole("admin"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireRole("admin"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, role, email } = req.body || {};
    const update = {};
    if (full_name !== undefined) update.full_name = full_name;
    if (role !== undefined) update.role = role;
    if (email !== undefined) update.email = String(email).trim().toLowerCase();
    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    res.json(user.toJSON());
  } catch (e) {
    next(e);
  }
});

export default router;

