import { Router } from "express";
import { ContactLead, INTERNSHIP_OPTIONS } from "../models/ContactLead.js";

const router = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function isValidPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** GET /api/contact/options — internship choices for the form */
router.get("/options", (_req, res) => {
  res.json({ internships: INTERNSHIP_OPTIONS });
});

/** POST /api/contact — save Get Started contact form */
router.post("/", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const phone = String(req.body?.phone || "").trim();
    const internshipInterest = String(req.body?.internshipInterest || "").trim();

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Please enter a valid phone number (10+ digits)." });
    }
    if (!INTERNSHIP_OPTIONS.includes(internshipInterest)) {
      return res.status(400).json({
        message: "Please select an internship program.",
        options: INTERNSHIP_OPTIONS,
      });
    }

    const lead = await ContactLead.create({
      email,
      phone,
      internshipInterest,
      source: String(req.body?.source || "get-started"),
    });

    return res.status(201).json({
      ok: true,
      message: "Thanks! We received your details and will contact you soon.",
      lead: {
        id: lead._id,
        email: lead.email,
        phone: lead.phone,
        internshipInterest: lead.internshipInterest,
        createdAt: lead.createdAt,
      },
    });
  } catch (err) {
    console.error("[API] POST /api/contact", err);
    return res.status(500).json({ message: "Could not save your details. Please try again." });
  }
});

/** GET /api/contact — list submissions (newest first) */
router.get("/", async (_req, res) => {
  try {
    const leads = await ContactLead.find().sort({ createdAt: -1 }).limit(200).lean();
    return res.json({
      count: leads.length,
      leads: leads.map((l) => ({
        id: l._id,
        email: l.email,
        phone: l.phone,
        internshipInterest: l.internshipInterest,
        source: l.source,
        createdAt: l.createdAt,
      })),
    });
  } catch (err) {
    console.error("[API] GET /api/contact", err);
    return res.status(500).json({ message: "Could not load contact submissions." });
  }
});

export default router;
