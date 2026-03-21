import express from "express";
import { z } from "zod";
import { enrollmentController } from "../controllers/enrollmentController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(authMiddleware.required);

router.get("/", requireRole("admin"), enrollmentController.listAll);
router.get("/mine", enrollmentController.listMine);
router.post(
  "/",
  validate({ body: z.object({ course_id: z.string().min(1) }) }),
  enrollmentController.enroll
);
router.put(
  "/:id/progress",
  validate({ body: z.object({ progress: z.number().min(0).max(100) }) }),
  enrollmentController.updateProgress
);

export default router;

