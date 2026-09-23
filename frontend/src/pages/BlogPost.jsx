import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogBySlug, getRelatedBlogs, isCareerGuide } from "@/data/courseBlogs";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { INTERNSHIP_FEE_AMOUNT, internshipUnitPrice } from "@/config/pricing";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Clock,
  User,
  Star,
  CheckCircle2,
  BookOpen,
  ShoppingCart,
} from "lucide-react";

const INTERNSHIP_BY_CATEGORY = {
  development: { id: "intern-development", title: "Development" },
  ai: { id: "intern-ai-prompt", title: "AI & Prompt Engineering" },
  analytics: { id: "intern-business-analytics", title: "Business Analytics" },
  marketing: { id: "intern-digital-marketing", title: "Advanced Digital Marketing" },
};

function internshipForGuide(post, internships) {
  const fallback = INTERNSHIP_BY_CATEGORY[post.categoryId];
  if (fallback) {
    const match = internships.find(
      (item) =>
        item.id === fallback.id ||
        String(item.title || "").toLowerCase() === fallback.title.toLowerCase()
    );
    if (match) return match;
    return { ...fallback, price: INTERNSHIP_FEE_AMOUNT, image: post.image };
  }
  return internships.find((item) => !item.demo) || internships[0] || null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);
  const related = getRelatedBlogs(slug, 3);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const { data: internshipsRaw } = useQuery({
    queryKey: ["internships"],
    queryFn: () => api.internships.list(),
    enabled: Boolean(post),
  });
  const internships = asArray(internshipsRaw);

  const addGuideToCart = () => {
    if (!post) return;
    const program = internshipForGuide(post, internships);
    if (program?.id) {
      addItem({
        type: "internship",
        id: program.id,
        title: program.title,
        price: internshipUnitPrice(program),
        thumbnail: program.image || program.company_logo || post.image || "",
      });
    }

    if (isLoadingAuth) return;

    if (!isAuthenticated) {
      navigate(`/login?mode=signup&next=${encodeURIComponent("/Checkout")}`);
      return;
    }

    navigate("/Checkout");
  };

  const careerGuide = isCareerGuide(post);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: "#020817" }}>
        <BookOpen className="w-10 h-10" style={{ color: "#475569" }} />
        <p className="text-white font-semibold">Article not found</p>
        <Link to={createPageUrl("Blog")} className="text-sm" style={{ color: "#a78bfa" }}>
          ← Back to Career Guide
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden border-b" style={{ borderColor: "rgba(167,139,250,0.15)" }}>
        <img src={post.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,8,23,0.3) 0%, #020817 100%)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
            <Link
              to={createPageUrl(careerGuide ? "Blog" : "Courses")}
              className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors hover:text-white"
              style={{ color: "#94a3b8" }}
            >
              <ArrowLeft className="w-4 h-4" /> {careerGuide ? "All career guides" : "Internship Courses"}
            </Link>
            <span
              className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
              style={{
                background: "rgba(167,139,250,0.15)",
                color: post.iconColor || "#a78bfa",
                border: "1px solid rgba(167,139,250,0.3)",
              }}
            >
              {post.category}
            </span>
            <h1
              className="text-3xl sm:text-4xl font-black text-white leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs" style={{ color: "#94a3b8" }}>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {post.instructor}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.readMins} min read
              </span>
              {post.level ? <span>{post.level}</span> : null}
              {post.duration && post.duration !== "Guide" ? <span>{post.duration}</span> : null}
              {post.rating ? (
                <span className="flex items-center gap-1" style={{ color: "#fbbf24" }}>
                  <Star className="w-3.5 h-3.5 fill-yellow-400" /> {post.rating}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-base leading-relaxed mb-8" style={{ color: "#94a3b8" }}>
          {post.intro}
        </p>

        <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Why this matters
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#64748b" }}>
          {post.whyLearn}
        </p>

        <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Who it&apos;s for
        </h2>
        <ul className="space-y-2 mb-8">
          {post.whoFor?.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#64748b" }}>
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#34d399" }} />
              {item}
            </li>
          ))}
        </ul>

        {post.modules?.length ? (
          <>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What you&apos;ll cover
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {post.modules.map((m, i) => (
                <div
                  key={typeof m === "string" ? m : m.title}
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                >
                  <span className="text-xs font-semibold mr-2" style={{ color: "#a78bfa" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {typeof m === "string" ? m : m.title}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {post.outcomes?.length ? (
          <>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Outcomes
            </h2>
            <ul className="space-y-2 mb-8">
              {post.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm" style={{ color: "#64748b" }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#60a5fa" }} />
                  {o}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {post.tags?.length ? (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#64748b",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="rounded-2xl p-6 text-center mb-14"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <p className="text-white font-semibold mb-2">Ready to start this journey?</p>
          <p className="text-sm mb-5" style={{ color: "#94a3b8" }}>
            Add this internship course to your cart and continue to checkout.
          </p>
          <button
            type="button"
            onClick={addGuideToCart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.35)",
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
        </div>

        {related.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Related guides
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/Blog/${r.slug}`}
                  className="rounded-xl overflow-hidden transition-all hover:translate-y-[-2px]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <img src={r.image} alt="" className="w-full h-24 object-cover" loading="lazy" />
                  <div className="p-3">
                    <p className="text-xs font-semibold line-clamp-2 text-white">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
}
