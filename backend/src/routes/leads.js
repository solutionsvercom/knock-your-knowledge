import express from "express";
import { z } from "zod";
import { Lead } from "../models/Lead.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const bodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

router.use(authMiddleware.required);

router.get("/", requireRole("admin", "sales"), async (_req, res, next) => {
  try {
    const rows = await Lead.find({}).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRole("admin", "sales"), validate({ body: bodySchema }), async (req, res, next) => {
  try {
    const row = await Lead.create(req.body);
    res.status(201).json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireRole("admin", "sales"), async (req, res, next) => {
  try {
    const row = await Lead.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!row) return res.status(404).json({ message: "Lead not found" });
    res.json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireRole("admin", "sales"), async (req, res, next) => {
  try {
    const row = await Lead.findByIdAndDelete(req.params.id);
    if (!row) return res.status(404).json({ message: "Lead not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
