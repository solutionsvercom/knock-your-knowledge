import React from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

export default function LessonInfo({ lesson, lessons, onSelect }) {
  const idx = lessons.findIndex(l => l.id === lesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const completed = lessons.filter(l => l.completed).length;
  const pct = Math.round((completed / lessons.length) * 100);

  return (
    <div className="flex-1 px-6 py-6 space-y-6">
      {/* Lesson title + badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>
              Lesson {idx + 1} of {lessons.length}
            </span>
            {lesson.completed && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{lesson.title}</h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <BookOpen className="w-4 h-4" style={{ color: "#a78bfa" }} /> Course Progress
          </span>
          <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>{pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }} />
        </div>
        <p className="text-xs mt-2" style={{ color: "#334155" }}>{completed} of {lessons.length} lessons completed</p>
      </div>

      {/* Description */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>About This Lesson</h3>
        <p className="text-sm leading-relaxed" style={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}>{lesson.description}</p>
      </div>

      {/* Prev / Next */}
      <div className="flex gap-4">
        {prev ? (
          <button onClick={() => onSelect(prev)}
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <ChevronLeft className="w-4 h-4 flex-shrink-0" style={{ color: "#475569" }} />
            <div className="text-left">
              <p className="text-xs" style={{ color: "#334155" }}>Previous</p>
              <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{prev.title}</p>
            </div>
          </button>
        ) : <div className="flex-1" />}
        {next && (
          <button onClick={() => onSelect(next)}
            className="flex-1 flex items-center justify-end gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(167,139,250,0.25)" }}>
            <div className="text-right">
              <p className="text-xs" style={{ color: "#a78bfa" }}>Next Lesson</p>
              <p className="text-sm font-medium text-white truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{next.title}</p>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#a78bfa" }} />
          </button>
        )}
      </div>
    </div>
  );
}