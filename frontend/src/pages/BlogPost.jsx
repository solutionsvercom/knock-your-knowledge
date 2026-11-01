import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogBySlug, getRelatedBlogs, isCareerGuide } from "@/data/courseBlogs";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import {
  INTERNSHIP_FEE_AMOUNT,
  internshipPageForSlug,
  internshipUnitPrice,
  retailOfferForCategory,
  formatInr,
} from "@/config/pricing";
import { courseHref, courseImgAlt } from "@/lib/internalSeo";
import { seoForPath } from "@/config/seo";
import { catalogCourseProduct } from "@/data/courseVideos";
import BlogCourseHeroCard from "@/components/blog/BlogCourseHeroCard";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Clock,
  User,
  Star,
  CheckCircle2,
  BookOpen,
  ShoppingCart,
  Gift,
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

  const goCheckout = () => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      navigate(`/login?mode=signup&next=${encodeURIComponent("/Checkout")}`);
      return;
    }
    navigate("/Checkout");
  };

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
    goCheckout();
  };

  const enrollThisCourse = () => {
    const product = catalogCourseProduct(post);
    if (!product) return;
    addItem(product);
    goCheckout();
  };

  const careerGuide = isCareerGuide(post);
  const courseProduct = catalogCourseProduct(post);
  const bundleOffer = !careerGuide && post ? retailOfferForCategory(post.categoryId) : null;
  const internshipPage = bundleOffer ? internshipPageForSlug(bundleOffer.slug) : null;

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

  const pageSeo = seoForPath(`/Blog/${slug}`);
  const pageHeading = pageSeo.h1 || post.title;

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div className="relative min-h-[14rem] sm:min-h-[18rem] lg:min-h-[22rem] overflow-hidden border-b" style={{ borderColor: "rgba(167,139,250,0.15)" }}>
        <img
          src={post.image}
          alt={careerGuide ? `${post.title} guide` : courseImgAlt(post.title)}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,8,23,0.3) 0%, #020817 100%)" }} />
        <div className="relative flex items-end">
          <div className={`${careerGuide ? "max-w-3xl" : "max-w-6xl"} mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row lg:items-end gap-6`}>
            <div className="flex-1 min-w-0">
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
              {pageHeading}
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
            {!careerGuide && courseProduct ? (
              <BlogCourseHeroCard
                post={post}
                onEnroll={enrollThisCourse}
                feeItem={courseProduct}
                titleAs={
                  slug === "smm-social-media-marketing" ||
                  slug === "seo-search-engine-optimization" ||
                  slug === "sem-search-engine-marketing" ||
                  slug === "smo-social-media-optimization" ||
                  slug === "google-webmaster-search-console" ||
                  slug === "ai-tools-in-digital-marketing" ||
                  slug === "8-best-ai-tools-for-productivity" ||
                  slug === "prompt-engineering"
                    ? "p"
                    : "h2"
                }
              />
            ) : null}
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {post.introHeading ? (
          <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {post.introHeading}
          </h2>
        ) : null}
        <p className="text-base leading-relaxed mb-8" style={{ color: "#94a3b8" }}>
          {post.intro}
        </p>
        {post.trackLinks?.length ? (
          <p className="text-sm leading-relaxed mb-8" style={{ color: "#94a3b8" }}>
            {post.trackLinks.map((part, i) =>
              part.to ? (
                <Link
                  key={`${part.to}-${i}`}
                  to={part.to}
                  className="font-semibold hover:text-white"
                  style={{ color: "#c4b5fd" }}
                >
                  {part.text}
                </Link>
              ) : (
                <span key={`t-${i}`}>{part.text}</span>
              )
            )}
          </p>
        ) : null}

        {careerGuide && (post.relatedCourseTitles?.length || post.relatedInternshipSlugs?.length) ? (
          <p className="text-sm leading-relaxed mb-8" style={{ color: "#94a3b8" }}>
            {post.relatedCourseTitles?.length ? (
              <>
                Useful KYK courses include{" "}
                {post.relatedCourseTitles.map((title, i, arr) => {
                  const href = courseHref(title);
                  const sep = i === arr.length - 1 ? ". " : i === arr.length - 2 ? ", and " : ", ";
                  return (
                    <span key={title}>
                      {href ? (
                        <Link to={href} className="font-semibold hover:text-white" style={{ color: "#c4b5fd" }}>
                          {title}
                        </Link>
                      ) : (
                        title
                      )}
                      {sep}
                    </span>
                  );
                })}
              </>
            ) : null}
            {post.relatedInternshipSlugs?.length ? (
              <>
                Matching programmes are the{" "}
                {post.relatedInternshipSlugs.map((slug, i, arr) => {
                  const page = internshipPageForSlug(slug);
                  if (!page) return null;
                  const sep = i === arr.length - 1 ? "." : i === arr.length - 2 ? ", and " : ", ";
                  return (
                    <span key={slug}>
                      <Link
                        to={`/Internships/${page.slug}`}
                        className="font-semibold hover:text-white"
                        style={{ color: "#c4b5fd" }}
                      >
                        {page.navTitle}
                      </Link>
                      {sep}
                    </span>
                  );
                })}{" "}
                Course packs for those tracks are on the{" "}
                <Link to="/Bundles" className="font-semibold hover:text-white" style={{ color: "#c4b5fd" }}>
                  course bundles
                </Link>{" "}
                page.
              </>
            ) : null}
          </p>
        ) : null}

        <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {careerGuide ? "Why this matters" : "Why this course matters"}
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#64748b" }}>
          {post.whyLearn}
        </p>

        {post.whoFor?.length ? (
          <>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {careerGuide ? "Who it's for" : "Who should enrol"}
            </h2>
            <ul className="space-y-2 mb-8">
              {post.whoFor.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#64748b" }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#34d399" }} />
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {post.topicDetails?.length ? (
          <>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What you&apos;ll cover
            </h2>
            <div className="space-y-3 mb-8">
              {post.topicDetails.map((topic, i) => (
                <div
                  key={topic.title}
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-1">
                    <span className="text-xs font-semibold mr-2" style={{ color: "#a78bfa" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {topic.title}
                  </p>
                  {topic.body ? (
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                      {topic.body}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : post.modules?.length ? (
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
              What you will be able to do
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

        {!careerGuide && (post.tools?.length || post.projects?.length) ? (
          <div className="mb-8">
            {post.tools?.length ? (
              <>
                <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Tools and technologies
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#94a3b8",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
            {post.projects?.length ? (
              <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                Catalog projects: {post.projects.join(" · ")}
              </p>
            ) : null}
          </div>
        ) : post.tags?.length ? (
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

        {post.faqs?.length ? (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Frequently asked questions
            </h2>
            <div className="space-y-2">
              {post.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <summary className="text-sm font-semibold text-white cursor-pointer">
                    {slug === "smm-social-media-marketing" ||
                    slug === "seo-search-engine-optimization" ||
                    slug === "sem-search-engine-marketing" ||
                    slug === "smo-social-media-optimization" ||
                    slug === "google-webmaster-search-console" ||
                    slug === "ai-tools-in-digital-marketing" ||
                    slug === "8-best-ai-tools-for-productivity" ||
                    slug === "prompt-engineering" ? (
                      <h3
                        className="text-sm font-semibold text-white inline"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {faq.q}
                      </h3>
                    ) : (
                      faq.q
                    )}
                  </summary>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: "#64748b" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ) : null}

        {bundleOffer ? (
          <Link
            to={`/Bundles/${bundleOffer.slug}`}
            className="flex items-start gap-4 rounded-2xl p-5 mb-8 transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(124,58,237,0.12))",
              border: "1px solid rgba(251,191,36,0.28)",
            }}
          >
            <Gift className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#fbbf24" }} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>
                Save with a bundle
              </p>
              <p className="text-sm font-bold text-white">{bundleOffer.pageTitle}</p>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                {bundleOffer.names}. Full pack {formatInr(bundleOffer.fee)} instead of {formatInr(bundleOffer.courseFee * bundleOffer.titles.length)}.
              </p>
            </div>
          </Link>
        ) : null}

        <div
          className="rounded-2xl p-6 text-center mb-14"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <p className="text-white font-semibold mb-2">
            {careerGuide ? "Ready to start this journey?" : "Related internship program"}
          </p>
          <p className="text-sm mb-5" style={{ color: "#94a3b8" }}>
            {careerGuide
              ? "Add the related internship program to your cart and continue to checkout."
              : "This page is the individual course. Enroll now above adds the course. The button below adds the related track internship — a separate product with its own fee."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {internshipPage ? (
              <Link
                to={`/Internships/${internshipPage.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                style={{ color: "#e9d5ff", border: "1px solid rgba(167,139,250,0.4)" }}
              >
                {internshipPage.navTitle}
              </Link>
            ) : null}
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
              Add internship to cart
            </button>
          </div>
        </div>

        {related.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {related.some((r) => !isCareerGuide(r)) ? "Related courses" : "Related guides"}
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
                  <img
                    src={r.image}
                    alt={isCareerGuide(r) ? `${r.title} guide` : courseImgAlt(r.title)}
                    className="w-full h-24 object-cover"
                    loading="lazy"
                  />
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
