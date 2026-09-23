import { Router } from "express";
import { LiveClass, serializeLiveClass } from "../models/LiveClass.js";
import { INTERNSHIP_TRACKS } from "../config/tracks.js";

const router = Router();

/** GET /api/live-classes — public schedule used by Live Classes page */
router.get("/", async (_req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 2);
    const classes = await LiveClass.find({ date: { $gte: since } })
      .sort({ date: 1 })
      .limit(80)
      .lean();
    return res.json({
      ok: true,
      tracks: INTERNSHIP_TRACKS,
      classes: classes.map(serializeLiveClass),
    });
  } catch (err) {
    console.error("[API] GET /api/live-classes", err);
    return res.status(500).json({ message: "Could not load live classes." });
  }
});

export default router;
