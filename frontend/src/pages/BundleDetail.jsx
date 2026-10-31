import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Gift, ShoppingCart } from "lucide-react";
import { CATEGORIES, catalogCartIdFromTitle } from "@/data/courseCatalog";
import { slugifyTitle, getBlogBySlug } from "@/data/courseBlogs";
import { formatInr, retailOfferForSlug, retailOfferForTitle } from "@/config/pricing";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";

export default function BundleDetail() {
  const { slug } = useParams();
  const offer = retailOfferForSlug(slug);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const category = CATEGORIES.find((c) => c.id === offer?.categoryId);
  const courses = (category?.courses || []).filter((c) => offer?.titles?.includes(c.title));
  const solo = offer ? offer.courseFee * offer.titles.length : 0;
  const cover = courses[0]?.image || "";

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
        {cover ? <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" /> : null}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,8,23,0.45) 0%, #020817 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/Bundles" className="inline-flex items-center gap-1.5 text-sm mb-5 hover:text-white" style={{ color: "#94a3b8" }}>
            <ArrowLeft className="w-4 h-4" /> All bundles
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#fbbf24" }}>
            Bundle · {offer.titles.length} courses
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {offer.pageTitle}
          </h1>
          <p className="text-sm max-w-2xl mb-6" style={{ color: "#94a3b8" }}>
            {offer.names}. Buy the pack for {formatInr(offer.fee)} instead of {formatInr(solo)}.
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
        <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Included courses
        </h2>
        <div className="space-y-3">
          {courses.map((course) => {
            const slug = slugifyTitle(course.title);
            const blog = getBlogBySlug(slug);
            return (
              <div
                key={course.title}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {course.image ? (
                  <img src={course.image} alt="" className="w-full sm:w-28 h-24 object-cover rounded-xl flex-shrink-0" />
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold">{course.title}</p>
                  <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                    {formatInr(offer.courseFee)} if bought alone
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {blog ? (
                    <Link
                      to={`/Blog/${slug}`}
                      className="px-4 min-h-10 inline-flex items-center rounded-xl text-xs font-semibold"
                      style={{ color: "#e9d5ff", border: "1px solid rgba(167,139,250,0.35)" }}
                    >
                      Know more
                    </Link>
                  ) : null}
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

        <div
          className="mt-8 rounded-2xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <Gift className="w-8 h-8 mx-auto mb-3" style={{ color: "#fbbf24" }} />
          <p className="text-white font-semibold mb-1">Best value: the full pack</p>
          <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
            Save {formatInr(solo - offer.fee)} versus buying each course separately.
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
