import express from "express";
import { z } from "zod";
import { Resource } from "../models/Resource.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const resourceBody = z.object({
  course_id: z.string().min(1),
  title: z.string().min(1),
  file_url: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const course_id = req.query.course_id;
    if (!course_id) return res.status(400).json({ message: "course_id query required" });
    const rows = await Resource.find({ course_id: String(course_id) }).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  authMiddleware.required,
  requireRole("admin", "teacher"),
  validate({ body: resourceBody }),
  async (req, res, next) => {
    try {
      const row = await Resource.create(req.body);
      res.status(201).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

router.delete("/:id", authMiddleware.required, requireRole("admin", "teacher"), async (req, res, next) => {
  try {
    const row = await Resource.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ message: "Resource not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
