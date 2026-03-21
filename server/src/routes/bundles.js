import express from "express";
import { z } from "zod";
import { bundleController } from "../controllers/bundleController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const bundleFields = z.object({
  name: z.string().min(2).optional(),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  courses: z.array(z.string()).optional(),
  course_ids: z.array(z.string()).optional(),
  status: z.string().optional(),
});

const bundleCreateSchema = bundleFields.refine(
  (d) =>
    (typeof d.name === "string" && d.name.length >= 2) ||
    (typeof d.title === "string" && d.title.length >= 2),
  { message: "Provide name or title (min 2 chars)" }
);

/** Zod 4: cannot use .partial() on objects whose fields use .min() etc. — bundleFields is already all-optional */
const bundleUpdateBody = bundleFields.refine(
  (d) => {
    if (d.name === undefined && d.title === undefined) return true;
    const okName = d.name != null && String(d.name).length >= 2;
    const okTitle = d.title != null && String(d.title).length >= 2;
    return okName || okTitle;
  },
  { message: "name or title must be at least 2 characters when provided" }
);

router.get("/", bundleController.list);
router.get("/:id", bundleController.getById);
router.post(
  "/",
  authMiddleware.required,
  requireRole("admin"),
  validate({ body: bundleCreateSchema }),
  bundleController.create
);
router.put(
  "/:id",
  authMiddleware.required,
  requireRole("admin"),
  validate({ body: bundleUpdateBody }),
  bundleController.update
);
router.delete("/:id", authMiddleware.required, requireRole("admin"), bundleController.remove);

export default router;
