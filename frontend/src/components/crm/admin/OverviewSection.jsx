import React from "react";
import { Users, BookOpen, DollarSign, TicketCheck, UserCheck, TrendingUp, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const StatCard = ({ label, value, icon: Icon, color, sub, trend }) => (
  <div className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02]"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: `0 0 24px ${color}0d` }}>
    <div className="flex items-start justify-between mb-4">
      <p className="text-sm font-medium" style={{ color: "#64748b" }}>{label}</p>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-4.5 h-4.5" style={{ color, width: 18, height: 18 }} />
      </div>
    </div>
    <p className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</p>
    <div className="flex items-center gap-1.5">
      {trend && <span className="text-xs font-semibold" style={{ color: "#34d399" }}>↑ {trend}</span>}
      {sub && <span className="text-xs" style={{ color: "#334155" }}>{sub}</span>}
    </div>
  </div>
);

const revenueData = [
  { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5800 }, { month: "Mar", revenue: 5100 },
  { month: "Apr", revenue: 7300 }, { month: "May", revenue: 6800 }, { month: "Jun", revenue: 9200 },
  { month: "Jul", revenue: 8500 }, { month: "Aug", revenue: 11000 }, { month: "Sep", revenue: 10200 },
  { month: "Oct", revenue: 12400 }, { month: "Nov", revenue: 11800 }, { month: "Dec", revenue: 14600 },
];

const COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];

export default function OverviewSection({ users, courses, payments, tickets, enrollments }) {
  const totalRevenue = payments.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);
  const students = users.filter(u => u.role === "student" || !u.role);
  const teachers = users.filter(u => u.role === "teacher");
  const activeEnrollments = enrollments.filter(e => e.status === "active");
  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress");

  const categoryData = courses.reduce((acc, c) => {
    const existing = acc.find(a => a.name === c.category);
    if (existing) existing.value++;
    else acc.push({ name: c.category || "other", value: 1 });
    return acc;
  }, []);

  const paymentColors = { completed: "#34d399", pending: "#fbbf24", failed: "#f87171", refunded: "#60a5fa" };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Platform Overview</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Real-time metrics and analytics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <Activity className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
          <span className="text-xs font-semibold" style={{ color: "#34d399" }}>Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={students.length} icon={Users} color="#60a5fa" sub={`${activeEnrollments.length} active enrollments`} trend="+12%" />
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="#34d399" sub={`${payments.filter(p => p.status === "completed").length} transactions`} trend="+8%" />
        <StatCard label="Active Courses" value={courses.length} icon={BookOpen} color="#a78bfa" sub={`${teachers.length} teachers`} />
        <StatCard label="Open Tickets" value={openTickets.length} icon={TicketCheck} color="#f87171" sub={`${tickets.length} total tickets`} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-base font-bold text-white mb-1">Revenue (12 months)</h3>
          <p className="text-xs mb-5" style={{ color: "#334155" }}>Monthly revenue trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#334155", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#334155", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 12, color: "#e2e8f0", fontSize: 12 }}
                formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#a78bfa" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-base font-bold text-white mb-1">Course Categories</h3>
          <p className="text-xs mb-4" style={{ color: "#334155" }}>Distribution by category</p>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12, color: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="capitalize" style={{ color: "#64748b" }}>{d.name}</span>
                    </div>
                    <span className="font-semibold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-center py-8" style={{ color: "#334155" }}>No course data yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity + Quick Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
          </div>
          <div>
            {payments.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-sm font-medium text-white">{p.student_name || p.student_email || "—"}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>{p.course_title || "Course purchase"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#34d399" }}>${p.amount}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${paymentColors[p.status]}15`, color: paymentColors[p.status] }}>{p.status}</span>
                </div>
              </div>
            ))}
            {payments.length === 0 && <p className="text-center text-xs py-8" style={{ color: "#334155" }}>No transactions yet</p>}
          </div>
        </div>

        {/* Open Tickets */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-sm font-bold text-white">Urgent Tickets</h3>
          </div>
          <div>
            {openTickets.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">{t.subject}</p>
                  <p className="text-xs" style={{ color: "#475569" }}>{t.student_name || t.student_email}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: t.priority === "urgent" ? "rgba(248,113,113,0.15)" : "rgba(251,191,36,0.15)", color: t.priority === "urgent" ? "#f87171" : "#fbbf24" }}>
                  {t.priority}
                </span>
              </div>
            ))}
            {openTickets.length === 0 && <p className="text-center text-xs py-8" style={{ color: "#334155" }}>All tickets resolved 🎉</p>}
          </div>
        </div>
      </div>
    </div>
  );
}