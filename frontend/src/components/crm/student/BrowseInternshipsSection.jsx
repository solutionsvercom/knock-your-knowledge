import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { useCart } from "@/lib/CartContext";
import { INTERNSHIP_FEE_AMOUNT, feeLabelWithGst } from "@/config/pricing";
import { ShoppingCart, Plus, Check, ArrowRight, Briefcase } from "lucide-react";

export default function BrowseInternshipsSection() {
  const navigate = useNavigate();
  const { items, addItem, count } = useCart();

  const { data: internshipsRaw, isLoading } = useQuery({
    queryKey: ["internships"],
    queryFn: () => api.internships.list(),
  });

  const internships = asArray(internshipsRaw);

  const cartInternshipIds = useMemo(
    () => new Set(items.filter((x) => x.type === "internship").map((x) => x.id)),
    [items]
  );

  const addAndCheckout = (program) => {
    addItem({
      type: "internship",
      id: program.id,
      title: program.title,
      price: INTERNSHIP_FEE_AMOUNT,
      thumbnail: program.image || program.company_logo || "",
    });
    navigate("/Checkout");
  };

  const goToCheckout = () => navigate("/Checkout");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Internship Programs
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
            Add a program to cart and continue to checkout
          </p>
        </div>
        {count > 0 ? (
          <button
            type="button"
            onClick={goToCheckout}
            className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.35)",
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Go to checkout ({count})
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <p className="text-sm" style={{ color: "#475569" }}>
          Loading programs…
        </p>
      ) : (
        <div className="space-y-3">
          {internships.map((program) => {
            const inCart = cartInternshipIds.has(program.id);
            return (
              <div
                key={program.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: inCart ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }}
                >
                  {program.image ? (
                    <img src={program.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{program.title}</p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: "#64748b" }}>
                    {program.description}
                  </p>
                  <p className="text-sm font-semibold mt-2" style={{ color: "#34d399" }}>
                    Internship Fee: {feeLabelWithGst(INTERNSHIP_FEE_AMOUNT)}
                  </p>
                </div>

                {inCart ? (
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    <span
                      className="inline-flex items-center justify-center gap-1.5 px-3 h-10 rounded-xl text-xs font-semibold"
                      style={{ color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}
                    >
                      <Check className="w-3.5 h-3.5" /> In cart
                    </span>
                    <button
                      type="button"
                      onClick={goToCheckout}
                      className="inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                    >
                      Pay now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => addAndCheckout(program)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl text-xs font-semibold text-white flex-shrink-0 transition-transform hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      boxShadow: "0 0 14px rgba(124,58,237,0.3)",
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
