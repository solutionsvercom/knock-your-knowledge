import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { BookOpen, Users, Star, DollarSign, Pencil, Trash2, ChevronRight, Clock } from "lucide-react";

const categoryColors = {
  programming: "#60a5fa", "data science": "#a78bfa", design: "#f472b6",
  marketing: "#fb923c", business: "#34d399"
};
const levelColors = { beginner: "#34d399", intermediate: "#fbbf24", advanced: "#f87171" };

export default function CourseList({ courses, enrollments, onEdit, onManage }) {
  const qc = useQueryClient();
  const [confirm, setConfirm] = useState(null);

  const deleteCourse = useMutation({
    mutationFn: (id) => api.courses.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-courses"] });
      qc.invalidateQueries({ queryKey: ["t-courses"] });
      qc.invalidateQueries({ queryKey: ["catalog-courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course"] });
      setConfirm(null);
    }
  });

  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: "#1e293b" }} />
        <p className="text-base font-semibold text-white mb-1">No courses yet</p>
        <p className="text-sm" style={{ color: "#334155" }}>Create your first course to get started</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {courses.map(c => {
        const enrolled = enrollments.filter(e => e.course_id === c.id).length;
        return (
          <div key={c.id} className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Top color bar */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${categoryColors[c.category] || "#a78bfa"}, ${categoryColors[c.category] || "#a78bfa"}80)` }} />

            <div className="p-5">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ background: `${categoryColors[c.category] || "#a78bfa"}18`, color: categoryColors[c.category] || "#a78bfa" }}>
                  {c.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ background: `${levelColors[c.level] || "#fbbf24"}18`, color: levelColors[c.level] || "#fbbf24" }}>
                  {c.level}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{c.title}</h3>
              <p className="text-xs mb-3 line-clamp-2" style={{ color: "#475569" }}>{c.short_description || c.description}</p>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                  {c.instructor?.[0] || "?"}
                </div>
                <span className="text-xs" style={{ color: "#64748b" }}>{c.instructor}</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { icon: Users, value: enrolled, label: "enrolled", color: "#60a5fa" },
                  { icon: BookOpen, value: c.lessons_count || 0, label: "lessons", color: "#a78bfa" },
                  { icon: Clock, value: c.duration_hours ? `${c.duration_hours}h` : "—", label: "hours", color: "#06b6d4" },
                  { icon: DollarSign, value: `$${c.price || 0}`, label: "price", color: "#34d399" },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="text-center rounded-xl py-2"
                      style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
                      <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs" style={{ color: "#334155" }}>{s.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button onClick={() => onManage(c)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 12px rgba(124,58,237,0.25)" }}>
                  Manage <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={() => onEdit(c)}
                  className="p-2 rounded-xl transition-all hover:scale-110"
                  style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa" }}>
                  <Pencil className="w-4 h-4" />
                </button>
                {confirm === c.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deleteCourse.mutate(c.id)}
                      className="px-2 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(248,113,113,0.2)", color: "#f87171" }}>
                      Confirm
                    </button>
                    <button onClick={() => setConfirm(null)} className="px-2 py-1.5 rounded-lg text-xs" style={{ color: "#475569" }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirm(c.id)}
                    className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}