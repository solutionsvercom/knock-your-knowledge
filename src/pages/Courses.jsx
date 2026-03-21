import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { getWebsiteCourseCatalog } from "@/data/courseCatalog";
import { asArray } from "@/lib/asArray";
import { ApiQueryStatus } from "@/components/common/ApiQueryStatus";
import {
  Clock,
  Users,
  Award,
  ChevronRight,
  CheckCircle2,
  Star,
  BookOpen,
  Filter,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";

const LEVEL_STYLES = {
  Beginner:     { bg: "rgba(52,211,153,0.12)",  color: "#34d399",  border: "rgba(52,211,153,0.3)"  },
  Intermediate: { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24",  border: "rgba(251,191,36,0.3)"  },
  Advanced:     { bg: "rgba(248,113,113,0.12)", color: "#f87171",  border: "rgba(248,113,113,0.3)" },
};

function CourseCard({ course }) {
  const [expanded, setExpanded] = useState(false);
  const { addItem } = useCart();
  const Icon = course.icon;
  const lvl = LEVEL_STYLES[course.level] || LEVEL_STYLES.Beginner;
  const cover = course.thumbnail || course.image;

  return (
    <div
      className="rounded-2xl flex flex-col transition-all duration-300 hover:translate-y-[-2px] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
    >
      {cover ? (
        <div className="relative h-36 w-full flex-shrink-0 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <img src={cover} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : null}
      {/* Card header */}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: course.iconBg, border: `1px solid ${course.iconColor}30` }}>
            <Icon className="w-5 h-5" style={{ color: course.iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white leading-snug"
              style={{ fontFamily: "'Poppins', sans-serif" }}>{course.title}</h3>
            {course.instructor && (
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{course.instructor}</p>
            )}
          </div>
          {course.badge && (
            <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}>
              <Award className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed mb-3" style={{ color: "#64748b" }}>{course.shortDesc}</p>

        {/* Tags / Tools */}
        {(course.tags || course.tools) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(course.tags || course.tools)?.slice(0, 4).map(t => (
              <span key={t} className="px-2 py-0.5 rounded-md text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Practical projects */}
        {course.projects && (
          <div className="flex flex-wrap gap-2 mb-3">
            {course.projects.map(p => (
              <span key={p} className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
                <CheckCircle2 className="w-3 h-3" /> {p}
              </span>
            ))}
          </div>
        )}

        {/* Modules accordion */}
        {course.modules && (
          <div className="mb-3">
            <button onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ color: expanded ? "#a78bfa" : "#475569" }}>
              <BookOpen className="w-3.5 h-3.5" />
              {course.modules.length} Modules
              <ChevronRight className="w-3 h-3 transition-transform" style={{ transform: expanded ? "rotate(90deg)" : "" }} />
            </button>
            {expanded && (
              <ul className="mt-2 space-y-1">
                {course.modules.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                      style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa" }}>{i + 1}</div>
                    {typeof m === "object" && m?.title ? m.title : m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="px-5 py-3 flex items-center gap-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <span className="flex items-center gap-1 text-xs" style={{ color: "#475569" }}>
          <Clock className="w-3 h-3" /> {course.duration}
        </span>
        {course.students && (
          <span className="flex items-center gap-1 text-xs" style={{ color: "#475569" }}>
            <Users className="w-3 h-3" /> {course.students}
          </span>
        )}
        {course.rating && (
          <span className="flex items-center gap-1 text-xs" style={{ color: "#fbbf24" }}>
            <Star className="w-3 h-3 fill-yellow-400" /> {course.rating}
          </span>
        )}
        <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.border}` }}>
          {course.level}
        </span>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 pt-3 flex gap-2">
        <Link
          className="flex-1 min-w-0"
          to={
            course.id
              ? `/CourseDetail?id=${encodeURIComponent(course.id)}`
              : `/CourseDetail?title=${encodeURIComponent(course.title)}`
          }
        >
          <button
            type="button"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 min-h-[44px]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}>
            View course →
          </button>
        </Link>
        {course.id && (
          <button
            type="button"
            title="Add to cart"
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:opacity-90"
            style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.35)", color: "#a78bfa" }}
            onClick={() =>
              addItem({
                type: "course",
                id: course.id,
                title: course.title,
                price: Number(course.price) || 0,
                thumbnail: course.thumbnail || course.image || "",
              })
            }
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const {
    data: apiCoursesRaw,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["catalog-courses"],
    queryFn: () => api.courses.list("-createdAt"),
  });

  const apiCourses = asArray(apiCoursesRaw);
  /** Static catalog + API overlay (by title); extra DB courses → "More courses" */
  const allCategories = useMemo(() => getWebsiteCourseCatalog(apiCourses), [apiCourses]);

  const displayCategories = allCategories.filter(cat =>
    activeCategory === "all" || cat.id === activeCategory
  ).map(cat => ({
    ...cat,
    courses: cat.courses.filter(c =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.tags || c.tools || []).some(t =>
        String(t).toLowerCase().includes(search.toLowerCase())
      )
    )
  })).filter(cat => cat.courses.length > 0);

  const totalCourses = allCategories.reduce((s, c) => s + c.courses.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      {/* ── Page Header ── */}
      <div className="py-14 border-b text-center"
        style={{ borderColor: "rgba(167,139,250,0.15)", background: "linear-gradient(180deg, rgba(124,58,237,0.07) 0%, transparent 100%)" }}>
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>Course Catalog</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Learn. Build.{" "}
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Advance.
            </span>
          </h1>
          <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: "#475569" }}>
            {totalCourses} courses — catalog is merged with live API data. When a DB course title matches a card, that card uses your admin pricing and copy; other DB courses appear under{" "}
            <span className="text-slate-400">More courses</span>.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input
              placeholder="Search courses, tools, skills…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 h-12 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}
              onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
        </div>
      </div>

      <ApiQueryStatus
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        loadingLabel="Loading courses from server…"
      >
      {/* ── Category Filter Tabs ── */}
      <div className="sticky top-[48px] md:top-[64px] z-30 border-b"
        style={{ background: "rgba(2,8,23,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setActiveCategory("all")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={{
                background: activeCategory === "all" ? "rgba(167,139,250,0.15)" : "transparent",
                color: activeCategory === "all" ? "#a78bfa" : "#475569",
                border: activeCategory === "all" ? "1px solid rgba(167,139,250,0.3)" : "1px solid transparent",
              }}>
              <Filter className="w-3.5 h-3.5" /> All Courses
            </button>
            {allCategories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: isActive ? `${cat.glow}` : "transparent",
                    color: isActive ? cat.color : "#475569",
                    border: isActive ? `1px solid ${cat.border}` : "1px solid transparent",
                  }}>
                  <Icon className="w-3.5 h-3.5" /> {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Category Sections ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {displayCategories.map(cat => {
          const CatIcon = cat.icon;
          return (
            <section key={cat.id}>
              {/* Section heading */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: cat.glow, border: `1px solid ${cat.border}` }}>
                  <CatIcon className="w-6 h-6" style={{ color: cat.color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {cat.label}
                  </h2>
                  <p className="text-sm" style={{ color: "#475569" }}>
                    {cat.courses.length} {cat.courses.length === 1 ? "course" : "courses"}
                  </p>
                </div>
                <div className="hidden sm:block flex-1 h-px ml-4" style={{ background: `linear-gradient(90deg, ${cat.border}, transparent)` }} />
              </div>

              {/* Course grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {cat.courses.map(course => (
                  <CourseCard key={course.id || course.title} course={course} />
                ))}
              </div>
            </section>
          );
        })}

        {displayCategories.length === 0 && (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "#1e293b" }} />
            <p className="text-lg font-medium" style={{ color: "#334155" }}>
              {search ? "No courses match your search" : "No courses in this category"}
            </p>
            {search ? (
              <button type="button" onClick={() => setSearch("")} className="mt-3 text-sm" style={{ color: "#a78bfa" }}>
                Clear search
              </button>
            ) : (
              <button type="button" onClick={() => setActiveCategory("all")} className="mt-3 text-sm" style={{ color: "#a78bfa" }}>
                Show all categories
              </button>
            )}
          </div>
        )}
      </div>
      </ApiQueryStatus>
    </div>
  );
}