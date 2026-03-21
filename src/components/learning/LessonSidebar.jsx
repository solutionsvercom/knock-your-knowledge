import React from "react";
import { CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";

export default function LessonSidebar({ lessons, activeLesson, onSelect }) {
  return (
    <div className="w-72 flex-shrink-0 flex flex-col border-r overflow-y-auto"
      style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Course Content</p>
        <p className="text-sm font-bold text-white mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {lessons.length} Lessons
        </p>
      </div>

      <div className="flex-1 py-2">
        {lessons.map((lesson, i) => {
          const isActive = lesson.id === activeLesson.id;
          return (
            <button key={lesson.id} onClick={() => onSelect(lesson)}
              className="w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all duration-200 relative"
              style={{
                background: isActive ? "rgba(124,58,237,0.12)" : "transparent",
                borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {/* Status icon */}
              <div className="mt-0.5 flex-shrink-0">
                {lesson.completed ? (
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#34d399" }} />
                ) : isActive ? (
                  <PlayCircle className="w-4 h-4" style={{ color: "#a78bfa" }} />
                ) : (
                  <Circle className="w-4 h-4" style={{ color: "#1e293b" }} />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-0.5" style={{ color: "#334155" }}>Lesson {i + 1}</p>
                <p className="text-sm font-medium leading-snug"
                  style={{
                    color: isActive ? "#e2e8f0" : lesson.completed ? "#64748b" : "#475569",
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  {lesson.title}
                </p>
                <span className="flex items-center gap-1 mt-1 text-xs" style={{ color: "#1e293b" }}>
                  <Clock className="w-3 h-3" />{lesson.duration}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}