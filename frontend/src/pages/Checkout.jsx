import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { resolveCoupon } from "@/config/coupons";
import {
  INTERNSHIP_FEE_AMOUNT,
  GST_RATE,
  formatInr,
  discountedPrice,
  withGst,
} from "@/config/pricing";
import { CONTACT_PHONE, whatsappGetStartedUrl } from "@/config/contact";
import {
  createCashfreeOrder,
  loadCashfreeScript,
  verifyCashfreePayment,
} from "@/api/cashfreeApi";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Plus,
  Check,
  Tag,
  X,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const { items, addItem, removeItem, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [phone, setPhone] = useState(() => String(user?.phone || "").replace(/\D/g, "").slice(-10));

  const { data: internshipsRaw } = useQuery({
    queryKey: ["internships"],
    queryFn: () => api.internships.list(),
  });

  const internships = asArray(internshipsRaw);

  const cartInternshipIds = useMemo(
    () => new Set(items.filter((x) => x.type === "internship").map((x) => x.id)),
    [items]
  );

  const availableToAdd = useMemo(
    () => internships.filter((p) => p?.id && !cartInternshipIds.has(p.id)),
    [internships, cartInternshipIds]
  );

  const hasInternshipInCart = cartInternshipIds.size > 0;
  const payFraction = appliedCoupon?.payFraction ?? 1;

  const pricedItems = useMemo(
    () =>
      items.map((line) => {
        const original = Number(line.price) || 0;
        const taxable = discountedPrice(original, payFraction);
        const { gst, total: withTax } = withGst(taxable);
        return { ...line, original, taxable, gst, payable: withTax };
      }),
    [items, payFraction]
  );

  const taxableTotal = useMemo(
    () => pricedItems.reduce((sum, line) => sum + line.taxable, 0),
    [pricedItems]
  );

  const gstTotal = useMemo(
    () => pricedItems.reduce((sum, line) => sum + line.gst, 0),
    [pricedItems]
  );

  const payableTotal = useMemo(
    () => pricedItems.reduce((sum, line) => sum + line.payable, 0),
    [pricedItems]
  );

  const savings = Math.max(0, total - taxableTotal);

  const addInternship = (program) => {
    addItem({
      type: "internship",
      id: program.id,
      title: program.title,
      price: INTERNSHIP_FEE_AMOUNT,
      thumbnail: program.image || program.company_logo || "",
    });
  };

  const applyCoupon = async () => {
    setCouponError("");
    const found = await resolveCoupon(couponInput);
    if (!found) {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code. Try again.");
      return;
    }
    setAppliedCoupon(found);
    setCouponInput(found.code);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const recordLocalPayments = async (paymentMeta = {}) => {
    for (const line of pricedItems) {
      if (line.type === "course") {
        await api.payments.createCoursePayment({
          course_id: line.id,
          amount: line.payable,
        });
        try {
          await api.enrollments.create({ course_id: line.id });
        } catch {
          // ignore enrollment if unavailable
        }
      } else if (line.type === "bundle") {
        await api.payments.createBundlePurchase({ bundle_id: line.id });
      } else if (line.type === "internship") {
        await api.payments.createInternshipPayment({
          internship_id: line.id,
          amount: line.payable,
          title: line.title,
          payment_method: "cashfree",
          transaction_id: paymentMeta.paymentId || paymentMeta.orderId || "",
        });
      }
    }
  };

  const finishPaidOrder = async (orderId, paymentMeta = {}) => {
    const verified = await verifyCashfreePayment({ orderId });
    await recordLocalPayments({
      orderId,
      paymentId: verified?.payment?.paymentId || paymentMeta.paymentId || "",
    });
    clear();
    navigate("/Dashboard", { replace: true });
  };

  // Return URL from Cashfree redirect after payment
  useEffect(() => {
    const orderId = searchParams.get("order_id") || searchParams.get("cf_order_id");
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      setPaying(true);
      setError(null);
      try {
        await finishPaidOrder(orderId);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Could not confirm payment. If money was deducted, contact support.");
        }
      } finally {
        if (!cancelled) setPaying(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when return URL has order_id
  }, [searchParams]);

  const payWithCashfree = async () => {
    setError(null);
    setPaying(true);
    try {
      if (payableTotal < 1) {
        throw new Error("Amount to pay must be at least ₹1.");
      }

      const contact = String(phone || "").replace(/\D/g, "").slice(-10);
      if (contact.length !== 10) {
        throw new Error("Enter a valid 10-digit mobile number.");
      }

      await loadCashfreeScript();

      const order = await createCashfreeOrder({
        amountInr: payableTotal,
        coupon: appliedCoupon?.code || null,
        items: pricedItems.map((line) => ({
          type: line.type,
          id: line.id,
          title: line.title,
          original: line.original,
          payable: line.payable,
        })),
        customer: {
          name: user?.full_name || "",
          email: user?.email || "",
          contact,
        },
      });

      if (!order?.orderId || !order?.paymentSessionId) {
        throw new Error("Could not start Cashfree checkout.");
      }

      const mode = order.mode === "production" ? "production" : "sandbox";
      const cashfree = window.Cashfree({ mode });
      const result = await cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result?.error) {
        throw new Error(result.error.message || result.error.description || "Payment failed.");
      }

      // Modal flow: verify with Cashfree order status
      await finishPaidOrder(order.orderId);
    } catch (err) {
      const msg = err?.message || "Payment failed";
      if (/cancel|dismiss|closed/i.test(msg)) {
        setError("Payment was cancelled. You can try again anytime.");
      } else if (/whitelist|not enabled or approved/i.test(msg)) {
        setError(
          "Cashfree live checkout must run on https://knockyourknowledge.com. In Merchant Dashboard → Developers → Whitelisting, add https://knockyourknowledge.com (and https://www.knockyourknowledge.com). Localhost is not allowed."
        );
      } else {
        setError(msg);
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          to="/Internships"
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: "#94a3b8" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to internships
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <CreditCard className="w-5 h-5" style={{ color: "#a78bfa" }} />
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Secure Checkout
          </h1>
        </div>
        <p className="text-sm mb-8" style={{ color: "#64748b" }}>
          Pay securely with UPI, debit card, or credit card.
        </p>

        {items.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "#64748b" }} />
            <p className="text-slate-400 mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link to="/Internships">Browse internships</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-3 mb-6">
              {pricedItems.map((line) => (
                <li
                  key={`${line.type}-${line.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase font-semibold mb-0.5" style={{ color: "#64748b" }}>
                      {line.type === "bundle" ? "Bundle" : line.type === "internship" ? "Internship" : "Course"}
                    </p>
                    <p className="text-white font-semibold truncate">{line.title}</p>
                  </div>
                  <div className="text-right">
                    {appliedCoupon ? (
                      <>
                        <p className="text-xs line-through" style={{ color: "#64748b" }}>
                          {formatInr(line.original)}
                        </p>
                        <p className="text-sm font-bold text-white">{formatInr(line.taxable)}</p>
                        <p className="text-[10px]" style={{ color: "#94a3b8" }}>
                          + GST {formatInr(line.gst)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-white font-bold">{formatInr(line.taxable)}</p>
                        <p className="text-[10px]" style={{ color: "#94a3b8" }}>
                          + GST {formatInr(line.gst)}
                        </p>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label="Remove"
                    className="p-2 rounded-lg hover:bg-white/5"
                    onClick={() => removeItem(line.type, line.id)}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: "#94a3b8" }} />
                  </button>
                </li>
              ))}
            </ul>

            {hasInternshipInCart && availableToAdd.length > 0 ? (
              <div
                className="rounded-xl border p-4 mb-6"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(96,165,250,0.2)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#60a5fa" }}>
                  Add more internships
                </p>
                <p className="text-sm mb-4" style={{ color: "#64748b" }}>
                  Add another program here — no need to go back to the Internships page.
                </p>
                <ul className="space-y-2">
                  {availableToAdd.map((program) => (
                    <li
                      key={program.id}
                      className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{program.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#34d399" }}>
                          Fee: {formatInr(INTERNSHIP_FEE_AMOUNT)}
                          {appliedCoupon
                            ? ` → ${formatInr(discountedPrice(INTERNSHIP_FEE_AMOUNT, payFraction))}`
                            : ""}{" "}
                          + 18% GST
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addInternship(program)}
                        className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-semibold text-white flex-shrink-0 transition-transform hover:scale-105"
                        style={{
                          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                          boxShadow: "0 0 12px rgba(124,58,237,0.3)",
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasInternshipInCart && availableToAdd.length === 0 ? (
              <div
                className="flex items-center gap-2 rounded-xl border px-4 py-3 mb-6 text-sm"
                style={{
                  background: "rgba(52,211,153,0.06)",
                  borderColor: "rgba(52,211,153,0.2)",
                  color: "#34d399",
                }}
              >
                <Check className="w-4 h-4 flex-shrink-0" />
                All internship programs are already in your cart.
              </div>
            ) : null}

            <div
              className="rounded-xl border p-4 mb-6"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(251,191,36,0.25)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5"
                style={{ color: "#fbbf24" }}
              >
                <Tag className="w-3.5 h-3.5" /> Coupon code
              </p>

              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Applied: <span style={{ color: "#34d399" }}>{appliedCoupon.code.toUpperCase()}</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                      {appliedCoupon.label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                    style={{ color: "#f87171", background: "rgba(248,113,113,0.1)" }}
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyCoupon();
                      }
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 h-11 px-3 rounded-xl text-sm outline-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#e2e8f0",
                    }}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="h-11 px-4 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #d97706, #ca8a04)" }}
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError ? (
                <p className="text-xs mt-2" style={{ color: "#f87171" }}>
                  {couponError}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 mb-6 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#64748b" }}>Original total</span>
                <span
                  className={appliedCoupon ? "line-through" : undefined}
                  style={{ color: appliedCoupon ? "#64748b" : "#e2e8f0" }}
                >
                  {formatInr(total)}
                </span>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "#34d399" }}>Coupon savings (30% off)</span>
                  <span style={{ color: "#34d399" }}>-{formatInr(savings)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#94a3b8" }}>Taxable amount</span>
                <span className="text-white">{formatInr(taxableTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#94a3b8" }}>GST ({Math.round(GST_RATE * 100)}%)</span>
                <span className="text-white">+{formatInr(gstTotal)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Amount to pay</span>
                <span className="text-2xl font-black text-white">{formatInr(payableTotal)}</span>
              </div>
            </div>

            <label className="block mb-4">
              <span className="text-xs font-medium" style={{ color: "#94a3b8" }}>
                Mobile number *
              </span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                }}
              />
            </label>

            <div
              className="rounded-xl border p-4 mb-6"
              style={{ background: "rgba(124,58,237,0.08)", borderColor: "rgba(167,139,250,0.25)" }}
            >
              <p className="text-sm font-semibold text-white mb-1">Cashfree payment</p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                Pay via UPI (GPay, PhonePe, Paytm), debit card, or credit card. Amount charged:{" "}
                <span className="text-white font-semibold">{formatInr(payableTotal)}</span>
              </p>
              <p className="text-xs mt-2" style={{ color: "#64748b" }}>
                Need help? Call {CONTACT_PHONE} or{" "}
                <button
                  type="button"
                  className="underline"
                  style={{ color: "#34d399" }}
                  onClick={() => window.open(whatsappGetStartedUrl(), "_blank", "noopener,noreferrer")}
                >
                  WhatsApp us
                </button>
                .
              </p>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-300 bg-red-950/40 border border-red-900/50 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"
              disabled={paying}
              onClick={payWithCashfree}
            >
              {paying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Opening Cashfree checkout…
                </>
              ) : (
                `Pay ${formatInr(payableTotal)}`
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs mt-4" style={{ color: "#475569" }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
              Payments verified on server with Cashfree order status
            </p>
          </>
        )}
      </div>
    </div>
  );
}
