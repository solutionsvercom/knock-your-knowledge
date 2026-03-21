import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";
import { TrendingUp, Brain, BookOpen, Zap, Target, Clock, Users, AlertTriangle } from "lucide-react";

const COLORS = ["#7c3aed", "#4f46e5", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
const GRAD_PURPLE = "rgba(124,58,237,0.15)";
const BORDER = "rgba(255,255,255,0.07)";

function StatMini({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-4"
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}25` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-black" style={{ color, fontFamily: "'Poppins', sans-serif" }}>{value}</p>
        <p className="text-xs" style={{ color: "#475569" }}>{label}</p>
        {sub && <p className="text-xs" style={{ color: "#334155" }}>{sub}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#0f172a", border: "1px solid rgba(167,139,250,0.3)", color: "#e2e8f0" }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function LearningAnalytics({ filterCourseIds, isAdmin }) {
  const { data: enrollments = [] } = useQuery({ queryKey: ["analytics-enrollments"], queryFn: () => api.enrollments.list() });
  const { data: aiConversations = [] } = useQuery({ queryKey: ["analytics-ai"], queryFn: () => api.aiConversations.list() });
  const { data: courses = [] } = useQuery({ queryKey: ["analytics-courses"], queryFn: () => api.courses.list() });

  const filteredEnrollments = filterCourseIds
    ? enrollments.filter(e => filterCourseIds.includes(e.course_id))
    : enrollments;

  const filteredAI = filterCourseIds
    ? aiConversations.filter(c => filterCourseIds.includes(c.course_id))
    : aiConversations;

  // ── 1. Completion Rate per Course ──────────────────────────────────────────
  const completionData = useMemo(() => {
    const map = {};
    filteredEnrollments.forEach(e => {
      if (!map[e.course_title || e.course_id]) map[e.course_title || e.course_id] = { total: 0, completed: 0 };
      map[e.course_title || e.course_id].total++;
      if (e.status === "completed") map[e.course_title || e.course_id].completed++;
    });
    return Object.entries(map)
      .map(([name, d]) => ({ name: name.length > 20 ? name.slice(0, 18) + "…" : name, rate: d.total ? Math.round((d.completed / d.total) * 100) : 0, total: d.total }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 8);
  }, [filteredEnrollments]);

  const overallCompletionRate = filteredEnrollments.length
    ? Math.round((filteredEnrollments.filter(e => e.status === "completed").length / filteredEnrollments.length) * 100)
    : 0;

  // ── 2. Progress Distribution ───────────────────────────────────────────────
  const progressDist = useMemo(() => {
    const buckets = { "0–25%": 0, "26–50%": 0, "51–75%": 0, "76–99%": 0, "100%": 0 };
    filteredEnrollments.forEach(e => {
      const p = e.progress || 0;
      if (p === 100) buckets["100%"]++;
      else if (p >= 76) buckets["76–99%"]++;
      else if (p >= 51) buckets["51–75%"]++;
      else if (p >= 26) buckets["26–50%"]++;
      else buckets["0–25%"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [filteredEnrollments]);

  // ── 3. AI Questions per Course (difficulty proxy) ─────────────────────────
  const aiPerCourse = useMemo(() => {
    const map = {};
    filteredAI.forEach(conv => {
      const key = conv.course_title || conv.course_id || "Unknown";
      if (!map[key]) map[key] = 0;
      map[key] += conv.messages?.length || 1;
    });
    return Object.entries(map)
      .map(([name, questions]) => ({ name: name.length > 20 ? name.slice(0, 18) + "…" : name, questions }))
      .sort((a, b) => b.questions - a.questions)
      .slice(0, 8);
  }, [filteredAI]);

  // ── 4. Most Difficult Lessons (by AI questions per lesson) ─────────────────
  const lessonDifficulty = useMemo(() => {
    const map = {};
    filteredAI.forEach(conv => {
      const key = conv.lesson_title || "General";
      if (!map[key]) map[key] = 0;
      map[key] += conv.messages?.filter(m => m.role === "user").length || 1;
    });
    return Object.entries(map)
      .map(([name, questions]) => ({ name: name.length > 22 ? name.slice(0, 20) + "…" : name, questions }))
      .sort((a, b) => b.questions - a.questions)
      .slice(0, 8);
  }, [filteredAI]);

  // ── 5. AI Usage Trend (by day, last 14 days) ─────────────────────────────
  const aiTrend = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), iso: d.toISOString().slice(0, 10), questions: 0 });
    }
    filteredAI.forEach(conv => {
      const day = conv.created_date?.slice(0, 10);
      const found = days.find(d => d.iso === day);
      if (found) found.questions += conv.messages?.filter(m => m.role === "user").length || 1;
    });
    return days.map(({ date, questions }) => ({ date, questions }));
  }, [filteredAI]);

  // ── 6. Enrollment trend (last 30 days, weekly buckets) ────────────────────
  const enrollmentTrend = useMemo(() => {
    const weeks = [];
    for (let i = 4; i >= 0; i--) {
      const start = new Date(); start.setDate(start.getDate() - i * 7);
      weeks.push({ label: `W${5 - i}`, count: 0, start: start.toISOString().slice(0, 10) });
    }
    filteredEnrollments.forEach(e => {
      const d = e.enrolled_date || e.created_date?.slice(0, 10);
      if (!d) return;
      for (let wi = weeks.length - 1; wi >= 0; wi--) {
        if (d >= weeks[wi].start) { weeks[wi].count++; break; }
      }
    });
    return weeks.map(({ label, count }) => ({ label, count }));
  }, [filteredEnrollments]);

  // ── Summary stats ──────────────────────────────────────────────────────────
  const totalAIQuestions = filteredAI.reduce((s, c) => s + (c.messages?.filter(m => m.role === "user").length || 0), 0);
  const avgProgress = filteredEnrollments.length
    ? Math.round(filteredEnrollments.reduce((s, e) => s + (e.progress || 0), 0) / filteredEnrollments.length)
    : 0;
  const activeStudents = new Set(filteredEnrollments.filter(e => e.status === "active").map(e => e.student_email)).size;

  const cardStyle = { background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Learning Analytics
        </h1>
        <p className="text-sm" style={{ color: "#475569" }}>Student behavior & engagement insights</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMini label="Completion Rate" value={`${overallCompletionRate}%`} icon={Target} color="#34d399" sub={`${filteredEnrollments.filter(e => e.status === "completed").length} completed`} />
        <StatMini label="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} color="#60a5fa" sub="across all students" />
        <StatMini label="AI Questions" value={totalAIQuestions} icon={Brain} color="#a78bfa" sub="total asked" />
        <StatMini label="Active Students" value={activeStudents} icon={Users} color="#fb923c" sub="currently enrolled" />
      </div>

      {/* Row 1: Completion Rate + Progress Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Completion Rate per Course */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" style={{ color: "#34d399" }} />
            <h3 className="text-sm font-bold text-white">Course Completion Rate</h3>
          </div>
          {completionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={completionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name="Completion %" fill="#34d399" radius={[4, 4, 0, 0]}>
                  {completionData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${160 - i * 5}, 70%, ${55 - i * 2}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyChart />}
        </div>

        {/* Progress Distribution Pie */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: "#60a5fa" }} />
            <h3 className="text-sm font-bold text-white">Student Progress Distribution</h3>
          </div>
          {filteredEnrollments.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={progressDist} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                    {progressDist.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {progressDist.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span style={{ color: "#94a3b8" }}>{d.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: "#e2e8f0" }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <EmptyChart />}
        </div>
      </div>

      {/* Row 2: AI Trend + Enrollment Trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Question Frequency Trend */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4" style={{ color: "#a78bfa" }} />
            <h3 className="text-sm font-bold text-white">AI Questions — Last 14 Days</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={aiTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 9 }} interval={2} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="questions" name="Questions" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment Trend */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4" style={{ color: "#fb923c" }} />
            <h3 className="text-sm font-bold text-white">Enrollment Trend — Last 5 Weeks</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={enrollmentTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 11 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Enrollments" fill="#fb923c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Difficult Lessons + AI per Course */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Difficult Lessons */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4" style={{ color: "#fbbf24" }} />
            <h3 className="text-sm font-bold text-white">Most Difficult Lessons</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: "#334155" }}>Based on AI question volume per lesson</p>
          {lessonDifficulty.length > 0 ? (
            <div className="space-y-2">
              {lessonDifficulty.map((l, i) => {
                const max = lessonDifficulty[0].questions;
                const pct = max ? Math.round((l.questions / max) * 100) : 0;
                const colors = ["#f87171", "#fb923c", "#fbbf24", "#34d399", "#60a5fa"];
                const color = colors[Math.min(i, colors.length - 1)];
                return (
                  <div key={l.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "#94a3b8" }}>{i + 1}. {l.name}</span>
                      <span className="font-semibold" style={{ color }}>{l.questions} Q</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-8 h-8 mx-auto mb-2" style={{ color: "#1e293b" }} />
              <p className="text-sm" style={{ color: "#334155" }}>No AI conversation data yet</p>
            </div>
          )}
        </div>

        {/* AI Questions per Course */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4" style={{ color: "#06b6d4" }} />
            <h3 className="text-sm font-bold text-white">AI Engagement per Course</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: "#334155" }}>Total AI questions asked per course</p>
          {aiPerCourse.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={aiPerCourse} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="questions" name="Questions" fill="#06b6d4" radius={[0, 4, 4, 0]}>
                  {aiPerCourse.map((_, i) => (
                    <Cell key={i} fill={`hsl(${190 + i * 8}, 70%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: "#1e293b" }} />
              <p className="text-sm" style={{ color: "#334155" }}>No AI conversation data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm" style={{ color: "#334155" }}>No data available yet</p>
    </div>
  );
}