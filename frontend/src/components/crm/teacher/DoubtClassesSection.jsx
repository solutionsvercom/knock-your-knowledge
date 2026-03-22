import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, X, Pencil, Trash2, Video, Users, Calendar, Clock, ExternalLink, Bell } from "lucide-react";

const EMPTY_FORM = { title: "", description: "", course_id: "", course_title: "", session_date: "", meet_link: "", reminder_minutes: 30 };

const statusColors = { scheduled: "#60a5fa", live: "#34d399", completed: "#475569", cancelled: "#f87171" };
const statusBg = { scheduled: "rgba(96,165,250,0.12)", live: "rgba(52,211,153,0.12)", completed: "rgba(71,85,105,0.12)", cancelled: "rgba(248,113,113,0.12)" };

export default function DoubtClassesSection({ user, courses, enrollments }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewAttendees, setViewAttendees] = useState(null);

  const { data: sessions = [] } = useQuery({
    queryKey: ["doubt-sessions-teacher", user.email],
    queryFn: () => api.doubtSessions.list(user.email)
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openCreate = () => { setForm({ ...EMPTY_FORM, teacher_name: user.full_name, teacher_email: user.email }); setEditing(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ ...s, session_date: s.session_date ? new Date(s.session_date).toISOString().slice(0, 16) : "" }); setEditing(s); setShowForm(true); };

  const handleCourseChange = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    set("course_id", courseId);
    set("course_title", course?.title || "");
  };

  const save = useMutation({
    mutationFn: async () => {
      const data = { ...form, session_date: new Date(form.session_date).toISOString(), teacher_name: user.full_name, teacher_email: user.email };
      const result = editing ? await api.doubtSessions.update(editing.id, data) : await api.doubtSessions.create(data);

      // Notify enrolled students via email
      if (!editing) {
        const enrolled = enrollments.filter(e => e.course_id === form.course_id);
        const sessionDate = new Date(form.session_date);
        const dateStr = sessionDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        const timeStr = sessionDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        for (const enrollment of enrolled) {
          if (enrollment.student_email) {
            await api.ai.sendEmail({
              to: enrollment.student_email,
              subject: `📚 New Doubt Class: ${form.title}`,
              body: `Hi ${enrollment.student_name || "Student"},\n\nYour teacher ${user.full_name} has scheduled a new doubt class for "${form.course_title}".\n\n📌 Session: ${form.title}\n📅 Date: ${dateStr}\n⏰ Time: ${timeStr}\n🔗 Join: ${form.meet_link}\n\n${form.description ? `📝 ${form.description}\n\n` : ""}Log in to your dashboard to view all upcoming sessions.\n\nSkyBrisk Team`
            });
          }
        }
      }
      return result;
    },
    onSuccess: () => { qc.invalidateQueries(["doubt-sessions-teacher", user.email]); setShowForm(false); setEditing(null); }
  });

  const cancel = useMutation({
    mutationFn: async (session) => {
      await api.doubtSessions.update(session.id, { status: "cancelled" });
      // Notify students
      const enrolled = enrollments.filter(e => e.course_id === session.course_id);
      for (const enrollment of enrolled) {
        if (enrollment.student_email) {
          await api.ai.sendEmail({
            to: enrollment.student_email,
            subject: `❌ Doubt Class Cancelled: ${session.title}`,
            body: `Hi ${enrollment.student_name || "Student"},\n\nThe doubt class "${session.title}" for "${session.course_title}" scheduled by ${user.full_name} has been cancelled.\n\nA new session will be scheduled soon.\n\nSkyBrisk Team`
          });
        }
      }
    },
    onSuccess: () => qc.invalidateQueries(["doubt-sessions-teacher", user.email])
  });

  const del = useMutation({
    mutationFn: id => api.doubtSessions.delete(id),
    onSuccess: () => qc.invalidateQueries(["doubt-sessions-teacher", user.email])
  });

  const upcoming = sessions.filter(s => s.status !== "cancelled" && s.status !== "completed");
  const past = sessions.filter(s => s.status === "completed" || s.status === "cancelled");

  const getStudents = (session) => enrollments.filter(e => e.course_id === session.course_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Doubt Classes</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Schedule and manage live doubt sessions for your students</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 16px rgba(59,130,246,0.3)" }}>
          <Plus className="w-4 h-4" /> Schedule Session
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl p-6" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(96,165,250,0.25)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4" style={{ color: "#60a5fa" }} />
              {editing ? "Edit Session" : "Schedule New Doubt Class"}
            </h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Course *</label>
              <select value={form.course_id} onChange={e => handleCourseChange(e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm outline-none min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
                <option value="">Select a course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Session Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Python Loops Doubt Class"
                className="w-full px-3 py-3 rounded-xl text-sm outline-none min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Date & Time *</label>
              <input type="datetime-local" value={form.session_date} onChange={e => set("session_date", e.target.value)}
                className="w-full px-3 py-3 rounded-xl text-sm outline-none min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", colorScheme: "dark" }} />
            </div>

            {/* Meet Link */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Google Meet Link *</label>
              <input value={form.meet_link} onChange={e => set("meet_link", e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx"
                className="w-full px-3 py-3 rounded-xl text-sm outline-none min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
            </div>

            {/* Reminder */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Reminder (minutes before)</label>
              <select value={form.reminder_minutes} onChange={e => set("reminder_minutes", Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl text-sm outline-none min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
                {[15, 30, 60, 120].map(v => <option key={v} value={v}>{v} minutes before</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Description (optional)</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2}
              placeholder="Topics to be covered, prerequisites, etc."
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
          </div>

          {!editing && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <Bell className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#34d399" }} />
              <p className="text-xs" style={{ color: "#34d399" }}>All enrolled students will be notified via email when you publish this session.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button onClick={() => save.mutate()} disabled={!form.title || !form.course_id || !form.session_date || !form.meet_link || save.isPending}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:scale-105 min-h-[48px]"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              {save.isPending ? (editing ? "Updating…" : "Publishing & Notifying…") : editing ? "Update Session" : "Publish & Notify Students"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-medium min-h-[48px]"
              style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {viewAttendees && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.25)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: "#a78bfa" }} /> Students for "{viewAttendees.title}"
            </h3>
            <button onClick={() => setViewAttendees(null)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <div className="space-y-2">
            {getStudents(viewAttendees).map(e => (
              <div key={e.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <p className="text-sm font-medium text-white">{e.student_name || e.student_email}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>{e.student_email}</p>
                </div>
                <span className="text-xs font-semibold" style={{ color: "#60a5fa" }}>{e.progress || 0}% progress</span>
              </div>
            ))}
            {getStudents(viewAttendees).length === 0 && <p className="text-sm text-center py-4" style={{ color: "#334155" }}>No enrolled students yet</p>}
          </div>
          <p className="text-xs mt-3" style={{ color: "#334155" }}>{getStudents(viewAttendees).length} enrolled students will receive this session</p>
        </div>
      )}

      {/* Upcoming Sessions */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-white mb-3">Upcoming Sessions ({upcoming.length})</h2>
          <div className="space-y-3">
            {upcoming.map(s => {
              const date = new Date(s.session_date);
              const isToday = date.toDateString() === new Date().toDateString();
              const studentCount = getStudents(s).length;
              return (
                <div key={s.id} className="rounded-2xl p-5 transition-all hover:scale-[1.005]"
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.status === "live" ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: statusBg[s.status], color: statusColors[s.status] }}>
                          {s.status === "live" ? "🔴 Live Now" : s.status}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs"
                          style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>{s.course_title}</span>
                        {isToday && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>Today</span>}
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
                      {s.description && <p className="text-sm mb-2" style={{ color: "#475569" }}>{s.description}</p>}
                      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "#475569" }}>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5" />
                          {s.reminder_minutes} min reminder
                        </span>
                        <button onClick={() => setViewAttendees(viewAttendees?.id === s.id ? null : s)} className="flex items-center gap-1.5 transition-colors hover:text-white">
                          <Users className="w-3.5 h-3.5" />
                          {studentCount} students
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center gap-2">
                      <a href={s.meet_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #059669, #34d399)", boxShadow: "0 0 12px rgba(52,211,153,0.3)" }}>
                        <Video className="w-3.5 h-3.5" /> Start Meet
                      </a>
                      <button onClick={() => openEdit(s)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}>
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => { if (window.confirm("Cancel this session? Students will be notified.")) cancel.mutate(s); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                        style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Sessions */}
      {past.length > 0 && (
        <div>
          <h2 className="text-base font-bold mb-3" style={{ color: "#334155" }}>Past Sessions</h2>
          <div className="space-y-2">
            {past.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#475569" }}>{s.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#334155" }}>{s.course_title} · {new Date(s.session_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: statusBg[s.status], color: statusColors[s.status] }}>{s.status}</span>
                  {s.status === "cancelled" && (
                    <button onClick={() => { if (window.confirm("Delete this session?")) del.mutate(s.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && !showForm && (
        <div className="text-center py-16">
          <Video className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
          <p className="text-base font-semibold text-white mb-1">No doubt sessions yet</p>
          <p className="text-sm mb-5" style={{ color: "#334155" }}>Schedule your first live doubt class to help students</p>
          <button onClick={openCreate}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            Schedule First Session
          </button>
        </div>
      )}
    </div>
  );
}