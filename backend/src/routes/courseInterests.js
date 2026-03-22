import express from "express";
import { z } from "zod";
import { CourseInterest } from "../models/CourseInterest.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(authMiddleware.required);

router.get("/", requireRole("admin", "sales"), async (_req, res, next) => {
  try {
    const rows = await CourseInterest.find({}).sort({ last_viewed: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.get("/mine", async (req, res, next) => {
  try {
    const rows = await CourseInterest.find({ student_email: req.user.email }).sort({ last_viewed: -1 });
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
    }),
  }),
  async (req, res, next) => {
    try {
      let row = await CourseInterest.findOne({
        student_email: req.user.email,
        course_id: req.body.course_id,
      });
      if (row) {
        row.course_title = req.body.course_title || row.course_title;
        row.last_viewed = new Date();
        await row.save();
      } else {
        row = await CourseInterest.create({
          student_email: req.user.email,
          course_id: req.body.course_id,
          course_title: req.body.course_title || "",
          last_viewed: new Date(),
        });
      }
      res.status(201).json(row.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

export default router;
