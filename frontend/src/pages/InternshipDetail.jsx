import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { CATEGORIES } from "@/data/courseCatalog";
import { DEMO_INTERNSHIPS } from "@/data/demoData";
import { slugifyTitle, getBlogBySlug } from "@/data/courseBlogs";
import { INTERNSHIP_PAGE_COPY } from "@/data/internshipPageCopy";
import {
  formatInr,
  internshipFeeLabel,
  internshipPageForSlug,
  internshipUnitPrice,
  INTERNSHIP_PAGES,
  retailOfferForCategory,
  withGst,
} from "@/config/pricing";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useContactForm } from "@/lib/ContactFormContext";
import { INTERNSHIP_SEO } from "@/config/seo";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Gift,
  MapPin,
  ShoppingCart,
  Users,
} from "lucide-react";
import { format } from "date-fns";

const LOGO_FALLBACK =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80";

const typeStyles = {
  remote: { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" },
  hybrid: { background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" },
  onsite: { background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.25)" },
};

export default function InternshipDetail() {
  const { slug } = useParams();
  const meta = internshipPageForSlug(slug);
  const copy = INTERNSHIP_PAGE_COPY[slug] || null;
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const { openContactForm } = useContactForm();

  const { data: internshipsRaw, isLoading } = useQuery({
    queryKey: ["internships"],
    queryFn: () => api.internships.list(),
  });
  const internships = asArray(internshipsRaw);
  const item =
    internships.find((row) => row.id === meta?.id) ||
    DEMO_INTERNSHIPS.find((row) => row.id === meta?.id) ||
    null;
  const category = CATEGORIES.find((c) => c.id === meta?.categoryId);
  const bundleOffer = retailOfferForCategory(meta?.categoryId);
  const otherInternships = INTERNSHIP_PAGES.filter((p) => p.slug !== meta?.slug);
  const feeBase = item ? internshipUnitPrice(item) : 0;
  const tax = withGst(feeBase);

  const goCheckout = () => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      navigate(`/login?mode=signup&next=${encodeURIComponent("/Checkout")}`);
      return;
    }
    navigate("/Checkout");
  };

  const addInternshipToCart = () => {
    if (!item) return;
    addItem({
      type: "internship",
      id: item.id,
      title: item.title,
      price: internshipUnitPrice(item),
      thumbnail: item.image || item.company_logo || "",
    });
    goCheckout();
  };

  const openApplyForm = () => {
    if (!item) return;
    openContactForm({
      internshipInterest: item.title,
      source: "internship-apply",
      heading: "Apply for internship",
      description:
        slug === "development" || slug === "ai"
          ? "Enter your name, phone, mail ID, and the internship programme you want to apply for. Our team will contact you soon."
          : "Enter your name, phone, mail ID, and the internship course you want to enroll in. Our team will contact you soon.",
    });
  };

  if (!meta || (!isLoading && !item)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#020817" }}>
        <p className="text-white font-semibold">Internship not found</p>
        <Link to="/Internships" className="text-sm" style={{ color: "#a78bfa" }}>
          ← All internships
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <p className="text-slate-400">Loading internship…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div className="relative min-h-[18rem] overflow-hidden border-b" style={{ borderColor: "rgba(167,139,250,0.15)" }}>
        <img src={item.image || LOGO_FALLBACK} alt={`${meta.navTitle} programme`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,8,23,0.4) 0%, #020817 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/Internships" className="inline-flex items-center gap-1.5 text-sm mb-5 hover:text-white" style={{ color: "#94a3b8" }}>
            <ArrowLeft className="w-4 h-4" /> All internships
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>
            Internship program
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {slug === "development"
              ? INTERNSHIP_SEO.development.h1
              : slug === "ai"
                ? INTERNSHIP_SEO.ai.h1
                : meta.navTitle}
          </h1>
          {copy?.introHeading ? (
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {copy.introHeading}
            </h2>
          ) : null}
          <p className="text-sm max-w-2xl mb-6" style={{ color: "#94a3b8" }}>
            {copy?.overview || item.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openApplyForm}
              className="min-h-11 px-6 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                boxShadow: "0 0 16px rgba(37,99,235,0.35)",
              }}
            >
              Apply Now
            </button>
            <button
              type="button"
              onClick={addInternshipToCart}
              className="inline-flex items-center gap-2 min-h-11 px-6 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 0 16px rgba(124,58,237,0.35)",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="grid sm:grid-cols-2 gap-4 text-sm" style={{ color: "#94a3b8" }}>
          <p className="flex items-center gap-2">
            <Building2 className="w-4 h-4" /> {item.company}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {item.location}
          </p>
          {item.work_type ? (
            <p className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                style={typeStyles[item.work_type] || {}}
              >
                {item.work_type}
              </span>
              Working format
            </p>
          ) : null}
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {item.duration}
          </p>
          <p className="flex items-center gap-2 font-semibold" style={{ color: "#34d399" }}>
            Internship Fee: {internshipFeeLabel(item)}
          </p>
          {item.deadline ? (
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Apply by {format(new Date(item.deadline), "MMM d, yyyy")}
            </p>
          ) : null}
          <p className="flex items-center gap-2">
            <Users className="w-4 h-4" /> {item.applicants} applicants · {item.openings} openings
          </p>
        </div>

        {copy?.whoCanApply?.length ? (
          <section>
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Who can apply
            </h2>
            <ul className="space-y-2">
              {copy.whoCanApply.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm" style={{ color: "#94a3b8" }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#34d399" }} />
                  {line}
                </li>
              ))}
            </ul>
            <p className="text-xs mt-3" style={{ color: "#64748b" }}>
              KYK does not publish degree, age, or experience cut-offs for this programme on this site.
            </p>
          </section>
        ) : null}

        {item.skills?.length ? (
          <section>
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Skills this programme uses
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
            {copy?.skillsContext ? (
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                {copy.skillsContext}
              </p>
            ) : null}
          </section>
        ) : null}

        {copy?.covers?.length ? (
          <section>
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              What this programme covers
            </h2>
            <ul className="space-y-2">
              {copy.covers.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm" style={{ color: "#94a3b8" }}>
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#60a5fa" }} />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {copy?.durationNote ? (
          <section>
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Duration and working format
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              {copy.durationNote}
            </p>
          </section>
        ) : null}

        <section className="rounded-2xl p-5" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.22)" }}>
          <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Programme fee
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "#e2e8f0" }}>
            {copy?.feeNote ||
              `Internship fee ${formatInr(feeBase)} plus 18% GST at checkout. This is a fee you pay — not a stipend.`}
          </p>
          <dl className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <dt style={{ color: "#94a3b8" }}>Fee</dt>
              <dd className="text-white font-semibold">{formatInr(tax.base)}</dd>
            </div>
            <div>
              <dt style={{ color: "#94a3b8" }}>GST (18%)</dt>
              <dd className="text-white font-semibold">{formatInr(tax.gst)}</dd>
            </div>
            <div>
              <dt style={{ color: "#94a3b8" }}>Payable at checkout</dt>
              <dd className="text-white font-semibold">{formatInr(tax.total)}</dd>
            </div>
          </dl>
          <p className="text-xs mt-3" style={{ color: "#64748b" }}>
            If a coupon applies, GST is calculated on the discounted taxable amount. Retail course bundles use a different price and are not this internship.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            How to apply
          </h2>
          {copy?.applyIntro ? (
            <p className="text-sm mb-3" style={{ color: "#94a3b8" }}>
              {copy.applyIntro}
            </p>
          ) : null}
          <ol className="space-y-2 text-sm list-decimal pl-5" style={{ color: "#94a3b8" }}>
            <li>
              <strong className="text-white">Apply Now</strong> — send your name, phone, mail ID, and this internship. KYK saves the form and contacts you.
            </li>
            <li>
              <strong className="text-white">Add to cart</strong> — sign in if needed, then pay the programme fee plus 18% GST at checkout.
            </li>
          </ol>
        </section>

        {copy?.mentoring ? (
          <section>
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Mentoring and live sessions
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
              {copy.mentoring}{" "}
              <Link to="/LiveClasses" className="font-semibold" style={{ color: "#a78bfa" }}>
                Open Live Classes
              </Link>
              .
            </p>
          </section>
        ) : null}

        {copy?.faqs?.length ? (
          <section>
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
                    {slug === "development" || slug === "ai" ? <strong>{faq.q}</strong> : faq.q}
                  </summary>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: "#94a3b8" }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {category?.courses?.length ? (
          <section>
            <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Related courses
            </h2>
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
              These are individual courses on the same track. Each has its own fee. They are not this internship.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {category.courses.map((course) => {
                const courseSlug = slugifyTitle(course.title);
                const blog = getBlogBySlug(courseSlug);
                return (
                  <div
                    key={course.title}
                    className="rounded-xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {course.image ? (
                      <img src={course.image} alt={`${course.title} course`} className="w-full h-28 object-cover" />
                    ) : null}
                    <div className="p-4">
                      {blog ? (
                        <Link to={`/Blog/${courseSlug}`} className="text-sm font-semibold text-white hover:text-violet-200">
                          {course.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-semibold text-white">{course.title}</p>
                      )}
                      {course.shortDesc ? (
                        <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                          {course.shortDesc}
                        </p>
                      ) : null}
                      <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                        {course.duration || ""}
                        {course.level ? ` · ${course.level}` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {bundleOffer ? (
          <Link
            to={`/Bundles/${bundleOffer.slug}`}
            className="flex items-start gap-4 rounded-2xl p-5 transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(124,58,237,0.12))",
              border: "1px solid rgba(251,191,36,0.28)",
            }}
          >
            <Gift className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#fbbf24" }} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#fbbf24" }}>
                Related course bundle
              </p>
              <p className="text-sm font-bold text-white">{bundleOffer.pageTitle}</p>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                {bundleOffer.names}. Pack {formatInr(bundleOffer.fee)} instead of{" "}
                {formatInr(bundleOffer.courseFee * bundleOffer.titles.length)}. This bundle is not the internship.
              </p>
            </div>
          </Link>
        ) : null}

        {otherInternships.length ? (
          <section>
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Other KYK internships
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherInternships.map((p) => (
                <Link
                  key={p.slug}
                  to={`/Internships/${p.slug}`}
                  className="px-3 py-2 rounded-xl text-xs font-semibold"
                  style={{ color: "#e9d5ff", border: "1px solid rgba(167,139,250,0.35)" }}
                >
                  {p.navTitle}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <p className="text-white font-semibold mb-1">{copy?.ctaTitle || "Apply for this internship"}</p>
          <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
            {copy?.ctaBody || `Programme fee ${internshipFeeLabel(item)}. This is not a stipend.`}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={openApplyForm}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}
            >
              Apply Now
            </button>
            <button
              type="button"
              onClick={addInternshipToCart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to cart · {formatInr(feeBase)} + GST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
