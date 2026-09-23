import { Router } from "express";
import { Notification, serializeNotification } from "../models/Notification.js";

const router = Router();

function requireEmail(req, res) {
  const email = String(req.query.email || req.body?.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    res.status(400).json({ message: "Student email is required." });
    return null;
  }
  return email;
}

/** GET /api/notifications/mine?email= */
router.get("/mine", async (req, res) => {
  try {
    const email = requireEmail(req, res);
    if (!email) return;
    const rows = await Notification.find({ userEmail: email }).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({
      ok: true,
      count: rows.length,
      unread: rows.filter((n) => !n.isRead).length,
      notifications: rows.map(serializeNotification),
    });
  } catch (err) {
    console.error("[API] GET /api/notifications/mine", err);
    return res.status(500).json({ message: "Could not load notifications." });
  }
});

/** PATCH /api/notifications/:id/read?email= */
router.patch("/:id/read", async (req, res) => {
  try {
    const email = requireEmail(req, res);
    if (!email) return;
    const row = await Notification.findOneAndUpdate(
      { _id: req.params.id, userEmail: email },
      { isRead: true },
      { new: true }
    );
    if (!row) return res.status(404).json({ message: "Notification not found." });
    return res.json({ ok: true, notification: serializeNotification(row) });
  } catch (err) {
    return res.status(500).json({ message: "Could not update notification." });
  }
});

/** POST /api/notifications/mark-all-read  { email } */
router.post("/mark-all-read", async (req, res) => {
  try {
    const email = requireEmail(req, res);
    if (!email) return;
    const result = await Notification.updateMany({ userEmail: email, isRead: false }, { isRead: true });
    return res.json({ ok: true, updated: result.modifiedCount || 0 });
  } catch (err) {
    return res.status(500).json({ message: "Could not mark notifications read." });
  }
});

export default router;
