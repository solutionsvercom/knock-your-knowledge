import express from "express";
import { z } from "zod";
import { AIConversation } from "../models/AIConversation.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(authMiddleware.required);

router.get("/mine", async (req, res, next) => {
  try {
    const rows = await AIConversation.find({ student_email: req.user.email }).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.get("/", requireRole("admin", "teacher"), async (_req, res, next) => {
  try {
    const rows = await AIConversation.find({}).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  validate({
    body: z.object({
      course_id: z.string().optional(),
      course_title: z.string().optional(),
      lesson_title: z.string().optional(),
      summary: z.string().optional(),
      messages: z.array(z.any()).optional(),
    }),
  }),
  async (req, res, next) => {
    try {
      const row = await AIConversation.create({
        ...req.body,
        student_email: req.user.email,
      });
      res.status(201).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

export default router;

