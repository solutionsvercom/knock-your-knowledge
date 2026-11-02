import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CAREER_BLOGS } from "@/data/courseBlogs";
import { seoForPath } from "@/config/seo";
import { Clock, BookOpen, Search, ArrowRight } from "lucide-react";

const pageSeo = seoForPath("/Blog");

const PROGRAMME_LINKS = [
  { to: "/Internships/development", text: "Development Internship" },
  { to: "/Internships/ai", text: "AI & Prompt Engineering Internship" },
  { to: "/Internships/analytics", text: "Business Analytics Internship" },
  { to: "/Internships/marketing", text: "Advanced Digital Marketing Internship" },
];

const BUNDLE_LINKS = [
  { to: "/Bundles/development", text: "Development Bundle" },
  { to: "/Bundles/ai", text: "AI & Prompt Engineering Bundle" },
  { to: "/Bundles/analytics", text: "Business Analytics Bundle" },
  { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
];

const COURSE_EXAMPLE_LINKS = [
  { to: "/Blog/python-programming", text: "Python Programming" },
  { to: "/Blog/prompt-engineering", text: "Prompt Engineering" },
  { to: "/Blog/sql-for-data-analysis", text: "SQL for Data Analysis" },
  { to: "/Blog/seo-search-engine-optimization", text: "SEO — Search Engine Optimization" },
];

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
            {pageSeo.h1}
          </h1>
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Guides for applying to KYK internships and preparing for internship interviews
          </h2>
          <p className="text-base max-w-2xl mx-auto mb-4" style={{ color: "#94a3b8" }}>
            This Career Guide has two practical articles: how to land a first internship, and internship interview prep.
            Knock Your Knowledge also offers paid, real-time internship programmes. Those programmes are distinct from
            KYK courses and course bundles.
          </p>
          <p className="text-sm max-w-2xl mx-auto mb-8" style={{ color: "#94a3b8" }}>
            {CAREER_BLOGS.length} career articles on this page. They are not a job guarantee, stipend, or course pack.
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
        <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
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
                  alt={`${post.title} guide`}
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
                <div className="flex items-center text-xs" style={{ color: "#94a3b8" }}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readMins} min read
                  </span>
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
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              No career guides match your search.
            </p>
          </div>
        ) : null}

        <section className="mt-12">
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Career articles
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/Blog/how-to-land-your-first-internship" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                How to Land Your First Internship
              </Link>
            </li>
            <li>
              <Link to="/Blog/internship-interview-prep" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                Internship Interview Prep Essentials
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Paid internship programmes
          </h2>
          <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
            Explore KYK’s paid internship programmes. Each programme is a separate product from this Career Guide, from
            individual courses, and from course bundles.
          </p>
          <p className="text-sm mb-3">
            <Link to="/Internships" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              All internship programmes
            </Link>
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {PROGRAMME_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Courses and bundles
          </h2>
          <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
            Courses and bundles are not internships. Use them if you want a listed course or a track pack.
          </p>
          <p className="text-sm mb-3">
            <Link to="/Courses" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              All internship courses
            </Link>
            <span style={{ color: "#64748b" }}> · </span>
            <Link to="/Bundles" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              All course bundles
            </Link>
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm mb-4">
            {BUNDLE_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs mb-2" style={{ color: "#64748b" }}>
            Course examples named in the career articles:
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {COURSE_EXAMPLE_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
