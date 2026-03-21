import express from "express";
import { z } from "zod";
import { SupportTicket } from "../models/SupportTicket.js";
import { TicketReply } from "../models/TicketReply.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const ticketBody = z.object({
  subject: z.string().min(2),
  message: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  student_email: z.string().email().optional(),
  student_name: z.string().optional(),
});

router.use(authMiddleware.required);

router.get("/", requireRole("admin", "sales", "teacher"), async (_req, res, next) => {
  try {
    const rows = await SupportTicket.find({}).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.get("/mine", async (req, res, next) => {
  try {
    const rows = await SupportTicket.find({ student_email: req.user.email }).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post("/", validate({ body: ticketBody }), async (req, res, next) => {
  try {
    const isSalesOrAdmin = ["admin", "sales"].includes(req.user.role);
    const student_email =
      isSalesOrAdmin && req.body.student_email ? req.body.student_email : req.user.email;
    const message = req.body.message || req.body.description || "";
    const row = await SupportTicket.create({
      subject: req.body.subject,
      message,
      category: req.body.category,
      priority: req.body.priority,
      student_email,
      student_name: req.body.student_name || "",
      status: "open",
    });
    res.status(201).json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const existing = await SupportTicket.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Ticket not found" });
    const isOwner = existing.student_email === req.user.email;
    const isStaff = ["admin", "sales", "teacher"].includes(req.user.role);
    if (!isOwner && !isStaff) return res.status(403).json({ message: "Forbidden" });
    const updated = await SupportTicket.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updated.toJSON());
  } catch (e) {
    next(e);
  }
});

router.get("/replies", async (req, res, next) => {
  try {
    const ticket_id = req.query.ticket_id;
    const rows = await TicketReply.find(ticket_id ? { ticket_id } : {}).sort({ createdAt: -1 });
    res.json(rows.map((r) => r.toJSON()));
  } catch (e) {
    next(e);
  }
});

router.post("/replies", async (req, res, next) => {
  try {
    const { ticket_id, message } = req.body || {};
    if (!ticket_id || !message) return res.status(400).json({ message: "ticket_id and message required" });
    const row = await TicketReply.create({
      ticket_id,
      message,
      author_email: req.user.email,
      author_role: req.user.role || "student",
      sender_name: req.user.full_name || req.user.email || "",
    });
    res.status(201).json(row.toJSON());
  } catch (e) {
    next(e);
  }
});

export default router;

