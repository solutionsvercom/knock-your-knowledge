import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { catalogCartIdFromTitle, getWebsiteCourseCatalog } from "@/data/courseCatalog";
import { slugifyTitle, getBlogBySlug } from "@/data/courseBlogs";
import { asArray } from "@/lib/asArray";
import { ApiQueryStatus } from "@/components/common/ApiQueryStatus";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import {
  formatInr,
  retailOfferForCategory,
  retailOfferForTitle,
} from "@/config/pricing";
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
  ArrowRight,
  ShoppingCart,
  Gift,
} from "lucide-react";

const LEVEL_STYLES = {
  Beginner:     { bg: "rgba(52,211,153,0.12)",  color: "#34d399",  border: "rgba(52,211,153,0.3)"  },
  Intermediate: { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24",  border: "rgba(251,191,36,0.3)"  },
  Advanced:     { bg: "rgba(248,113,113,0.12)", color: "#f87171",  border: "rgba(248,113,113,0.3)" },
};

function courseBlogPath(course) {
  const slug = slugifyTitle(course?.title);
  return slug && getBlogBySlug(slug) ? `/Blog/${slug}` : null;
}

function CourseCard({ course, onAddToCart, inCart = false }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = course.icon;
  const lvl = LEVEL_STYLES[course.level] || LEVEL_STYLES.Beginner;
  const cover = course.thumbnail || course.image;
  const blogPath = courseBlogPath(course);
  const offer = retailOfferForTitle(course.title);
  const forSale = Boolean(offer);
  const price = forSale ? offer.courseFee : Number(course.price) || 0;

  return (
    <div
      className="rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-0.5 overflow-hidden hover:border-violet-400/35"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
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
            <button type="button" onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 min-h-11 text-xs font-medium transition-colors"
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

        {forSale ? (
          <p className="text-lg font-black text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {formatInr(price)}
          </p>
        ) : null}

        {blogPath ? (
          <Link
            to={blogPath}
            className="mt-1 inline-flex items-center justify-center gap-2 w-full min-h-11 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              boxShadow: "0 0 14px rgba(124,58,237,0.28)",
            }}
          >
            Know more
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : null}

        {forSale && onAddToCart ? (
          <button
            type="button"
            onClick={() => onAddToCart(course)}
            className="mt-2 inline-flex items-center justify-center gap-2 w-full min-h-11 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{
              background: inCart ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
              border: inCart ? "1px solid rgba(52,211,153,0.35)" : "none",
              boxShadow: inCart ? "none" : "0 0 14px rgba(124,58,237,0.28)",
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "In cart · Checkout" : "Add to cart"}
          </button>
        ) : null}
      </div>

      {/* Stats row */}
      <div className="px-5 py-3 flex items-center gap-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <span className="flex items-center gap-1 text-xs" style={{ color: "#475569" }}>
          <Clock className="w-3 h-3" /> 1–3 months internship
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
    </div>
  );
}

function TrackBundleCard({ offer, onAdd, inCart }) {
  const soloTotal = offer.courseFee * offer.titles.length;
  return (
    <div
      className="mb-6 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(124,58,237,0.16))",
        border: "1px solid rgba(96,165,250,0.35)",
        boxShadow: "0 12px 40px rgba(37,99,235,0.12)",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)" }}
      >
        <Gift className="w-6 h-6" style={{ color: "#fbbf24" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>
          Bundle discount
        </p>
        <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {offer.packTitle}
        </h3>
        <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
          {offer.names}. Buy together for {formatInr(offer.fee)} instead of {formatInr(soloTotal)}.
        </p>
      </div>
      <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
        <p className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {formatInr(offer.fee)}
        </p>
        <p className="text-xs line-through" style={{ color: "#64748b" }}>
          {formatInr(soloTotal)}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: inCart ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg, #2563eb, #7c3aed)",
            border: inCart ? "1px solid rgba(52,211,153,0.35)" : "none",
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          {inCart ? "In cart · Checkout" : "Add bundle to cart"}
        </button>
      </div>
    </div>
  );
}

export default function Courses() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { isAuthenticated, isLoadingAuth } = useAuth();
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

  const goCheckout = () => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      navigate(`/login?mode=signup&next=${encodeURIComponent("/Checkout")}`);
      return;
    }
    navigate("/Checkout");
  };

  const addCourseToCart = (course) => {
    const id = course.id || catalogCartIdFromTitle(course.title);
    const offer = retailOfferForTitle(course.title);
    addItem({
      type: "course",
      id,
      title: course.title,
      price: offer?.courseFee ?? (Number(course.price) || 0),
      thumbnail: course.image || course.thumbnail || "",
    });
    goCheckout();
  };

  const addTrackBundle = (offer, courses) => {
    const cover = courses.find((c) => c.image || c.thumbnail);
    addItem(
      {
        type: "bundle",
        id: offer.id,
        title: offer.cartTitle,
        price: offer.fee,
        thumbnail: cover?.image || cover?.thumbnail || "",
      },
      {
        remove: offer.titles.map((title) => ({
          type: "course",
          id: catalogCartIdFromTitle(title),
        })).concat(
          courses
            .filter((c) => offer.titles.includes(c.title) && c.id)
            .map((c) => ({ type: "course", id: c.id }))
        ),
      }
    );
    goCheckout();
  };

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
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>Internship Courses</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Internship{" "}
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Courses
            </span>
          </h1>
          <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: "#475569" }}>
            {totalCourses} courses to build skills for internships and your career.
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
      <div className="sticky top-14 md:top-16 z-30 border-b"
        style={{ background: "rgba(2,8,23,0.95)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="flex items-center gap-2 px-4 min-h-11 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={{
                background: activeCategory === "all" ? "rgba(167,139,250,0.15)" : "transparent",
                color: activeCategory === "all" ? "#a78bfa" : "#475569",
                border: activeCategory === "all" ? "1px solid rgba(167,139,250,0.3)" : "1px solid transparent",
              }}>
              <Filter className="w-3.5 h-3.5" /> All Internship Courses
            </button>
            {allCategories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2 px-4 min-h-11 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
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
          const bundleOffer = retailOfferForCategory(cat.id);
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

              {bundleOffer ? (
                <TrackBundleCard
                  offer={bundleOffer}
                  onAdd={() => addTrackBundle(bundleOffer, cat.courses)}
                  inCart={items.some((x) => x.type === "bundle" && x.id === bundleOffer.id)}
                />
              ) : null}

              {/* Course grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {cat.courses.map(course => (
                  <CourseCard
                    key={course.id || course.title}
                    course={course}
                    onAddToCart={addCourseToCart}
                    inCart={items.some(
                      (x) =>
                        x.type === "course" &&
                        (x.id === course.id || x.id === catalogCartIdFromTitle(course.title))
                    )}
                  />
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