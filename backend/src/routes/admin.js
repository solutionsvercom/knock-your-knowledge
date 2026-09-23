import { Router } from "express";
import { makeKykCode } from "../utils/codes.js";
import { SalesStaff } from "../models/SalesStaff.js";
import { Coupon } from "../models/Coupon.js";
import { StudentTicket, TICKET_VALUE_INR } from "../models/StudentTicket.js";
import { Enrollment } from "../models/Enrollment.js";
import { PaymentOrder } from "../models/PaymentOrder.js";
import { ContactLead } from "../models/ContactLead.js";
import { LiveClass, serializeLiveClass } from "../models/LiveClass.js";
import { INTERNSHIP_TRACKS, LIVE_CLASS_TYPES, getTrack, dayBounds } from "../config/tracks.js";
import { notifyStudentsForLiveClass } from "../utils/notifyLiveClass.js";

const router = Router();

function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_API_KEY || "kyk-admin-local";
  const key = req.headers["x-admin-key"] || req.query.adminKey;
  if (key !== expected) {
    return res.status(401).json({ message: "Unauthorized admin request." });
  }
  return next();
}

router.use(adminAuth);

function serializeCoupon(c) {
  if (!c) return null;
  const o = c.toObject ? c.toObject() : c;
  const discountPercent = Number(o.discountPercent ?? 30);
  return {
    ...o,
    id: o._id,
    discountPercent,
    payFraction: Math.max(0, Math.min(1, 1 - discountPercent / 100)),
    label: o.label || `${discountPercent}% off`,
  };
}

/** GET /api/admin/overview */
router.get("/overview", async (_req, res) => {
  try {
    const [enrollments, paidOrders, tickets, sales, coupons, leads] = await Promise.all([
      Enrollment.find().sort({ createdAt: -1 }).lean(),
      PaymentOrder.find({ status: "paid" }).sort({ createdAt: -1 }).lean(),
      StudentTicket.find().sort({ createdAt: -1 }).lean(),
      SalesStaff.find().sort({ createdAt: -1 }).lean(),
      Coupon.find().sort({ createdAt: -1 }),
      ContactLead.find().sort({ createdAt: -1 }).limit(50).lean(),
    ]);

    const paymentTotal = paidOrders.reduce((s, p) => s + (p.amountInr || 0), 0);
    const enrollmentTotal = enrollments.reduce((s, e) => s + (e.amountPaid || 0), 0);
    const ticketValueTotal = tickets.reduce((s, t) => s + (t.valueInr || TICKET_VALUE_INR), 0);

    const studentsMap = new Map();
    for (const e of enrollments) {
      const key = e.studentEmail;
      if (!studentsMap.has(key)) {
        studentsMap.set(key, {
          email: e.studentEmail,
          name: e.studentName,
          phone: e.studentPhone,
          courses: [],
          totalPaid: 0,
        });
      }
      const row = studentsMap.get(key);
      row.courses.push(e.itemTitle);
      row.totalPaid += e.amountPaid || 0;
    }

    return res.json({
      ok: true,
      stats: {
        enrolledStudents: studentsMap.size,
        enrollments: enrollments.length,
        paymentTotal: paymentTotal || enrollmentTotal,
        invoices: paidOrders.length || enrollments.length,
        salesStaff: sales.length,
        activeCoupons: coupons.filter((c) => c.active).length,
        tickets: tickets.length,
        ticketWalletValue: ticketValueTotal,
        contactLeads: leads.length,
      },
      recentPayments: paidOrders.slice(0, 10),
      recentEnrollments: enrollments.slice(0, 10),
      students: Array.from(studentsMap.values()),
      contactLeads: leads,
      coupons: coupons.map(serializeCoupon),
    });
  } catch (err) {
    console.error("[API] admin overview", err);
    return res.status(500).json({ message: "Could not load admin overview." });
  }
});

/** Enrollments / students */
router.get("/enrollments", async (_req, res) => {
  try {
    const list = await Enrollment.find().sort({ createdAt: -1 }).lean();
    return res.json({ count: list.length, enrollments: list });
  } catch (err) {
    return res.status(500).json({ message: "Could not load enrollments." });
  }
});

