import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { ApiQueryStatus } from "@/components/common/ApiQueryStatus";
import { useCart } from "@/lib/CartContext";
import { whatsappApplyUrl } from "@/config/contact";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Users,
  ExternalLink,
  ShoppingCart,
  Package,
} from "lucide-react";
import { format } from "date-fns";

const typeStyles = {
  remote: { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" },
  hybrid: { background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" },
  onsite: { background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.25)" },
};

const LOGO_FALLBACK =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80";

const STATS = [
  { value: "25", label: "APIs", color: "#60a5fa" },
  { value: "25+", label: "Companies", color: "#a78bfa" },
  { value: "Live data", label: "Source", color: "#34d399" },
  { value: "4", label: "Programs", color: "#06b6d4" },
];

const INTERNSHIP_FEE = "₹3999/-";

function applyOnWhatsApp(programTitle) {
  window.open(whatsappApplyUrl(programTitle), "_blank", "noopener,noreferrer");
}

function formatInr(amount) {
  const n = Number(amount) || 0;
  return `₹${n.toLocaleString("en-IN")}/-`;
}

export default function Internships() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { addItem } = useCart();

  const {
    data: internshipsRaw,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["internships"],
    queryFn: () => api.internships.list(),
  });

  const {
    data: bundlesRaw,
    isLoading: bundlesLoading,
    isError: bundlesError,
    error: bundlesErr,
    refetch: refetchBundles,
  } = useQuery({
    queryKey: ["internship-bundles"],
    queryFn: () => api.bundles.list(),
  });

  const internships = asArray(internshipsRaw);
  const bundles = asArray(bundlesRaw).filter((b) => b.status !== "draft");

  const filtered = internships.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.skills?.some((s) => String(s).toLowerCase().includes(q))
    );
  });

  const addBundleToCart = (bundle) => {
    addItem({
      type: "bundle",
      id: bundle.id,
      title: bundle.title || bundle.name,
      price: Number(bundle.price) || 3999,
      thumbnail: bundle.thumbnail || "",
    });
    navigate("/Checkout");
  };

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div
        className="py-16 border-b"
        style={{
          borderColor: "rgba(167,139,250,0.15)",
          background: "linear-gradient(180deg, rgba(124,58,237,0.05) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            Career Launch
          </p>
          <h1
            className="text-4xl lg:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Internship{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Programs
            </span>
          </h1>
          <p style={{ color: "#475569" }}>
            Choose a track — Development, AI & Prompt Engineering, Business Analytics, or Advanced Digital Marketing
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 text-center transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: `0 0 20px ${stat.color}11`,
              }}
            >
              <p
                className="text-2xl font-black"
                style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="text-sm mt-1" style={{ color: "#475569" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative max-w-xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
          <input
            placeholder="Search programs or skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 h-11 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e2e8f0",
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(167,139,250,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.08)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {!isLoading && !isError ? (
          <p className="text-sm mb-6" style={{ color: "#475569" }}>
            Showing{" "}
            <span className="font-semibold" style={{ color: "#a78bfa" }}>
              {filtered.length}
            </span>{" "}
            internship programs
          </p>
        ) : null}

        <ApiQueryStatus
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          loadingLabel="Loading internship programs…"
        >
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(96,165,250,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  <div
                    className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <img
                      src={item.image || item.company_logo || LOGO_FALLBACK}
                      alt={item.title || ""}
                      className="w-full h-full object-cover max-w-full"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: "#475569" }}>
                      <Building2 className="w-3.5 h-3.5" />
                      {item.company}
                    </div>
                    <p className="text-sm mt-2" style={{ color: "#475569" }}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm" style={{ color: "#475569" }}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                      {item.work_type && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                          style={typeStyles[item.work_type] || {}}
                        >
                          {item.work_type}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.duration}
                      </span>
                      <span className="flex items-center gap-1 font-semibold" style={{ color: "#34d399" }}>
                        <DollarSign className="w-3.5 h-3.5" />
                        Internship Fee: {item.stipend || INTERNSHIP_FEE}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "#64748b",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 self-start lg:self-center flex-shrink-0 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => applyOnWhatsApp(item.title)}
                      className="w-full lg:w-auto min-h-[48px] px-6 rounded-xl text-base font-semibold text-white transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                      style={{
                        background: "linear-gradient(135deg, #25d366, #128c7e)",
                        boxShadow: "0 0 16px rgba(37,211,102,0.35)",
                      }}
                    >
                      Apply Now <ExternalLink className="w-4 h-4" />
                    </button>
                    <div className="text-xs text-center mt-1" style={{ color: "#334155" }}>
                      {item.deadline && (
                        <span className="flex items-center gap-1 justify-center">
                          <Calendar className="w-3 h-3" /> {format(new Date(item.deadline), "MMM d, yyyy")}
                        </span>
                      )}
                      <span className="flex items-center gap-1 justify-center mt-0.5">
                        <Users className="w-3 h-3" /> {item.applicants} applicants • {item.openings} openings
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!isLoading && !isError && filtered.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: "#475569" }}>
              No internship programs match your search.
            </p>
          ) : null}
        </ApiQueryStatus>

        {/* Course bundles */}
        <div className="mt-16 pt-10 border-t" style={{ borderColor: "rgba(167,139,250,0.15)" }}>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>
              Course Bundles
            </p>
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Save with curated packs
            </h2>
            <p className="text-sm" style={{ color: "#475569" }}>
              Add a bundle to cart and complete payment on the secure checkout page.
            </p>
          </div>

          <ApiQueryStatus
            isLoading={bundlesLoading}
            isError={bundlesError}
            error={bundlesErr}
            onRetry={() => refetchBundles()}
            loadingLabel="Loading bundles…"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="rounded-2xl p-6 flex flex-col transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
                    e.currentTarget.style.boxShadow = "0 0 28px rgba(167,139,250,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(167,139,250,0.12)",
                      border: "1px solid rgba(167,139,250,0.25)",
                    }}
                  >
                    <Package className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {bundle.title || bundle.name}
                  </h3>
                  <p className="text-sm flex-1 mb-4" style={{ color: "#64748b" }}>
                    {bundle.description}
                  </p>
                  <p className="text-xl font-black mb-4" style={{ color: "#34d399", fontFamily: "'Poppins', sans-serif" }}>
                    {formatInr(bundle.price || 3999)}
                  </p>
                  <button
                    type="button"
                    onClick={() => addBundleToCart(bundle)}
                    className="w-full min-h-[48px] px-5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] inline-flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      boxShadow: "0 0 18px rgba(124,58,237,0.35)",
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
            {!bundlesLoading && !bundlesError && bundles.length === 0 ? (
              <p className="text-center py-10 text-sm" style={{ color: "#475569" }}>
                No bundles available right now.
              </p>
            ) : null}
          </ApiQueryStatus>
        </div>
      </div>
    </div>
  );
}
