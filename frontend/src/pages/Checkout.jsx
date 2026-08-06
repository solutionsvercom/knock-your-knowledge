import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useCart } from "@/lib/CartContext";
import { Trash2, ShoppingBag, ArrowLeft, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatInr(amount) {
  return `₹${(Number(amount) || 0).toLocaleString("en-IN")}/-`;
}

export default function Checkout() {
  const { items, removeItem, clear, total } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [method, setMethod] = useState("upi");

  const checkout = useMutation({
    mutationFn: async () => {
      setError(null);
      for (const line of items) {
        if (line.type === "course") {
          await api.payments.createCoursePayment({
            course_id: line.id,
            amount: Number(line.price) || 0,
          });
          await api.enrollments.create({ course_id: line.id });
        } else if (line.type === "bundle") {
          await api.payments.createBundlePurchase({ bundle_id: line.id });
        }
      }
      clear();
    },
    onSuccess: () => {
      navigate("/Dashboard");
    },
  });

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
            Payment Gateway
          </h1>
        </div>
        <p className="text-sm mb-8" style={{ color: "#64748b" }}>
          Review your cart and complete payment securely.
        </p>

        {items.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "#64748b" }} />
            <p className="text-slate-400 mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link to="/Internships">Browse internships & bundles</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-3 mb-6">
              {items.map((line) => (
                <li
                  key={`${line.type}-${line.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase font-semibold mb-0.5" style={{ color: "#64748b" }}>
                      {line.type === "bundle" ? "Bundle" : "Course"}
                    </p>
                    <p className="text-white font-semibold truncate">{line.title}</p>
                  </div>
                  <p className="text-white font-bold">{formatInr(line.price)}</p>
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

            <div
              className="rounded-xl border p-4 mb-6"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
                Payment method
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "upi", label: "UPI" },
                  { id: "card", label: "Card" },
                  { id: "netbanking", label: "Net Banking" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className="h-10 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: method === m.id ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.03)",
                      border: method === m.id ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      color: method === m.id ? "#e2e8f0" : "#64748b",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="text-slate-400">Total</span>
              <span className="text-2xl font-black text-white">{formatInr(total)}</span>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-300 bg-red-950/40 border border-red-900/50 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"
              disabled={checkout.isPending}
              onClick={() => {
                checkout.mutate(undefined, {
                  onError: (e) => setError(e?.message || "Payment failed"),
                });
              }}
            >
              {checkout.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Processing payment…
                </>
              ) : (
                `Pay ${formatInr(total)}`
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs mt-4" style={{ color: "#475569" }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
              Secure demo checkout — payment recorded on completion
            </p>
          </>
        )}
      </div>
    </div>
  );
}
