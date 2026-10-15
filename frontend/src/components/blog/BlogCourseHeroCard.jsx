import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle, ShoppingCart, Clapperboard, Layers } from "lucide-react";
import { courseFeeLabel } from "@/config/pricing";

export default function BlogCourseHeroCard({ post, onEnroll, feeItem }) {
  const modules = (post?.modules || []).slice(0, 5);
  const topicCount = Math.min(5, Math.max(modules.length, 5));

  return (
    <div
      className="w-full lg:w-[22rem] flex-shrink-0 rounded-2xl p-5 backdrop-blur-md"
      style={{
        background: "linear-gradient(160deg, rgba(15,23,42,0.92), rgba(49,46,129,0.55))",
        border: "1px solid rgba(167,139,250,0.35)",
        boxShadow: "0 18px 50px rgba(76,29,149,0.35)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "#c4b5fd" }}>
        Enroll this course
      </p>
      <h2 className="text-lg font-bold text-white leading-snug mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {post.title}
      </h2>
      <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>
        {topicCount} topics · 20 videos · {courseFeeLabel(feeItem)}
      </p>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
          style={{ background: "rgba(96,165,250,0.15)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.25)" }}
        >
          <Layers className="w-3.5 h-3.5" /> 5 topics
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
          style={{ background: "rgba(52,211,153,0.12)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.25)" }}
        >
          <Clapperboard className="w-3.5 h-3.5" /> 20 videos
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onEnroll}
          className="inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 0 16px rgba(124,58,237,0.4)",
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          Enroll now
        </button>
        <Link
          to={`/Blog/${post.slug}/videos`}
          className="inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(167,139,250,0.35)",
            color: "#e9d5ff",
          }}
        >
          <PlayCircle className="w-4 h-4" />
          Course videos
        </Link>
      </div>
    </div>
  );
}
