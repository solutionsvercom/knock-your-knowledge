import { Router } from "express";
import { cloudinaryCloudName, cloudinaryConfigured } from "../utils/cloudinary.js";

const router = Router();

/** Public: cloud name only, so the frontend can build video URLs after Hostinger env is set. */
router.get("/status", (_req, res) => {
  const cloudName = cloudinaryCloudName();
  return res.json({
    ok: true,
    ready: Boolean(cloudName),
    cloudName,
    uploadReady: cloudinaryConfigured(),
  });
});

export default router;
