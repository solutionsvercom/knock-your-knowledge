import { Router } from "express";
import { PaymentOrder } from "../models/PaymentOrder.js";
import { Enrollment } from "../models/Enrollment.js";
import { Coupon } from "../models/Coupon.js";
import { cashfreeTwoFactorSignature } from "../utils/cashfreeAuth.js";
import { LIVE_SITE_URL } from "../config/site.js";

const router = Router();
const CF_API_VERSION = process.env.CASHFREE_API_VERSION || "2023-08-01";

function cashfreeBaseUrl() {
  const env = String(process.env.CASHFREE_ENV || "sandbox").toLowerCase();
  return env === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function getCashfreeCreds() {
  const appId = String(
    process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID || ""
  ).trim();
  const secret = String(
    process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_CLIENT_SECRET || ""
  ).trim();
  if (!appId || !secret) {
    const err = new Error(
      "Cashfree is not configured. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in backend/.env"
    );
    err.status = 503;
    throw err;
  }
  return { appId, secret };
}

async function cashfreeFetch(path, { method = "GET", body } = {}) {
  const { appId, secret } = getCashfreeCreds();
  const headers = {
    "Content-Type": "application/json",
    "x-api-version": CF_API_VERSION,
    "x-client-id": appId,
    "x-client-secret": secret,
  };
  const signature = cashfreeTwoFactorSignature(appId);
  if (signature) {
    headers["x-cf-signature"] = signature;
  }
  const res = await fetch(`${cashfreeBaseUrl()}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.message ||
      data?.message_text ||
      (Array.isArray(data?.message) ? data.message.join(", ") : null) ||
      `Cashfree error (${res.status})`;
    const err = new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    err.status = res.status >= 400 && res.status < 600 ? res.status : 502;
    err.details = data;
    throw err;
  }
  return data;
}

function sanitizeCustomerId(email, fallback) {
  const raw = String(email || fallback || `guest_${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 45);
  return raw || `guest_${Date.now()}`;
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return "";
}

function frontendBase() {
  return String(process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")[0]
    .trim()
    .replace(/\/$/, "");
}

/** Cashfree production requires an https return_url on the live domain. */
function cashfreeReturnUrl() {
  const override = String(process.env.CASHFREE_RETURN_URL || "").trim();
  if (override) {
    return override.includes("{order_id}")
      ? override
      : `${override.replace(/\/$/, "")}/Checkout?order_id={order_id}`;
  }
  let base = frontendBase();
  const env = String(process.env.CASHFREE_ENV || "sandbox").toLowerCase();
  if (env === "production") {
    if (!base.startsWith("https://") || /localhost|127\.0\.0\.1/i.test(base)) {
      base = LIVE_SITE_URL;
    }
  }
  return `${base}/Checkout?order_id={order_id}`;
}

async function markPaidAndEnroll(doc, paymentId) {
  if (!doc) return null;
  if (doc.status === "paid") return doc;

  const updated = await PaymentOrder.findByIdAndUpdate(
    doc._id,
    {
      status: "paid",
      paymentId: paymentId || doc.paymentId || null,
    },
    { new: true }
  );

  const items = Array.isArray(updated.items) ? updated.items : [];
  const customer = updated.customer || {};
  const payId = updated.paymentId || paymentId || updated.orderId;

  for (let i = 0; i < Math.max(items.length, 1); i += 1) {
    const item = items[i] || {};
    const invoiceNumber = `INV-${String(updated._id).slice(-6).toUpperCase()}-${i + 1}`;
    const exists = await Enrollment.findOne({
      paymentId: payId,
      itemId: item.id || `item-${i}`,
    });
    if (!exists) {
      await Enrollment.create({
        studentName: customer.name || "",
        studentEmail: customer.email || "unknown@kyk.local",
        studentPhone: customer.contact || "",
        itemType: item.type || "internship",
        itemId: item.id || `item-${i}`,
        itemTitle: item.title || "KYK Program",
        amountPaid: Number(item.payable ?? updated.amountInr) || 0,
        taxableAmount: Number(item.taxable ?? item.original ?? 0) || 0,
        gstAmount: Number(item.gst ?? 0) || 0,
        coupon: updated.coupon || null,
        orderId: updated.orderId,
        paymentId: payId,
        invoiceNumber,
        status: "paid",
      });
    }
  }

  if (updated.coupon) {
    await Coupon.findOneAndUpdate(
      {
        code: {
          $regex: new RegExp(
            `^${String(updated.coupon).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i"
          ),
        },
      },
      { $inc: { usedCount: 1 } }
    );
  }

  return updated;
}

/** Public config for Checkout (never exposes secret). */
router.get("/config", (_req, res) => {
  const appId = String(
    process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID || ""
  ).trim();
  const secret = String(
    process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_CLIENT_SECRET || ""
  ).trim();
  const env = String(process.env.CASHFREE_ENV || "sandbox").toLowerCase();
  const twoFactor =
    Boolean(String(process.env.CASHFREE_PUBLIC_KEY || "").trim()) ||
    Boolean(String(process.env.CASHFREE_PUBLIC_KEY_PATH || "").trim());
  res.json({
    ok: Boolean(appId && secret),
    provider: "cashfree",
    mode: env === "production" ? "production" : "sandbox",
    currency: "INR",
    paymentMethods: "cc,dc,upi",
    twoFactor: twoFactor ? "public_key" : "off",
  });
});

/**
 * POST /api/payments/create-order
 * body: { amountInr, items?, coupon?, customer? }
 */
router.post("/create-order", async (req, res) => {
  try {
    const amountInr = Math.round(Number(req.body?.amountInr) || 0);
    if (!Number.isFinite(amountInr) || amountInr < 1) {
      return res.status(400).json({ message: "Invalid amount. Minimum payable is ₹1." });
    }

    const customer = {
      name: String(req.body?.customer?.name || "").trim() || undefined,
      email: String(req.body?.customer?.email || "").trim() || undefined,
      contact: normalizePhone(req.body?.customer?.contact),
    };

    if (!customer.contact || customer.contact.length !== 10) {
      return res.status(400).json({
        message: "A valid 10-digit mobile number is required for payment.",
      });
    }

    const orderId = `kyk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const returnUrl = cashfreeReturnUrl();

    const cfOrder = await cashfreeFetch("/orders", {
      method: "POST",
      body: {
        order_id: orderId,
        order_amount: amountInr,
        order_currency: "INR",
        customer_details: {
          customer_id: sanitizeCustomerId(customer.email, orderId),
          customer_name: customer.name || "KYK Student",
          customer_email: customer.email || "student@kyk.local",
          customer_phone: customer.contact,
        },
        order_meta: {
          return_url: returnUrl,
          /** Credit card, debit card, and UPI */
          payment_methods: "cc,dc,upi",
        },
        order_note: req.body?.coupon ? `coupon:${req.body.coupon}` : "kyk-checkout",
      },
    });

    const paymentSessionId =
      cfOrder.payment_session_id || cfOrder.payment_sessions_id || null;
    if (!paymentSessionId) {
      return res.status(502).json({ message: "Cashfree did not return a payment session." });
    }

    await PaymentOrder.create({
      provider: "cashfree",
      orderId,
      paymentSessionId,
      amountInr,
      amountPaise: amountInr * 100,
      currency: "INR",
      status: "created",
      coupon: req.body?.coupon || null,
      items: Array.isArray(req.body?.items) ? req.body.items : [],
      customer,
    });

    const env = String(process.env.CASHFREE_ENV || "sandbox").toLowerCase();
    return res.status(201).json({
      ok: true,
      provider: "cashfree",
      orderId,
      paymentSessionId,
      amountInr,
      currency: "INR",
      mode: env === "production" ? "production" : "sandbox",
    });
  } catch (err) {
    console.error("[API] POST /api/payments/create-order", err?.details || err);
    const status = err.status || 500;
    return res.status(status).json({
      message: err.message || "Could not create Cashfree order.",
    });
  }
});

/**
 * POST /api/payments/verify
 * body: { orderId }
 * Confirms order status with Cashfree and creates enrollments when PAID.
 */
router.post("/verify", async (req, res) => {
  try {
    const orderId = String(req.body?.orderId || req.body?.order_id || "").trim();
    if (!orderId) {
      return res.status(400).json({ message: "Missing Cashfree order id." });
    }

    const doc = await PaymentOrder.findOne({ orderId });
    if (!doc) {
      return res.status(404).json({ message: "Payment order not found." });
    }

    if (doc.status === "paid") {
      return res.json({
        ok: true,
        message: "Payment already verified.",
        payment: {
          id: doc._id,
          orderId: doc.orderId,
          paymentId: doc.paymentId,
          amountInr: doc.amountInr,
          coupon: doc.coupon,
          items: doc.items,
          status: doc.status,
        },
      });
    }

    const cfOrder = await cashfreeFetch(`/orders/${encodeURIComponent(orderId)}`);
    const status = String(cfOrder.order_status || "").toUpperCase();

    let paymentId = null;
    try {
      const payments = await cashfreeFetch(
        `/orders/${encodeURIComponent(orderId)}/payments`
      );
      const list = Array.isArray(payments) ? payments : payments?.payments || [];
      const success = list.find(
        (p) => String(p.payment_status || "").toUpperCase() === "SUCCESS"
      );
      paymentId = success?.cf_payment_id ? String(success.cf_payment_id) : null;
    } catch {
      /* order status is enough */
    }

    if (status !== "PAID") {
      if (status === "EXPIRED" || status === "TERMINATED") {
        await PaymentOrder.findOneAndUpdate({ orderId }, { status: "failed" });
      }
      return res.status(400).json({
        ok: false,
        message: `Payment not completed yet (status: ${status || "UNKNOWN"}).`,
        orderStatus: status,
      });
    }

    const updated = await markPaidAndEnroll(doc, paymentId);

    return res.json({
      ok: true,
      message: "Payment verified successfully.",
      payment: updated
        ? {
            id: updated._id,
            orderId: updated.orderId,
            paymentId: updated.paymentId,
            amountInr: updated.amountInr,
            coupon: updated.coupon,
            items: updated.items,
            status: updated.status,
          }
        : { orderId, paymentId, status: "paid" },
    });
  } catch (err) {
    console.error("[API] POST /api/payments/verify", err?.details || err);
    return res.status(err.status || 500).json({
      message: err.message || "Could not verify payment.",
    });
  }
});

export default router;
