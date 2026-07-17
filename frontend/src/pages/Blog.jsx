import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COURSE_BLOGS } from "@/data/courseBlogs";
import { Clock, BookOpen, Search, ArrowRight, Star } from "lucide-react";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(COURSE_BLOGS.map((b) => b.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = COURSE_BLOGS.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.tags?.some((t) => String(t).toLowerCase().includes(q));
    const matchCat = category === "all" || b.category === category;
    return matchSearch && matchCat;
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
            KYK Blog
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
              Course Guides
            </span>
          </h1>
          <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: "#475569" }}>
            {COURSE_BLOGS.length} articles covering our internship courses and career tips — written from KYK programs.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input
              placeholder="Search courses, skills, guides…"
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
        <div className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: active ? "rgba(167,139,250,0.15)" : "transparent",
                  color: active ? "#a78bfa" : "#475569",
                  border: active ? "1px solid rgba(167,139,250,0.3)" : "1px solid transparent",
                }}
              >
                {cat === "all" ? "All posts" : cat}
              </button>
            );
          })}
        </div>

        <p className="text-sm mb-6" style={{ color: "#475569" }}>
          Showing{" "}
          <span className="font-semibold" style={{ color: "#a78bfa" }}>
            {filtered.length}
          </span>{" "}
          posts
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
              No posts match your search.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
