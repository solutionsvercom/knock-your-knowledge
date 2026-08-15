import { Router } from "express";
import { Coupon } from "../models/Coupon.js";

const router = Router();

const STATIC = {
  kyk123: {
    code: "kyk123",
    payFraction: 0.7,
    discountPercent: 30,
    label: "30% off — pay 70% of original price",
  },
};

/** GET /api/coupons/:code — public lookup for checkout */
router.get("/:code", async (req, res) => {
  try {
    const key = String(req.params.code || "").trim();
    const lower = key.toLowerCase();

    if (STATIC[lower]) {
      return res.json({ ok: true, coupon: STATIC[lower] });
    }

    const doc = await Coupon.findOne({
      code: { $regex: new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      active: true,
    });

    if (!doc) {
      return res.status(404).json({ ok: false, message: "Invalid coupon code." });
    }

    if (doc.maxUses > 0 && doc.usedCount >= doc.maxUses) {
      return res.status(400).json({ ok: false, message: "Coupon usage limit reached." });
    }

    const discountPercent = Number(doc.discountPercent ?? 30);
    return res.json({
      ok: true,
      coupon: {
        code: doc.code,
        payFraction: Math.max(0, Math.min(1, 1 - discountPercent / 100)),
        discountPercent,
        label: doc.label || `${discountPercent}% off`,
        type: doc.type,
        salesStaffName: doc.salesStaffName || "",
      },
    });
  } catch (err) {
    console.error("[API] coupon lookup", err);
    return res.status(500).json({ message: "Could not validate coupon." });
  }
});

export default router;
