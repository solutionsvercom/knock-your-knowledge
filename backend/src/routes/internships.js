import express from "express";
import { z } from "zod";
import { Internship } from "../models/Internship.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const bodySchema = z.object({
  title: z.string().min(2),
  company: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  work_type: z.string().optional(),
  duration: z.string().optional(),
  stipend: z.string().optional(),
  skills: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  applicants: z.number().optional(),
  openings: z.number().optional(),
  company_logo: z.string().optional(),
});

router.get("/", async (_req, res, next) => {
  try {
    const rows = await Internship.find({}).sort({ createdAt: -1 }).exec();
    if (!Array.isArray(rows)) {
      return next(Object.assign(new Error("Invalid internships result"), { status: 500 }));
    }
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post("/", authMiddleware.required, requireRole("admin"), validate({ body: bodySchema }), async (req, res, next) => {
  try {
    const row = await Internship.create({
      ...req.body,
      ...(req.body.deadline ? { deadline: new Date(req.body.deadline) } : {}),
    });
    res.status(201).json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.put("/:id", authMiddleware.required, requireRole("admin"), async (req, res, next) => {
  try {
    const row = await Internship.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!row) return res.status(404).json({ message: "Internship not found" });
    res.json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authMiddleware.required, requireRole("admin"), async (req, res, next) => {
  try {
    const row = await Internship.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ message: "Internship not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;

