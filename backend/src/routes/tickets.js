import { Router } from "express";
import { StudentTicket, TICKET_VALUE_INR } from "../models/StudentTicket.js";

const router = Router();

/**
 * GET /api/tickets/mine?email=
 * Student dashboard: tickets raised by admin for this email.
 */
router.get("/mine", async (req, res) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Student email is required." });
    }

    const tickets = await StudentTicket.find({ studentEmail: email })
      .sort({ createdAt: -1 })
      .lean();

    const walletValue = tickets.reduce((s, t) => s + (t.valueInr || TICKET_VALUE_INR), 0);

    return res.json({
      ok: true,
      ticketValueInr: TICKET_VALUE_INR,
      walletValue,
      count: tickets.length,
      tickets: tickets.map((t) => ({
        id: t._id,
        studentName: t.studentName,
        studentEmail: t.studentEmail,
        referralCode: t.referralCode,
        valueInr: t.valueInr || TICKET_VALUE_INR,
        status: t.status,
        notes: t.notes || "",
        raisedBy: t.raisedBy || "admin",
        referralsCount: t.referralsCount || 0,
        createdAt: t.createdAt,
      })),
    });
  } catch (err) {
    console.error("[API] GET /api/tickets/mine", err);
    return res.status(500).json({ message: "Could not load your tickets." });
  }
});

export default router;
