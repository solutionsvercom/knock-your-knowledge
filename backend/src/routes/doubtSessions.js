import express from "express";
import { z } from "zod";
import { DoubtSession } from "../models/DoubtSession.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const sessionBody = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  course_id: z.string().min(1),
  course_title: z.string().optional(),
  teacher_name: z.string().optional(),
  teacher_email: z.string().optional(),
  session_date: z.string().or(z.date()),
  meet_link: z.string().optional(),
  reminder_minutes: z.number().optional(),
  status: z.string().optional(),
});

router.use(authMiddleware.required);

router.get("/", async (req, res, next) => {
  try {
    const { teacher_email } = req.query;
    const filter = teacher_email ? { teacher_email: String(teacher_email) } : {};
    const rows = await DoubtSession.find(filter).sort({ session_date: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRole("admin", "teacher"), validate({ body: sessionBody }), async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      session_date: new Date(req.body.session_date),
      teacher_email: req.body.teacher_email || req.user.email,
      teacher_name: req.body.teacher_name || req.user.full_name,
    };
    const row = await DoubtSession.create(data);
    res.status(201).json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireRole("admin", "teacher"), async (req, res, next) => {
  try {
    const existing = await DoubtSession.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Session not found" });
    if (req.user.role === "teacher" && existing.teacher_email !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const patch = { ...req.body };
    if (patch.session_date) patch.session_date = new Date(patch.session_date);
    const row = await DoubtSession.findByIdAndUpdate(req.params.id, { $set: patch }, { new: true });
    res.json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireRole("admin", "teacher"), async (req, res, next) => {
  try {
    const existing = await DoubtSession.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Session not found" });
    if (req.user.role === "teacher" && existing.teacher_email !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await DoubtSession.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
