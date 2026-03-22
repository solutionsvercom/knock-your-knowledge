import express from "express";
import { z } from "zod";
import { Lesson } from "../models/Lesson.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const lessonBody = z.object({
  course_id: z.string().min(1),
  course_title: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  module_order: z.number().optional(),
  order: z.number().optional(),
  video_url: z.string().optional(),
  duration_mins: z.number().optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const course_id = req.query.course_id;
    if (!course_id) return res.status(400).json({ message: "course_id query required" });
    const rows = await Lesson.find({ course_id: String(course_id) }).sort({ module_order: 1, order: 1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  authMiddleware.required,
  requireRole("admin", "teacher"),
  validate({ body: lessonBody }),
  async (req, res, next) => {
    try {
      const row = await Lesson.create(req.body);
      res.status(201).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

router.put("/:id", authMiddleware.required, requireRole("admin", "teacher"), async (req, res, next) => {
  try {
    const row = await Lesson.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!row) return res.status(404).json({ message: "Lesson not found" });
    res.json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authMiddleware.required, requireRole("admin", "teacher"), async (req, res, next) => {
  try {
    const row = await Lesson.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ message: "Lesson not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
