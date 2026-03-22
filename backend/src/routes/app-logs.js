import express from "express";

const router = express.Router();

router.post("/log-user-in-app", async (req, res) => {
  // Local stub: keep endpoint for compatibility
  res.json({ ok: true, pageName: req.body?.pageName || null });
});

export default router;

