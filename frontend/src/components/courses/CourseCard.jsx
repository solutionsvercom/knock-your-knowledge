import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Clock, Users, Star } from "lucide-react";

const levelStyles = {
  beginner: { background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" },
  intermediate: { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" },
  advanced: { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
};

export default function CourseCard({ course }) {
  return (
    <Link
      to={createPageUrl(`CourseDetail?id=${course.id}`)}
      className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(96,165,250,0.35)";
        e.currentTarget.style.boxShadow = "0 0 40px rgba(96,165,250,0.1), 0 20px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 sm:h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500 max-w-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {course.level && (
          <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={levelStyles[course.level] || {}}>
            {course.level}
          </span>
        )}
      </div>

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider capitalize mb-2" style={{ color: "#60a5fa" }}>
          {course.category}
        </p>
        <h3 className="text-base font-bold text-white mb-1 line-clamp-2 transition-colors group-hover:text-blue-300"
          style={{ fontFamily: "'Poppins', sans-serif" }}>
          {course.title}
        </h3>
        <p className="text-sm mb-4" style={{ color: "#475569" }}>By {course.instructor}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs mb-5" style={{ color: "#334155" }}>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration_hours}h</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students_count?.toLocaleString()}</span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{course.rating}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>${course.price}</span>
            <span className="text-sm line-through" style={{ color: "#1e293b" }}>${course.original_price}</span>
          </div>
          <button className="h-8 px-4 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }}>
            Enroll
          </button>
        </div>
      </div>
    </Link>
  );
}