import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { UserPlus, Trash2, Mail, BookOpen, X } from "lucide-react";

export default function TeachersSection({ teachers, courses, enrollments }) {
  const qc = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState(null);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteStatus("loading");
    try {
      await api.users.inviteUser(inviteEmail.trim(), "user");
      // After invite, we'd update their role — for now just mark success
      setInviteStatus("success");
      setInviteEmail("");
      setTimeout(() => setInviteStatus(null), 3000);
    } catch {
      setInviteStatus("error");
    }
  };

  const deleteTeacher = useMutation({
    mutationFn: id => api.users.delete(id),
    onSuccess: () => qc.invalidateQueries(["crm-users"])
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Teachers</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>{teachers.length} active teachers</p>
        </div>
        <button onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 16px rgba(59,130,246,0.3)" }}>
          <UserPlus className="w-4 h-4" /> Invite Teacher
        </button>
      </div>

      {/* Invite Panel */}
      {showInvite && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Invite New Teacher</h3>
            <button onClick={() => setShowInvite(false)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <div className="flex gap-3">
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="teacher@example.com"
              className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
            <button onClick={handleInvite} disabled={inviteStatus === "loading" || !inviteEmail.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              {inviteStatus === "loading" ? "Inviting…" : "Send Invite"}
            </button>
          </div>
          {inviteStatus === "success" && <p className="text-xs mt-2" style={{ color: "#34d399" }}>✓ Invitation sent! Ask them to set their role to "teacher" after signing up.</p>}
          {inviteStatus === "error" && <p className="text-xs mt-2" style={{ color: "#f87171" }}>Failed to send invite. Try again.</p>}
          <p className="text-xs mt-3" style={{ color: "#334155" }}>After they register, update their role to "teacher" from the Users admin panel.</p>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teachers.map(t => {
          const teacherCourses = courses.filter(c => c.instructor === t.full_name);
          const totalStudents = teacherCourses.reduce((s, c) => s + (c.students_count || 0), 0);
          const avgRating = teacherCourses.filter(c => c.rating).length > 0
            ? (teacherCourses.reduce((s, c) => s + (c.rating || 0), 0) / teacherCourses.filter(c => c.rating).length).toFixed(1)
            : null;

          return (
            <div key={t.id} className="rounded-2xl p-5 transition-all hover:scale-[1.01]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 16px rgba(124,58,237,0.3)" }}>
                    {t.full_name?.[0] || "T"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.full_name}</p>
                    <p className="text-xs" style={{ color: "#475569" }}>{t.email}</p>
                  </div>
                </div>
                <button onClick={() => { if (window.confirm("Remove teacher?")) deleteTeacher.mutate(t.id); }}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                </button>
              </div>

              {t.bio && <p className="text-xs mb-4 line-clamp-2" style={{ color: "#475569" }}>{t.bio}</p>}
              {t.department && (
                <p className="text-xs mb-3 px-2.5 py-1 rounded-lg inline-block" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>{t.department}</p>
              )}

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-lg font-black text-white">{teacherCourses.length}</p>
                  <p className="text-xs" style={{ color: "#334155" }}>Courses</p>
                </div>
                <div className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-lg font-black text-white">{totalStudents}</p>
                  <p className="text-xs" style={{ color: "#334155" }}>Students</p>
                </div>
                <div className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-lg font-black text-white">{avgRating || "—"}</p>
                  <p className="text-xs" style={{ color: "#334155" }}>Rating</p>
                </div>
              </div>

              {teacherCourses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#334155" }}>Courses</p>
                  <div className="space-y-1.5">
                    {teacherCourses.map(c => (
                      <div key={c.id} className="flex items-center gap-2 text-xs px-2.5 py-2 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: "#60a5fa" }} />
                        <span className="truncate text-white">{c.title}</span>
                        <span className="ml-auto flex-shrink-0" style={{ color: "#334155" }}>{c.students_count || 0} students</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {teachers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "#334155" }}>No teachers yet. Invite your first teacher.</p>
        </div>
      )}
    </div>
  );
}