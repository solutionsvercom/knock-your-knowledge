import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import CRMLayout from "./CRMLayout";
import StatCard from "./StatCard";
import { BookOpen, Trophy, TicketCheck, LayoutDashboard, Video, Calendar, Clock, ExternalLink, Award, Bell, CreditCard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CertificatesSection from "./student/CertificatesSection";
import NotificationsSection from "./student/NotificationsSection";
import PaymentHistorySection from "./student/PaymentHistorySection";
import AIHistorySection from "./student/AIHistorySection";

const NAV = [
  { id: "overview", label: "My Learning", icon: LayoutDashboard, default: true },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "doubt-classes", label: "Doubt Classes", icon: Video },
  { id: "ai-history", label: "AI History", icon: Sparkles },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "payments", label: "Payment History", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "tickets", label: "My Tickets", icon: TicketCheck },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

export default function StudentDashboard({ user }) {
  const [hash, setHash] = useState(window.location.hash.replace("#", "") || "overview");
  useEffect(() => {
    const handler = () => setHash(window.location.hash.replace("#", "") || "overview");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const { data: enrollments = [] } = useQuery({
    queryKey: ["s-enrollments"],
    queryFn: () => api.enrollments.mine()
  });
  const { data: tickets = [] } = useQuery({
    queryKey: ["s-tickets"],
    queryFn: () => api.supportTickets.mine()
  });
  const { data: payments = [] } = useQuery({
    queryKey: ["s-payments"],
    queryFn: () => api.payments.mine()
  });
  const { data: allSessions = [] } = useQuery({
    queryKey: ["s-doubt-sessions"],
    queryFn: () => api.doubtSessions.list()
  });
  const { data: notifications = [] } = useQuery({
    queryKey: ["s-notifications", user.email],
    queryFn: () => api.notifications.mine()
  });

  const completed = enrollments.filter(e => e.status === "completed");
  const avgProgress = enrollments.length ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length) : 0;

  // Only show sessions for courses the student is enrolled in
  const enrolledCourseIds = enrollments.map(e => e.course_id);
  const mySessions = allSessions.filter(s =>
    enrolledCourseIds.includes(s.course_id) && s.status !== "cancelled"
  );
  const upcomingSessions = mySessions.filter(s => new Date(s.session_date) > new Date());
  const pastSessions = mySessions.filter(s => new Date(s.session_date) <= new Date());

  return (
    <CRMLayout user={user} navItems={NAV} accentColor="#34d399" roleLabel="Student">
      {hash === "overview" && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome back, {user?.full_name?.split(" ")[0]} 🎓</h1>
            <p className="text-sm" style={{ color: "#475569" }}>Keep up the learning momentum!</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Enrolled Courses" value={enrollments.length} icon={BookOpen} color="#60a5fa" />
            <StatCard label="Completed" value={completed.length} icon={Trophy} color="#34d399" />
            <StatCard label="Avg Progress" value={`${avgProgress}%`} icon={LayoutDashboard} color="#a78bfa" />
            <StatCard label="Notifications" value={notifications.filter(n => !n.is_read).length} icon={Bell} color="#fbbf24" sub="unread" />
          </div>

          {/* Upcoming Doubt Classes preview */}
          {upcomingSessions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Upcoming Doubt Classes</h2>
                <a href="#doubt-classes" onClick={() => setHash("doubt-classes")} className="text-xs font-semibold" style={{ color: "#34d399" }}>View all →</a>
              </div>
              <div className="space-y-3">
                {upcomingSessions.slice(0, 2).map(s => {
                  const date = new Date(s.session_date);
                  return (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}>
                      <div>
                        <p className="text-sm font-semibold text-white">{s.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{s.teacher_name} · {s.course_title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#06b6d4" }}>
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <a href={s.meet_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex-shrink-0 transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)" }}>
                        <Video className="w-3 h-3" /> Join
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active courses */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Continue Learning</h2>
            <div className="space-y-3">
              {enrollments.filter(e => e.status === "active").map(e => (
                <div key={e.id} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">{e.course_title}</p>
                    <span className="text-sm font-bold" style={{ color: "#34d399" }}>{e.progress || 0}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${e.progress || 0}%`, background: "linear-gradient(90deg, #34d399, #06b6d4)" }} />
                  </div>
                  <Link to={`/CourseLearning?id=${e.course_id}`}
                    className="inline-block mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                    style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399" }}>
                    Continue →
                  </Link>
                </div>
              ))}
              {enrollments.filter(e => e.status === "active").length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm mb-3" style={{ color: "#334155" }}>No active courses yet</p>
                  <Link to="/Courses" className="text-xs px-4 py-2 rounded-xl font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {hash === "courses" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>My Courses</h1>
          <div className="space-y-3">
            {enrollments.map(e => (
              <div key={e.id} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">{e.course_title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs" style={{
                    background: e.status === "completed" ? "rgba(52,211,153,0.12)" : "rgba(96,165,250,0.12)",
                    color: e.status === "completed" ? "#34d399" : "#60a5fa"
                  }}>{e.status}</span>
                </div>
                <div className="w-full h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${e.progress || 0}%`, background: "linear-gradient(90deg, #34d399, #06b6d4)" }} />
                </div>
                <p className="text-xs" style={{ color: "#334155" }}>Progress: {e.progress || 0}%</p>
              </div>
            ))}
            {enrollments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm mb-4" style={{ color: "#334155" }}>You haven't enrolled in any courses yet</p>
                <Link to="/Courses" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {hash === "doubt-classes" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Upcoming Doubt Classes</h1>
            <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Live sessions scheduled by your teachers</p>
          </div>

          {upcomingSessions.length > 0 && (
            <div className="space-y-4">
              {upcomingSessions.map(s => {
                const date = new Date(s.session_date);
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div key={s.id} className="rounded-2xl p-5"
                    style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>{s.course_title}</span>
                          {isToday && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold animate-pulse"
                            style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>Today!</span>}
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
                        {s.description && <p className="text-sm mb-2" style={{ color: "#475569" }}>{s.description}</p>}
                        <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "#475569" }}>
                          <span className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                              {s.teacher_name?.[0] || "T"}
                            </div>
                            {s.teacher_name}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                      <a href={s.meet_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #0891b2, #06b6d4)", boxShadow: "0 0 16px rgba(6,182,212,0.3)" }}>
                        <Video className="w-4 h-4" /> Join Session
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {upcomingSessions.length === 0 && (
            <div className="text-center py-16">
              <Video className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
              <p className="text-base font-semibold text-white mb-1">No upcoming sessions</p>
              <p className="text-sm" style={{ color: "#334155" }}>Your teachers will schedule doubt classes soon</p>
            </div>
          )}

          {pastSessions.length > 0 && (
            <div>
              <h2 className="text-base font-bold mb-3" style={{ color: "#334155" }}>Past Sessions</h2>
              <div className="space-y-2">
                {pastSessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <p className="text-sm" style={{ color: "#475569" }}>{s.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#334155" }}>{s.teacher_name} · {new Date(s.session_date).toLocaleDateString()}</p>
                    </div>
                    <a href={s.meet_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#334155" }}>
                      <ExternalLink className="w-3 h-3" /> Recording
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hash === "ai-history" && <AIHistorySection user={user} enrollments={enrollments} />}
      {hash === "certificates" && <CertificatesSection user={user} enrollments={enrollments} />}
      {hash === "payments" && <PaymentHistorySection payments={payments} />}
      {hash === "notifications" && <NotificationsSection user={user} />}

      {hash === "tickets" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>My Support Tickets</h1>
          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.subject}</p>
                    <p className="text-xs mt-1" style={{ color: "#475569" }}>{t.category} · {t.created_date ? new Date(t.created_date).toLocaleDateString() : ""}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                    style={{ background: t.status === "resolved" ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)", color: t.status === "resolved" ? "#34d399" : "#fbbf24" }}>
                    {t.status}
                  </span>
                </div>
                {t.resolution && (
                  <div className="mt-3 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", color: "#94a3b8" }}>
                    <strong style={{ color: "#34d399" }}>Resolution:</strong> {t.resolution}
                  </div>
                )}
              </div>
            ))}
            {tickets.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No tickets raised yet</p>}
          </div>
        </div>
      )}

      {hash === "achievements" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Achievements 🏆</h1>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "First Enrollment", unlocked: enrollments.length > 0, icon: "📚", desc: "Enrolled in your first course" },
              { label: "Course Completed", unlocked: completed.length > 0, icon: "🎓", desc: "Completed a course" },
              { label: "Fast Learner", unlocked: completed.length >= 3, icon: "⚡", desc: "Completed 3 courses" },
              { label: "Active Learner", unlocked: avgProgress >= 50, icon: "🔥", desc: "50% average progress" },
              { label: "Scholar", unlocked: payments.length > 0, icon: "💎", desc: "Made your first purchase" },
              { label: "Top Student", unlocked: completed.length >= 5, icon: "🌟", desc: "Completed 5 courses" },
            ].map(a => (
              <div key={a.label} className="rounded-2xl p-5 text-center transition-all"
                style={{ background: a.unlocked ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${a.unlocked ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.05)"}` }}>
                <p className="text-3xl mb-2" style={{ filter: a.unlocked ? "none" : "grayscale(1) opacity(0.3)" }}>{a.icon}</p>
                <p className="text-sm font-bold" style={{ color: a.unlocked ? "#34d399" : "#334155" }}>{a.label}</p>
                <p className="text-xs mt-1" style={{ color: "#334155" }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </CRMLayout>
  );
}