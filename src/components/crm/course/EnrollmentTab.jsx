import React from "react";
import { Users, TrendingUp, CheckCircle2, Clock } from "lucide-react";

export default function EnrollmentTab({ course, enrollments }) {
  const courseEnrollments = enrollments.filter(e => e.course_id === course.id);
  const completed = courseEnrollments.filter(e => e.status === "completed");
  const active = courseEnrollments.filter(e => e.status === "active");
  const avgProgress = courseEnrollments.length
    ? Math.round(courseEnrollments.reduce((s, e) => s + (e.progress || 0), 0) / courseEnrollments.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Enrolled", value: courseEnrollments.length, icon: Users, color: "#60a5fa" },
          { label: "Active", value: active.length, icon: Clock, color: "#fbbf24" },
          { label: "Completed", value: completed.length, icon: CheckCircle2, color: "#34d399" },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "#a78bfa" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
              <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Student table (desktop) / cards (mobile) */}
      {courseEnrollments.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Desktop table */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Student", "Enrolled", "Progress", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courseEnrollments.map(e => (
                <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-3 text-white font-medium">{e.student_name || e.student_email}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{e.enrolled_date || (e.created_date ? new Date(e.created_date).toLocaleDateString() : "—")}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: `${e.progress || 0}%`, background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }} />
                      </div>
                      <span className="text-xs" style={{ color: "#64748b" }}>{e.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs capitalize"
                      style={{ background: e.status === "completed" ? "rgba(52,211,153,0.12)" : "rgba(96,165,250,0.12)", color: e.status === "completed" ? "#34d399" : "#60a5fa" }}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {courseEnrollments.map(e => (
              <div key={e.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white truncate">{e.student_name || e.student_email}</p>
                  <span className="px-2.5 py-0.5 rounded-full text-xs capitalize flex-shrink-0"
                    style={{ background: e.status === "completed" ? "rgba(52,211,153,0.12)" : "rgba(96,165,250,0.12)", color: e.status === "completed" ? "#34d399" : "#60a5fa" }}>
                    {e.status}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#475569" }}>
                  Enrolled: {e.enrolled_date || (e.created_date ? new Date(e.created_date).toLocaleDateString() : "—")}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs" style={{ color: "#64748b" }}>
                    <span>Progress</span><span>{e.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${e.progress || 0}%`, background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
          <p className="text-base font-semibold text-white mb-1">No enrollments yet</p>
          <p className="text-sm" style={{ color: "#334155" }}>Students will appear here once they enroll</p>
        </div>
      )}
    </div>
  );
}