/** Unique students for ticket assignment (from enrollments + paid orders) */
router.get("/students", async (_req, res) => {
  try {
    const [enrollments, paidOrders] = await Promise.all([
      Enrollment.find().sort({ createdAt: -1 }).lean(),
      PaymentOrder.find({ status: "paid" }).sort({ createdAt: -1 }).lean(),
    ]);

    const map = new Map();
    for (const e of enrollments) {
      const email = String(e.studentEmail || "").toLowerCase().trim();
      if (!email) continue;
      if (!map.has(email)) {
        map.set(email, {
          email,
          name: e.studentName || "",
          phone: e.studentPhone || "",
          courses: [],
          source: "enrollment",
        });
      }
      const row = map.get(email);
      if (e.itemTitle && !row.courses.includes(e.itemTitle)) row.courses.push(e.itemTitle);
      if (!row.name && e.studentName) row.name = e.studentName;
      if (!row.phone && e.studentPhone) row.phone = e.studentPhone;
    }

    for (const p of paidOrders) {
      const email = String(p.customer?.email || "").toLowerCase().trim();
      if (!email) continue;
      if (!map.has(email)) {
        map.set(email, {
          email,
          name: p.customer?.name || "",
          phone: p.customer?.contact || "",
          courses: (p.items || []).map((i) => i.title).filter(Boolean),
          source: "payment",
        });
      } else {
        const row = map.get(email);
        if (!row.name && p.customer?.name) row.name = p.customer.name;
        if (!row.phone && p.customer?.contact) row.phone = p.customer.contact;
        for (const title of (p.items || []).map((i) => i.title).filter(Boolean)) {
          if (!row.courses.includes(title)) row.courses.push(title);
        }
      }
    }

    const students = Array.from(map.values()).sort((a, b) =>
      String(a.name || a.email).localeCompare(String(b.name || b.email))
    );
    return res.json({ count: students.length, students });
  } catch (err) {
    console.error("[API] admin students", err);
    return res.status(500).json({ message: "Could not load students." });
  }
});

/** Payments / invoices from Cashfree orders */
router.get("/payments", async (_req, res) => {
  try {
    const list = await PaymentOrder.find().sort({ createdAt: -1 }).lean();
    const paid = list.filter((p) => p.status === "paid");
    const total = paid.reduce((s, p) => s + (p.amountInr || 0), 0);
    return res.json({
      count: list.length,
      paidCount: paid.length,
      totalRevenue: total,
      payments: list.map((p) => ({
        id: p._id,
        invoiceNumber: `INV-${String(p._id).slice(-8).toUpperCase()}`,
        orderId: p.orderId || p.razorpayOrderId,
        paymentId: p.paymentId || p.razorpayPaymentId,
        amountInr: p.amountInr,
        status: p.status,
        coupon: p.coupon,
        customer: p.customer,
        items: p.items,
        provider: p.provider || "cashfree",
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    return res.status(500).json({ message: "Could not load payments." });
  }
});

/** Sales staff */
router.get("/sales", async (_req, res) => {
  try {
    const list = await SalesStaff.find().sort({ createdAt: -1 }).lean();
    return res.json({ count: list.length, sales: list });
  } catch (err) {
    return res.status(500).json({ message: "Could not load sales staff." });
  }
});

router.post("/sales", async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const phone = String(req.body?.phone || "").trim();
    const discountPercent = Number(req.body?.discountPercent ?? 30);
    if (!fullName || !email) {
      return res.status(400).json({ message: "Full name and email are required." });
    }
    const couponCode = makeKykCode(fullName.split(" ")[0] || fullName);
    if (!couponCode) {
      return res.status(400).json({ message: "Could not generate coupon code from name." });
    }

    const existing = await SalesStaff.findOne({ $or: [{ email }, { couponCode }] });
    if (existing) {
      return res.status(400).json({ message: "Sales staff or coupon code already exists." });
    }

    const staff = await SalesStaff.create({
      fullName,
      email,
      phone,
      couponCode,
      discountPercent,
      notes: String(req.body?.notes || ""),
    });

    await Coupon.create({
      code: couponCode,
      type: "sales",
      label: `${discountPercent}% off — ${fullName}`,
      discountPercent,
      salesStaffId: staff._id,
      salesStaffName: fullName,
      active: true,
    });

    return res.status(201).json({ ok: true, sales: staff, couponCode });
  } catch (err) {
    console.error("[API] create sales", err);
    return res.status(500).json({ message: err.message || "Could not create sales staff." });
  }
});

router.patch("/sales/:id", async (req, res) => {
  try {
    const staff = await SalesStaff.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.fullName != null ? { fullName: String(req.body.fullName).trim() } : {}),
        ...(req.body.phone != null ? { phone: String(req.body.phone).trim() } : {}),
        ...(req.body.active != null ? { active: Boolean(req.body.active) } : {}),
        ...(req.body.notes != null ? { notes: String(req.body.notes) } : {}),
        ...(req.body.discountPercent != null
          ? { discountPercent: Number(req.body.discountPercent) }
          : {}),
      },
      { new: true }
    );
    if (!staff) return res.status(404).json({ message: "Sales staff not found." });
    if (req.body.active != null || req.body.discountPercent != null) {
      await Coupon.findOneAndUpdate(
        { code: staff.couponCode },
        {
          active: staff.active,
          discountPercent: staff.discountPercent,
          label: `${staff.discountPercent}% off — ${staff.fullName}`,
        }
      );
    }
    return res.json({ ok: true, sales: staff });
  } catch (err) {
    return res.status(500).json({ message: "Could not update sales staff." });
  }
});

