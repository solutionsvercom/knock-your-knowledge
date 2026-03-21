import express from "express";
import { z } from "zod";
import { courseController } from "../controllers/courseController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const videoBody = z.object({
  title: z.string().optional(),
  url: z.string().min(1),
  duration_min: z.number().nonnegative().optional(),
  order: z.number().optional(),
});

const courseBody = z.object({
  title: z.string().min(2),
  category: z.string().optional(),
  level: z.string().optional(),
  instructor: z.string().optional(),
  price: z.number().nonnegative().optional(),
  original_price: z.number().nonnegative().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  duration_hours: z.number().nonnegative().optional(),
  language: z.string().optional(),
  has_certificate: z.boolean().optional(),
  thumbnail: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  videos: z.array(videoBody).optional(),
  modules: z.array(z.any()).optional(),
  rating: z.number().nonnegative().optional(),
  reviews_count: z.number().nonnegative().optional(),
  students_count: z.number().nonnegative().optional(),
  lessons_count: z.number().nonnegative().optional(),
  status: z.string().optional(),
});

/** Zod 4: avoid `.partial()` on objects with nested `.min()` checks (e.g. videos[].url) */
const courseUpdateBody = z.object({
  title: z.string().min(2).optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  instructor: z.string().optional(),
  price: z.number().nonnegative().optional(),
  original_price: z.number().nonnegative().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  duration_hours: z.number().nonnegative().optional(),
  language: z.string().optional(),
  has_certificate: z.boolean().optional(),
  thumbnail: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  videos: z.array(videoBody).optional(),
  modules: z.array(z.any()).optional(),
  rating: z.number().nonnegative().optional(),
  reviews_count: z.number().nonnegative().optional(),
  students_count: z.number().nonnegative().optional(),
  lessons_count: z.number().nonnegative().optional(),
  status: z.string().optional(),
});

router.get("/", courseController.list);
router.get("/:id", courseController.getById);

router.post(
  "/",
  authMiddleware.required,
  requireRole("admin"),
  validate({ body: courseBody }),
  courseController.create
);
router.put(
  "/:id",
  authMiddleware.required,
  requireRole("admin"),
  validate({ body: courseUpdateBody }),
  courseController.update
);
router.delete("/:id", authMiddleware.required, requireRole("admin"), courseController.remove);

export default router;

