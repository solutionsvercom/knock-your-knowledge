import express from "express";
import { z } from "zod";
import { LiveClass } from "../models/LiveClass.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const liveClassBody = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  date: z.string().or(z.date()),
  duration_mins: z.number().optional(),
  class_type: z.string().optional(),
  instructor: z.string().optional(),
  registered_count: z.number().optional(),
  max_students: z.number().optional(),
  is_live: z.boolean().optional(),
  is_free: z.boolean().optional(),
});

router.get("/", async (_req, res, next) => {
  try {
    const rows = await LiveClass.find({}).sort({ date: 1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  authMiddleware.required,
  requireRole("admin", "teacher"),
  validate({ body: liveClassBody }),
  async (req, res, next) => {
    try {
      const row = await LiveClass.create({ ...req.body, date: new Date(req.body.date) });
      res.status(201).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

router.put("/:id", authMiddleware.required, requireRole("admin", "teacher"), async (req, res, next) => {
  try {
    const row = await LiveClass.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!row) return res.status(404).json({ message: "Live class not found" });
    res.json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authMiddleware.required, requireRole("admin", "teacher"), async (req, res, next) => {
  try {
    const row = await LiveClass.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ message: "Live class not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;

