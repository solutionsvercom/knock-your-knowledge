import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useCart } from "@/lib/CartContext";
import { Trash2, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const { items, removeItem, clear, total } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
          to="/Courses"
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: "#94a3b8" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to catalog
        </Link>

        <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Checkout
        </h1>
        <p className="text-sm mb-8" style={{ color: "#64748b" }}>
          Review your cart and complete purchase (demo — payments recorded as completed).
        </p>

        {items.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: "#64748b" }} />
            <p className="text-slate-400 mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link to="/Courses">Browse courses</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="space-y-3 mb-8">
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
                  <p className="text-white font-bold">${Number(line.price).toFixed(2)}</p>
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

            <div className="flex items-center justify-between mb-6 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <span className="text-slate-400">Total</span>
              <span className="text-2xl font-black text-white">${total.toFixed(2)}</span>
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
                  onError: (e) => setError(e?.message || "Checkout failed"),
                });
              }}
            >
              {checkout.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Processing…
                </>
              ) : (
                "Complete purchase"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
