import React from "react";
import { Link } from "react-router-dom";
import { Gift, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/courseCatalog";
import { formatInr, RETAIL_BUNDLES } from "@/config/pricing";
import { BUNDLE_PAGE_COPY } from "@/data/bundlePageCopy";
import { bundleImgAlt, courseHref } from "@/lib/internalSeo";

function coverForOffer(offer) {
  const cat = CATEGORIES.find((c) => c.id === offer.categoryId);
  return cat?.courses?.[0]?.image || "";
}

export default function Bundles() {
  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div
        className="py-16 border-b text-center"
        style={{
          borderColor: "rgba(167,139,250,0.15)",
          background: "linear-gradient(180deg, rgba(124,58,237,0.07) 0%, transparent 100%)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
          Save more
        </p>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Course{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Bundles
          </span>
        </h1>
        <p style={{ color: "#475569" }}>Four track packs — buy the full set for less than individual courses.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5">
        {RETAIL_BUNDLES.map((offer) => {
          const solo = offer.courseFee * offer.titles.length;
          const cover = coverForOffer(offer);
          const blurb = BUNDLE_PAGE_COPY[offer.slug]?.intro;
          const href = `/Bundles/${offer.slug}`;
          return (
            <article
              key={offer.slug}
              className="rounded-2xl overflow-hidden p-5 transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Link
                to={href}
                className="flex flex-col sm:flex-row gap-5"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={bundleImgAlt(offer.pageTitle)}
                    className="w-full sm:w-44 h-36 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-full sm:w-44 h-36 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(251,191,36,0.12)" }}
                  >
                    <Gift className="w-8 h-8" style={{ color: "#fbbf24" }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>
                    Bundle
                  </p>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {offer.pageTitle}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                    {blurb || `${offer.names}. ${offer.titles.length} courses for ${formatInr(offer.fee)} instead of ${formatInr(solo)}.`}
                  </p>
                  <p className="text-lg font-black text-white mt-3">{formatInr(offer.fee)}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start sm:self-center text-sm font-semibold" style={{ color: "#a78bfa" }}>
                  View pack <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <p className="text-xs mt-4" style={{ color: "#64748b" }}>
                Included courses:{" "}
                {offer.titles.map((title, i) => {
                  const coursePath = courseHref(title);
                  return (
                    <span key={title}>
                      {coursePath ? (
                        <Link to={coursePath} className="font-medium hover:text-white" style={{ color: "#c4b5fd" }}>
                          {title}
                        </Link>
                      ) : (
                        title
                      )}
                      {i < offer.titles.length - 1 ? " · " : ""}
                    </span>
                  );
                })}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
