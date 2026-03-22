import express from "express";
import { z } from "zod";
import { paymentController } from "../controllers/paymentController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(authMiddleware.required);

router.get("/", requireRole("admin"), paymentController.listAll);
router.get("/mine", paymentController.listMine);
router.patch(
  "/:id",
  requireRole("admin"),
  validate({ body: z.object({ status: z.string().min(1) }) }),
  paymentController.updateStatus
);
router.post(
  "/course",
  validate({ body: z.object({ course_id: z.string().min(1), amount: z.number().nonnegative().optional() }) }),
  paymentController.createCoursePayment
);
router.post(
  "/bundle",
  validate({ body: z.object({ bundle_id: z.string().min(1) }) }),
  paymentController.createBundlePurchase
);

export default router;

