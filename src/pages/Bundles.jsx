import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { ApiQueryStatus } from "@/components/common/ApiQueryStatus";

export default function Bundles() {
  const {
    data: bundlesRaw,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bundles"],
    queryFn: () => api.bundles.list("-createdAt"),
  });

  const bundles = asArray(bundlesRaw);

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-white mb-2">Course Bundles</h1>
        <p className="text-sm mb-8" style={{ color: "#64748b" }}>
          Save more with curated learning bundles.
        </p>

        <ApiQueryStatus
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          loadingLabel="Loading bundles from API…"
        >
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {bundles.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl p-5 flex flex-col"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 className="text-lg font-bold text-white">{b.name || b.title}</h3>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                {(b.courses || b.course_ids || []).length} courses
              </p>
              <p className="text-sm mt-2 min-h-[44px] flex-1" style={{ color: "#94a3b8" }}>
                {b.description || "No description provided."}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs" style={{ color: "#475569" }}>Bundle price</p>
                  <p className="text-xl font-black text-white">${b.price || 0}</p>
                </div>
                <Link to={`/BundleDetail?id=${encodeURIComponent(b.id)}`}>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    View bundle
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        {!isLoading && !isError && bundles.length === 0 && (
          <div className="text-center py-16 text-sm" style={{ color: "#475569" }}>
            No bundles returned from the API yet.
          </div>
        )}
        </ApiQueryStatus>
      </div>
    </div>
  );
}

