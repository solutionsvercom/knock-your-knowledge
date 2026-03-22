import express from "express";
import { z } from "zod";
import { Certificate } from "../models/Certificate.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(authMiddleware.required);

router.get("/mine", async (req, res, next) => {
  try {
    const rows = await Certificate.find({ student_email: req.user.email }).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  validate({
    body: z.object({
      course_id: z.string().min(1),
      course_title: z.string().optional(),
      student_name: z.string().optional(),
      issued_date: z.string().optional(),
      certificate_id: z.string().optional(),
      instructor: z.string().optional(),
    }),
  }),
  async (req, res, next) => {
    try {
      const row = await Certificate.create({
        ...req.body,
        student_email: req.user.email,
        student_name: req.body.student_name || req.user.full_name || "",
      });
      res.status(201).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

export default router;