/** Coupons */
router.get("/coupons", async (_req, res) => {
  try {
    const list = await Coupon.find().sort({ createdAt: -1 });
    return res.json({ count: list.length, coupons: list.map(serializeCoupon) });
  } catch (err) {
    return res.status(500).json({ message: "Could not load coupons." });
  }
});

router.post("/coupons", async (req, res) => {
  try {
    const name = String(req.body?.name || req.body?.fullName || "").trim();
    const code = String(req.body?.code || makeKykCode(name) || "").trim();
    const discountPercent = Number(req.body?.discountPercent ?? 30);
    if (!code) return res.status(400).json({ message: "Coupon code or name is required." });

    const exists = await Coupon.findOne({ code });
    if (exists) return res.status(400).json({ message: "Coupon already exists." });

    const coupon = await Coupon.create({
      code,
      type: req.body?.type || "promo",
      label: req.body?.label || `${discountPercent}% off`,
      discountPercent,
      salesStaffName: name || "",
      active: true,
      maxUses: Number(req.body?.maxUses || 0),
    });

    return res.status(201).json({ ok: true, coupon: serializeCoupon(coupon) });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Could not create coupon." });
  }
});

/** Student tickets (1 = ₹500) */
router.get("/tickets", async (_req, res) => {
  try {
    const list = await StudentTicket.find().sort({ createdAt: -1 }).lean();
    const wallet = list.reduce((s, t) => s + (t.valueInr || TICKET_VALUE_INR), 0);
    return res.json({ count: list.length, ticketValueInr: TICKET_VALUE_INR, walletValue: wallet, tickets: list });
  } catch (err) {
    return res.status(500).json({ message: "Could not load tickets." });
  }
});

router.post("/tickets", async (req, res) => {
  try {
    const studentName = String(req.body?.studentName || "").trim();
    const studentEmail = String(req.body?.studentEmail || "").trim().toLowerCase();
    const studentPhone = String(req.body?.studentPhone || "").trim();
    if (!studentName || !studentEmail) {
      return res.status(400).json({ message: "Student name and email are required." });
    }

    let referralCode = makeKykCode(studentName.split(" ")[0] || studentName);
    if (!referralCode) {
      return res.status(400).json({ message: "Could not build referral code." });
    }

    // Ensure unique referral code if duplicate names
    const clash = await StudentTicket.findOne({ referralCode });
    if (clash) {
      referralCode = `${referralCode}${String(Date.now()).slice(-3)}`;
    }

    const ticket = await StudentTicket.create({
      studentName,
      studentEmail,
      studentPhone,
      referralCode,
      valueInr: TICKET_VALUE_INR,
      status: "active",
      notes: String(req.body?.notes || ""),
      raisedBy: String(req.body?.raisedBy || "admin"),
    });

    const discountPercent = Number(req.body?.discountPercent ?? 30);
    const existingCoupon = await Coupon.findOne({ code: referralCode });
    if (!existingCoupon) {
      await Coupon.create({
        code: referralCode,
        type: "referral",
        label: `${discountPercent}% off — referral by ${studentName}`,
        discountPercent,
        salesStaffName: studentName,
        active: true,
      });
    }

    return res.status(201).json({
      ok: true,
      ticket,
      message: `Ticket raised. Referral code ${referralCode} (value ₹${TICKET_VALUE_INR}).`,
    });
  } catch (err) {
    console.error("[API] create ticket", err);
    return res.status(500).json({ message: err.message || "Could not raise ticket." });
  }
});

