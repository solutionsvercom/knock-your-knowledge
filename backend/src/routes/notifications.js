import express from "express";
import { z } from "zod";
import { Notification } from "../models/Notification.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(authMiddleware.required);

router.get("/mine", async (req, res, next) => {
  try {
    const rows = await Notification.find({ recipient_email: req.user.email }).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const row = await Notification.findById(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    if (row.recipient_email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    row.is_read = true;
    await row.save();
    res.json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.patch("/read-all", async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient_email: req.user.email, is_read: false }, { $set: { is_read: true } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  requireRole("admin", "teacher", "sales"),
  validate({
    body: z.object({
      recipient_email: z.string().email(),
      title: z.string().min(2),
      message: z.string().optional(),
      type: z.string().optional(),
      sender_name: z.string().optional(),
    }),
  }),
  async (req, res, next) => {
    try {
      const row = await Notification.create(req.body);
      res.status(201).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

export default router;

