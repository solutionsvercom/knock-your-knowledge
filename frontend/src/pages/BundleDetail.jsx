import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { useCart } from "@/lib/CartContext";
import { ShoppingCart, Loader2, Layers, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BundleDetail() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const { addItem } = useCart();

  const { data: bundle, isLoading, error } = useQuery({
    queryKey: ["bundle", id],
    queryFn: () => api.bundles.getById(id),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <p className="text-slate-400">Missing bundle id</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#020817" }}>
        <p className="text-slate-400 text-center max-w-md px-4">{error?.message || "Bundle not found"}</p>
        <Button asChild variant="outline">
          <Link to="/Bundles">All bundles</Link>
        </Button>
      </div>
    );
  }

  const courses = Array.isArray(bundle.courses) ? bundle.courses : [];
  const name = bundle.name || bundle.title;

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/Bundles"
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: "#94a3b8" }}
        >
          <ArrowLeft className="w-4 h-4" /> Bundles
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2" style={{ color: "#a78bfa" }}>
              <Layers className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Bundle</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {name}
            </h1>
            <p className="text-slate-400 max-w-2xl">{bundle.description || "Curated courses at a bundle price."}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm text-slate-500 mb-1">Bundle price</p>
            <p className="text-3xl font-black text-white">${Number(bundle.price || 0).toFixed(2)}</p>
            <Button
              className="mt-4 w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 font-bold"
              onClick={() =>
                addItem({
                  type: "bundle",
                  id: bundle.id,
                  title: name,
                  price: Number(bundle.price) || 0,
                })
              }
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add bundle to cart
            </Button>
            <Button variant="outline" className="mt-2 w-full sm:w-auto border-slate-600 text-slate-200" asChild>
              <Link to="/Checkout">Go to checkout</Link>
            </Button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-4">Included courses ({courses.length})</h2>
        <ul className="space-y-3">
          {courses.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-4 p-4 rounded-xl border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              {(c.thumbnail || c.image) && (
                <img
                  src={c.thumbnail || c.image}
                  alt=""
                  className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{c.title}</p>
                <p className="text-xs text-slate-500 capitalize">{c.category}</p>
              </div>
              <Link
                to={`/CourseDetail?id=${encodeURIComponent(c.id)}`}
                className="text-sm font-medium"
                style={{ color: "#a78bfa" }}
              >
                View
              </Link>
            </li>
          ))}
        </ul>
        {courses.length === 0 && (
          <p className="text-slate-500 text-sm">No courses linked to this bundle yet.</p>
        )}
      </div>
    </div>
  );
}
