import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogBySlug, isCareerGuide } from "@/data/courseBlogs";
import {
  catalogCourseProduct,
  flattenCurriculumLessons,
  getCourseCurriculum,
} from "@/data/courseVideos";
import { fetchCloudinaryStatus } from "@/config/cloudinary";
import { courseFeeLabel } from "@/config/pricing";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

export default function CourseVideos() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const { data: cloud } = useQuery({
    queryKey: ["cloudinary-status"],
    queryFn: fetchCloudinaryStatus,
  });

  const curriculum = getCourseCurriculum(slug, cloud?.cloudName);
  const lessons = flattenCurriculumLessons(curriculum);
  const product = catalogCourseProduct(post);
  const careerGuide = isCareerGuide(post);

  const enroll = () => {
    if (!product) return;
    addItem(product);
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      navigate(`/login?mode=signup&next=${encodeURIComponent("/Checkout")}`);
      return;
    }
    navigate("/Checkout");
  };

  if (!post || careerGuide || !curriculum) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: "#020817" }}>
        <p className="text-white font-semibold">Course videos not found</p>
        <Link to="/Courses" className="text-sm" style={{ color: "#a78bfa" }}>
          ← Internship Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div
        className="relative overflow-hidden border-b"
        style={{ borderColor: "rgba(167,139,250,0.15)" }}
      >
        <img src={post.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,8,23,0.55) 0%, #020817 100%)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to={`/Blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm mb-5 hover:text-white"
            style={{ color: "#94a3b8" }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to {post.title}
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>
            {post.category} · 5 topics · 20 videos
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {post.title} videos
          </h1>
          <p className="text-sm max-w-2xl mb-6" style={{ color: "#94a3b8" }}>
            Twenty lessons across five topics. Enroll in this course on its own — same checkout as internships.
            Videos play here once they are uploaded to Cloudinary.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={enroll}
              className="inline-flex items-center gap-2 min-h-11 px-5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 0 16px rgba(124,58,237,0.35)",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Enroll now · {courseFeeLabel(product)}
            </button>
            <span
              className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#c4b5fd" }} />
              {cloud?.ready ? "Cloudinary connected — add files with the listed public IDs" : "Cloudinary pending — curriculum is ready for your videos"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {curriculum.topics.map((topic, ti) => (
          <section
            key={topic.id}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="px-5 py-4 flex items-center gap-3" style={{ background: "rgba(124,58,237,0.08)" }}>
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd" }}
              >
                {String(ti + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">{topic.title}</h2>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  4 videos in this topic
                </p>
              </div>
            </div>
            <ul className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {topic.videos.map((video) => (
                <li key={video.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: video.ready ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    {video.ready ? (
                      <PlayCircle className="w-4 h-4" style={{ color: "#a78bfa" }} />
                    ) : (
                      <Lock className="w-3.5 h-3.5" style={{ color: "#475569" }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">{video.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#475569" }}>
                      {video.publicId}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: "#64748b" }}>
                    <Clock className="w-3 h-3" /> {video.durationMins} min
                  </span>
                  {video.isFreePreview ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ color: "#34d399", background: "rgba(52,211,153,0.1)" }}>
                      Preview
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <p className="text-white font-semibold mb-1">{lessons.length} videos ready to attach</p>
          <p className="text-sm mb-5" style={{ color: "#94a3b8" }}>
            Enroll in {post.title} separately — you do not need the full internship track.
          </p>
          <button
            type="button"
            onClick={enroll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Enroll now
          </button>
        </div>
      </div>
    </div>
  );
}
