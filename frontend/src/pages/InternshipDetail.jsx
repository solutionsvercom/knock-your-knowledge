import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { CATEGORIES } from "@/data/courseCatalog";
import { DEMO_INTERNSHIPS } from "@/data/demoData";
import { slugifyTitle, getBlogBySlug } from "@/data/courseBlogs";
import {
  internshipFeeLabel,
  internshipPageForSlug,
  internshipUnitPrice,
} from "@/config/pricing";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useContactForm } from "@/lib/ContactFormContext";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  MapPin,
  ShoppingCart,
  Users,
} from "lucide-react";
import { format } from "date-fns";

const LOGO_FALLBACK =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80";

export default function InternshipDetail() {
  const { slug } = useParams();
  const meta = internshipPageForSlug(slug);
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
        <img src={item.image || LOGO_FALLBACK} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,8,23,0.4) 0%, #020817 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/Internships" className="inline-flex items-center gap-1.5 text-sm mb-5 hover:text-white" style={{ color: "#94a3b8" }}>
            <ArrowLeft className="w-4 h-4" /> All internships
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>
            {meta.navTitle}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {item.title}
          </h1>
          <p className="text-sm max-w-2xl mb-6" style={{ color: "#94a3b8" }}>
            {item.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                openContactForm({
                  internshipInterest: item.title,
                  source: "internship-apply",
                  heading: "Apply for internship",
                  description:
                    "Enter your name, phone, mail ID, and the internship course you want to enroll in. Our team will contact you soon.",
                })
              }
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

        {item.skills?.length ? (
          <div>
            <h2 className="text-lg font-bold text-white mb-3">Skills you will use</h2>
            <div className="flex flex-wrap gap-2">
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
          </div>
        ) : null}

        {category?.courses?.length ? (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Related courses</h2>
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
                    {course.image ? <img src={course.image} alt="" className="w-full h-28 object-cover" /> : null}
                    <div className="p-4">
                      <p className="text-sm font-semibold text-white">{course.title}</p>
                      {blog ? (
                        <Link
                          to={`/Blog/${courseSlug}`}
                          className="inline-flex items-center gap-1 text-xs mt-2 font-semibold"
                          style={{ color: "#a78bfa" }}
                        >
                          Know more <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
