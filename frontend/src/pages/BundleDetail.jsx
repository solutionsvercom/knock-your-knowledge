import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Gift, ShoppingCart } from "lucide-react";
import { CATEGORIES, catalogCartIdFromTitle } from "@/data/courseCatalog";
import { slugifyTitle, getBlogBySlug } from "@/data/courseBlogs";
import { BUNDLE_PAGE_COPY } from "@/data/bundlePageCopy";
import { formatInr, retailOfferForSlug, retailOfferForTitle, RETAIL_BUNDLES } from "@/config/pricing";
import { BUNDLE_SEO } from "@/config/seo";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";

export default function BundleDetail() {
  const { slug } = useParams();
  const offer = retailOfferForSlug(slug);
  const copy = BUNDLE_PAGE_COPY[slug] || null;
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const category = CATEGORIES.find((c) => c.id === offer?.categoryId);
  const courses = (category?.courses || []).filter((c) => offer?.titles?.includes(c.title));
  const solo = offer ? offer.courseFee * offer.titles.length : 0;
  const saved = offer ? solo - offer.fee : 0;
  const cover = courses[0]?.image || "";
  const otherBundles = RETAIL_BUNDLES.filter((b) => b.slug !== offer?.slug);

  const goCheckout = () => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      navigate(`/login?mode=signup&next=${encodeURIComponent("/Checkout")}`);
      return;
    }
    navigate("/Checkout");
  };

  const addBundle = () => {
    if (!offer) return;
    addItem(
      {
        type: "bundle",
        id: offer.id,
        title: offer.cartTitle,
        price: offer.fee,
        thumbnail: cover,
      },
      {
        remove: offer.titles.map((title) => ({
          type: "course",
          id: catalogCartIdFromTitle(title),
        })),
      }
    );
    goCheckout();
  };

  const addCourse = (course) => {
    const priceOffer = retailOfferForTitle(course.title);
    addItem({
      type: "course",
      id: catalogCartIdFromTitle(course.title),
      title: course.title,
      price: priceOffer?.courseFee ?? (Number(course.price) || 0),
      thumbnail: course.image || "",
    });
    goCheckout();
  };

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#020817" }}>
        <p className="text-white font-semibold">Bundle not found</p>
        <Link to="/Bundles" className="text-sm" style={{ color: "#a78bfa" }}>
          ← All bundles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div className="relative min-h-[18rem] overflow-hidden border-b" style={{ borderColor: "rgba(167,139,250,0.15)" }}>
        {cover ? <img src={cover} alt={`${offer.pageTitle} cover`} className="absolute inset-0 w-full h-full object-cover" /> : null}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,8,23,0.45) 0%, #020817 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/Bundles" className="inline-flex items-center gap-1.5 text-sm mb-5 hover:text-white" style={{ color: "#94a3b8" }}>
            <ArrowLeft className="w-4 h-4" /> All bundles
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#fbbf24" }}>
            Bundle · {offer.titles.length} courses
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {slug === "development"
              ? BUNDLE_SEO.development.h1
              : slug === "ai"
                ? BUNDLE_SEO.ai.h1
                : slug === "analytics"
                  ? BUNDLE_SEO.analytics.h1
                  : offer.pageTitle}
          </h1>
          {copy?.introHeading ? (
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {copy.introHeading}
            </h2>
          ) : null}
          <p className="text-sm max-w-2xl mb-6" style={{ color: "#94a3b8" }}>
            {copy?.intro || `${offer.names}. Buy the pack for ${formatInr(offer.fee)} instead of ${formatInr(solo)}.`}
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="text-3xl font-black text-white">{formatInr(offer.fee)}</p>
              <p className="text-xs line-through" style={{ color: "#64748b" }}>
                {formatInr(solo)}
              </p>
            </div>
            <button
              type="button"
              onClick={addBundle}
              className="inline-flex items-center gap-2 min-h-11 px-6 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 0 16px rgba(124,58,237,0.35)",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add bundle to cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {copy?.whoFor?.length ? (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Who should choose this bundle
            </h2>
            <ul className="space-y-2">
              {copy.whoFor.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#94a3b8" }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#34d399" }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {copy?.together ? (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What these courses teach together
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              {copy.together}
            </p>
          </section>
        ) : null}

        {copy?.skills?.length ? (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Skills you can develop
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {copy.skills.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#94a3b8" }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#60a5fa" }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-10 rounded-2xl p-5" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.22)" }}>
          <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Bundle savings
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#e2e8f0" }}>
            {copy?.savingsNote ||
              `Buy the pack for ${formatInr(offer.fee)} instead of ${formatInr(solo)}. Save ${formatInr(saved)} versus buying each course separately.`}
          </p>
        </section>

        <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Included courses
        </h2>
        <div className="space-y-3">
          {courses.map((course) => {
            const courseSlug = slugifyTitle(course.title);
            const blog = getBlogBySlug(courseSlug);
            return (
              <div
                key={course.title}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {course.image ? (
                  <img src={course.image} alt={`${course.title} course`} className="w-full sm:w-28 h-24 object-cover rounded-xl flex-shrink-0" />
                ) : null}
                <div className="flex-1 min-w-0">
                  {blog ? (
                    <Link to={`/Blog/${courseSlug}`} className="text-white font-semibold hover:text-violet-200">
                      {course.title}
                    </Link>
                  ) : (
                    <p className="text-white font-semibold">{course.title}</p>
                  )}
                  {course.shortDesc ? (
                    <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                      {course.shortDesc}
                    </p>
                  ) : null}
                  <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                    {formatInr(offer.courseFee)} if bought alone
                    {course.duration ? ` · ${course.duration}` : ""}
                    {course.level ? ` · ${course.level}` : ""}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => addCourse(course)}
                    className="px-4 min-h-10 inline-flex items-center rounded-xl text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    Add course
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {copy?.faqs?.length ? (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Frequently asked questions
            </h2>
            <div className="space-y-2">
              {copy.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="rounded-xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <summary className="text-sm font-semibold text-white cursor-pointer">
                    {slug === "development" || slug === "ai" || slug === "analytics" ? (
                      <strong
                        className="text-sm font-semibold text-white"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {faq.q}
                      </strong>
                    ) : (
                      faq.q
                    )}
                  </summary>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: "#94a3b8" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {copy?.internshipSlug ? (
          <p className="text-sm mt-8" style={{ color: "#94a3b8" }}>
            Looking for the program, not the course pack?{" "}
            <Link to={`/Internships/${copy.internshipSlug}`} className="font-semibold" style={{ color: "#a78bfa" }}>
              {copy.internshipLabel}
            </Link>
          </p>
        ) : null}

        {otherBundles.length ? (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Other KYK bundles
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherBundles.map((b) => (
                <Link
                  key={b.slug}
                  to={`/Bundles/${b.slug}`}
                  className="px-3 py-2 rounded-xl text-xs font-semibold"
                  style={{ color: "#e9d5ff", border: "1px solid rgba(167,139,250,0.35)" }}
                >
                  {b.pageTitle}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div
          className="mt-8 rounded-2xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <Gift className="w-8 h-8 mx-auto mb-3" style={{ color: "#fbbf24" }} />
          <p className="text-white font-semibold mb-1">{copy?.ctaTitle || "Best value: the full pack"}</p>
          <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
            {copy?.ctaBody || `Save ${formatInr(saved)} versus buying each course separately.`}
          </p>
          <button
            type="button"
            onClick={addBundle}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Add bundle · {formatInr(offer.fee)}
          </button>
        </div>
      </div>
    </div>
  );
}
