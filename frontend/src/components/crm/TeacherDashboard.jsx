import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import CRMLayout from "./CRMLayout";
import StatCard from "./StatCard";
import DoubtClassesSection from "./teacher/DoubtClassesSection";
import CourseManagement from "./course/CourseManagement";
import LearningAnalytics from "./analytics/LearningAnalytics";
import { BookOpen, Users, BarChart2, MessageSquare, Video, TrendingUp } from "lucide-react";

const NAV = [
  { id: "overview", label: "My Overview", icon: BarChart2, default: true },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "students", label: "My Students", icon: Users },
  { id: "doubt-classes", label: "Doubt Classes", icon: Video },
  { id: "tickets", label: "Student Queries", icon: MessageSquare },
  { id: "analytics", label: "Learning Analytics", icon: TrendingUp },
];

export default function TeacherDashboard({ user }) {
  const [hash, setHash] = useState(window.location.hash.replace("#", "") || "overview");
  useEffect(() => {
    const handler = () => setHash(window.location.hash.replace("#", "") || "overview");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const { data: courses = [] } = useQuery({ queryKey: ["t-courses"], queryFn: () => api.courses.list(undefined, undefined, user.full_name) });
  const { data: enrollments = [] } = useQuery({ queryKey: ["t-enrollments"], queryFn: () => api.enrollments.list() });
  const { data: tickets = [] } = useQuery({ queryKey: ["t-tickets"], queryFn: () => api.supportTickets.list() });

  const myStudentCount = enrollments.filter(e => courses.some(c => c.id === e.course_id)).length;

  return (
    <CRMLayout user={user} navItems={NAV} accentColor="#60a5fa" roleLabel="Teacher">
      {hash === "overview" && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome, {user?.full_name?.split(" ")[0]} 👋</h1>
            <p className="text-sm" style={{ color: "#475569" }}>Your teaching dashboard</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard label="My Courses" value={courses.length} icon={BookOpen} color="#60a5fa" />
            <StatCard label="My Students" value={myStudentCount} icon={Users} color="#a78bfa" />
            <StatCard label="Open Queries" value={tickets.filter(t => t.status === "open").length} icon={MessageSquare} color="#fbbf24" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-4">My Courses</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {courses.map(c => (
                <div key={c.id} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#60a5fa" }}>{c.category}</p>
                  <h3 className="text-base font-bold text-white">{c.title}</h3>
                  <div className="flex items-center justify-between mt-3 text-sm" style={{ color: "#334155" }}>
                    <span>{c.students_count || 0} students</span>
                    <span>⭐ {c.rating || "N/A"}</span>
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p className="text-sm" style={{ color: "#334155" }}>No courses assigned yet</p>}
            </div>
          </div>
        </div>
      )}

      {hash === "courses" && (
        <CourseManagement courses={courses} enrollments={enrollments} instructorName={user.full_name} isAdmin={false} />
      )}

      {hash === "students" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>My Students ({myStudentCount})</h1>
          <div className="space-y-2">
            {enrollments.filter(e => courses.some(c => c.id === e.course_id)).map(e => (
              <div key={e.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <p className="text-sm font-medium text-white">{e.student_name || e.student_email}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>{e.course_title}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#334155" }}>Progress</p>
                  <p className="text-sm font-semibold" style={{ color: "#60a5fa" }}>{e.progress || 0}%</p>
                </div>
              </div>
            ))}
            {myStudentCount === 0 && <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No enrolled students yet</p>}
          </div>
        </div>
      )}

      {hash === "doubt-classes" && (
        <DoubtClassesSection user={user} courses={courses} enrollments={enrollments} />
      )}
      {hash === "analytics" && (
        <LearningAnalytics filterCourseIds={courses.map(c => c.id)} isAdmin={false} />
      )}

      {hash === "tickets" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Student Queries</h1>
          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-sm font-semibold text-white">{t.subject}</p>
                <p className="text-xs mt-1" style={{ color: "#475569" }}>{t.student_name} · {t.created_date ? new Date(t.created_date).toLocaleDateString() : ""}</p>
                {t.description && <p className="text-xs mt-2" style={{ color: "#334155" }}>{t.description}</p>}
              </div>
            ))}
            {tickets.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No queries yet</p>}
          </div>
        </div>
      )}
    </CRMLayout>
  );
}