router.patch("/tickets/:id", async (req, res) => {
  try {
    const ticket = await StudentTicket.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.status != null ? { status: req.body.status } : {}),
        ...(req.body.notes != null ? { notes: String(req.body.notes) } : {}),
        ...(req.body.referralsCount != null ? { referralsCount: Number(req.body.referralsCount) } : {}),
      },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    return res.json({ ok: true, ticket });
  } catch (err) {
    return res.status(500).json({ message: "Could not update ticket." });
  }
});

/** Contact leads from Get Started form */
router.get("/leads", async (_req, res) => {
  try {
    const leads = await ContactLead.find().sort({ createdAt: -1 }).lean();
    return res.json({ count: leads.length, leads });
  } catch (err) {
    return res.status(500).json({ message: "Could not load leads." });
  }
});

/** GET /api/admin/live-classes */
router.get("/live-classes", async (_req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 1);
    const classes = await LiveClass.find({ date: { $gte: since } }).sort({ date: 1 }).lean();
    const { start, end } = dayBounds(new Date());
    const todayByTrack = {};
    for (const track of INTERNSHIP_TRACKS) {
      const todays = classes.find(
        (c) => c.trackId === track.id && c.date >= start && c.date <= end
      );
      todayByTrack[track.id] = todays ? serializeLiveClass(todays) : null;
    }
    return res.json({
      ok: true,
      tracks: INTERNSHIP_TRACKS,
      classTypes: LIVE_CLASS_TYPES,
      todayByTrack,
      classes: classes.map(serializeLiveClass),
    });
  } catch (err) {
    console.error("[API] GET /api/admin/live-classes", err);
    return res.status(500).json({ message: "Could not load live classes." });
  }
});

/** PUT /api/admin/live-classes/:trackId — upsert today's (or chosen day's) class for one internship track */
router.put("/live-classes/:trackId", async (req, res) => {
  try {
    const track = getTrack(req.params.trackId);
    if (!track) {
      return res.status(400).json({ message: "Unknown internship track.", tracks: INTERNSHIP_TRACKS });
    }

    const title = String(req.body?.title || "").trim();
    if (title.length < 3) {
      return res.status(400).json({ message: "Enter a class title (at least 3 characters)." });
    }

    const date = req.body?.date ? new Date(req.body.date) : new Date();
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: "Please set a valid date and time." });
    }

    const classType = LIVE_CLASS_TYPES.includes(req.body?.classType)
      ? req.body.classType
      : "lecture";
    const durationMins = Math.max(15, Math.min(240, Number(req.body?.durationMins) || 60));
    const payload = {
      trackId: track.id,
      trackTitle: track.title,
      title,
      description: String(req.body?.description || "").trim(),
      instructor: String(req.body?.instructor || "KYK Mentor").trim() || "KYK Mentor",
      classType,
      date,
      durationMins,
      meetLink: String(req.body?.meetLink || "").trim(),
      isLive: Boolean(req.body?.isLive),
      isFree: req.body?.isFree !== false,
    };

    const { start, end } = dayBounds(date);
    const existing = await LiveClass.findOne({
      trackId: track.id,
      date: { $gte: start, $lte: end },
    });

    const liveClass = existing
      ? await LiveClass.findByIdAndUpdate(existing._id, payload, { new: true })
      : await LiveClass.create(payload);

    const notified = await notifyStudentsForLiveClass(track, liveClass);

    return res.json({
      ok: true,
      message: existing
        ? `Updated today's ${track.title} class and notified ${notified} student${notified === 1 ? "" : "s"}.`
        : `Saved today's ${track.title} class and notified ${notified} student${notified === 1 ? "" : "s"}.`,
      notified,
      liveClass: serializeLiveClass(liveClass),
    });
  } catch (err) {
    console.error("[API] PUT /api/admin/live-classes/:trackId", err);
    return res.status(500).json({ message: "Could not save the live class." });
  }
});

/** DELETE /api/admin/live-classes/:id */
router.delete("/live-classes/:id", async (req, res) => {
  try {
    const removed = await LiveClass.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Live class not found." });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: "Could not delete live class." });
  }
});

export default router;
