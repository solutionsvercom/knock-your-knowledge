import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Search, Trash2, Eye, X, Mail, BookOpen } from "lucide-react";

export default function StudentsSection({ students, enrollments, payments }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const deleteUser = useMutation({
    mutationFn: id => api.users.delete(id),
    onSuccess: () => { qc.invalidateQueries(["crm-users"]); setSelected(null); }
  });

  const filtered = students.filter(s =>
    !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const studentEnrollments = selected ? enrollments.filter(e => e.student_email === selected.email) : [];
  const studentPayments = selected ? payments.filter(p => p.student_email === selected.email) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Students</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>{students.length} total registered students</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
            className="pl-9 pr-4 h-10 rounded-xl text-sm outline-none w-64"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table (desktop) / Cards (mobile) */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Desktop table */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Student", "Email", "Joined", "Enrollments", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const count = enrollments.filter(e => e.student_email === s.email).length;
                return (
                  <tr key={s.id} className="transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: selected?.id === s.id ? "rgba(167,139,250,0.06)" : "transparent" }}
                    onMouseEnter={e => { if (selected?.id !== s.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { if (selected?.id !== s.id) e.currentTarget.style.background = "transparent"; }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                          {s.full_name?.[0] || "?"}
                        </div>
                        <span className="font-medium text-white">{s.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#64748b" }}>{s.email}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#334155" }}>{s.created_date ? new Date(s.created_date).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>{count} courses</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(s)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" title="View">
                          <Eye className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
                        </button>
                        <button onClick={() => { if (window.confirm("Remove this student?")) deleteUser.mutate(s.id); }}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {filtered.map(s => {
              const count = enrollments.filter(e => e.student_email === s.email).length;
              return (
                <div key={s.id} className="p-4 space-y-3"
                  style={{ background: selected?.id === s.id ? "rgba(167,139,250,0.06)" : "transparent" }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                        {s.full_name?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{s.full_name || "—"}</p>
                        <p className="text-xs truncate" style={{ color: "#64748b" }}>{s.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setSelected(s)} className="p-2 rounded-lg" style={{ background: "rgba(167,139,250,0.1)" }}>
                        <Eye className="w-4 h-4" style={{ color: "#a78bfa" }} />
                      </button>
                      <button onClick={() => { if (window.confirm("Remove this student?")) deleteUser.mutate(s.id); }}
                        className="p-2 rounded-lg" style={{ background: "rgba(248,113,113,0.1)" }}>
                        <Trash2 className="w-4 h-4" style={{ color: "#f87171" }} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: "#334155" }}>
                    <span>Joined: {s.created_date ? new Date(s.created_date).toLocaleDateString() : "—"}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>{count} courses</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && <p className="text-center py-10 text-sm" style={{ color: "#334155" }}>No students found</p>}
        </div>

        {/* Student Detail Panel */}
        <div className="rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {selected ? (
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <h3 className="text-sm font-bold text-white">Student Profile</h3>
                <button onClick={() => setSelected(null)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-3"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                    {selected.full_name?.[0] || "?"}
                  </div>
                  <p className="font-bold text-white">{selected.full_name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{selected.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.15)" }}>
                    <p className="text-xl font-black" style={{ color: "#60a5fa" }}>{studentEnrollments.length}</p>
                    <p className="text-xs" style={{ color: "#334155" }}>Enrolled</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
                    <p className="text-xl font-black" style={{ color: "#34d399" }}>${studentPayments.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0)}</p>
                    <p className="text-xs" style={{ color: "#334155" }}>Spent</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#475569" }}>Enrolled Courses</p>
                  <div className="space-y-2">
                    {studentEnrollments.map(e => (
                      <div key={e.id} className="px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-white truncate max-w-[140px]">{e.course_title}</p>
                          <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>{e.progress || 0}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full mt-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${e.progress || 0}%`, background: "#a78bfa" }} />
                        </div>
                      </div>
                    ))}
                    {studentEnrollments.length === 0 && <p className="text-xs" style={{ color: "#334155" }}>No enrollments yet</p>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
              <Eye className="w-8 h-8 mb-3" style={{ color: "#1e293b" }} />
              <p className="text-sm" style={{ color: "#334155" }}>Select a student to view their profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}