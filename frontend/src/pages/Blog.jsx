import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CAREER_BLOGS } from "@/data/courseBlogs";
import { Clock, BookOpen, Search, ArrowRight, Star } from "lucide-react";

export default function Blog() {
  const [search, setSearch] = useState("");

  const filtered = CAREER_BLOGS.filter((b) => {
    const q = search.toLowerCase();
    return (
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.tags?.some((t) => String(t).toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div
        className="py-14 border-b text-center"
        style={{
          borderColor: "rgba(167,139,250,0.15)",
          background: "linear-gradient(180deg, rgba(124,58,237,0.07) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            KYK Career Guide
          </p>
          <h1
            className="text-4xl lg:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Career{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Guide
            </span>
          </h1>
          <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: "#475569" }}>
            {CAREER_BLOGS.length} career articles to help you land internships and prepare for interviews.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input
              placeholder="Search career guides…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 h-12 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e2e8f0",
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm mb-6" style={{ color: "#475569" }}>
          Showing{" "}
          <span className="font-semibold" style={{ color: "#a78bfa" }}>
            {filtered.length}
          </span>{" "}
          {filtered.length === 1 ? "guide" : "guides"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              to={`/Blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(2,8,23,0.75)",
                    color: post.iconColor || "#a78bfa",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {post.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2
                  className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {post.title}
                </h2>
                <p className="text-xs leading-relaxed mb-4 line-clamp-2 flex-1" style={{ color: "#64748b" }}>
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs" style={{ color: "#475569" }}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readMins} min read
                  </span>
                  {post.rating ? (
                    <span className="flex items-center gap-1" style={{ color: "#fbbf24" }}>
                      <Star className="w-3.5 h-3.5 fill-yellow-400" /> {post.rating}
                    </span>
                  ) : null}
                </div>
                <span
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                  style={{ color: "#a78bfa" }}
                >
                  Read guide <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "#334155" }} />
            <p className="text-sm" style={{ color: "#475569" }}>
              No career guides match your search.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
