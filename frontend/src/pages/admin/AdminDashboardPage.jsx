import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/adminApi";
import {
  Users,
  DollarSign,
  FileText,
  Ticket,
  UserPlus,
  Mail,
  Activity,
  Tag,
} from "lucide-react";

const ACCENT = "#a78bfa";

function StatCard({ label, value, icon: Icon, color, sub, to }) {
  const inner = (
    <div
      className="rounded-2xl p-5 h-full transition-all hover:scale-[1.01]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 0 24px ${color}0d`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: "#64748b" }}>
          {label}
        </p>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {value}
      </p>
      {sub ? (
        <p className="text-xs" style={{ color: "#334155" }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function formatInr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => adminApi.overview(),
    refetchInterval: 30000,
  });

  const stats = data?.stats || {};
  const students = data?.students || [];
  const recentPayments = data?.recentPayments || [];
  const recentEnrollments = data?.recentEnrollments || [];
  const leads = data?.contactLeads || [];

  if (isLoading) {
    return <p className="text-slate-400 text-sm">Loading admin overview…</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl p-4 text-sm" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
        {error.message}. Ensure the backend is running and <code>VITE_ADMIN_API_KEY</code> matches{" "}
        <code>ADMIN_API_KEY</code>.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Admin overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
            Enrollments, payments, sales coupons &amp; student tickets from MongoDB
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
        >
          <Activity className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
          <span className="text-xs font-semibold" style={{ color: "#34d399" }}>
            Live DB
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Enrolled students"
          value={stats.enrolledStudents ?? 0}
          icon={Users}
          color="#60a5fa"
          sub={`${stats.enrollments ?? 0} course enrollments`}
          to="/admin/enrollments"
        />
        <StatCard
          label="Payment total"
          value={formatInr(stats.paymentTotal)}
          icon={DollarSign}
          color="#34d399"
          sub={`${stats.invoices ?? 0} invoices`}
          to="/admin/payments"
        />
        <StatCard
          label="Sales coupons"
          value={stats.activeCoupons ?? 0}
          icon={Tag}
          color={ACCENT}
          sub={`${stats.salesStaff ?? 0} sales staff`}
          to="/admin/sales"
        />
        <StatCard
          label="Student tickets"
          value={stats.tickets ?? 0}
          icon={Ticket}
          color="#fbbf24"
          sub={`Wallet ${formatInr(stats.ticketWalletValue)} (₹500 each)`}
          to="/admin/tickets"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent enrollments</h2>
            <Link to="/admin/enrollments" className="text-xs" style={{ color: ACCENT }}>
              View all
            </Link>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {recentEnrollments.length === 0 ? (
              <p className="text-xs text-slate-500">No enrollments yet. They appear after successful Cashfree payments.</p>
            ) : (
              recentEnrollments.map((e) => (
                <div
                  key={e._id}
                  className="flex justify-between gap-3 py-2 border-b border-white/5 text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{e.studentName || e.studentEmail}</p>
                    <p className="text-xs text-slate-500 truncate">{e.itemTitle}</p>
                  </div>
                  <p className="text-emerald-400 font-semibold whitespace-nowrap">{formatInr(e.amountPaid)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent payments</h2>
            <Link to="/admin/payments" className="text-xs" style={{ color: ACCENT }}>
              View all
            </Link>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {recentPayments.length === 0 ? (
              <p className="text-xs text-slate-500">No paid orders yet.</p>
            ) : (
              recentPayments.map((p) => (
                <div key={p._id} className="flex justify-between gap-3 py-2 border-b border-white/5 text-sm">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {p.customer?.name || p.customer?.email || p.orderId || p.razorpayOrderId}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {p.coupon ? `Coupon ${p.coupon}` : "No coupon"} · {p.status}
                    </p>
                  </div>
                  <p className="text-emerald-400 font-semibold whitespace-nowrap">{formatInr(p.amountInr)}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4" style={{ color: ACCENT }} /> Students (from enrollments)
            </h2>
            <Link to="/admin/enrollments" className="text-xs" style={{ color: ACCENT }}>
              Details
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  <th className="py-2 pr-2 font-medium">Name</th>
                  <th className="py-2 pr-2 font-medium">Email</th>
                  <th className="py-2 pr-2 font-medium">Courses</th>
                  <th className="py-2 font-medium">Paid</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 8).map((s) => (
                  <tr key={s.email} className="border-b border-white/5">
                    <td className="py-2 pr-2 text-white">{s.name || "—"}</td>
                    <td className="py-2 pr-2 text-slate-400 truncate max-w-[140px]">{s.email}</td>
                    <td className="py-2 pr-2 text-slate-400 text-xs">{(s.courses || []).join(", ")}</td>
                    <td className="py-2 text-emerald-400">{formatInr(s.totalPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 ? <p className="text-xs text-slate-500 mt-2">No student data yet.</p> : null}
          </div>
        </section>

        <section
          className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: ACCENT }} /> Contact leads
            </h2>
            <Link to="/admin/leads" className="text-xs" style={{ color: ACCENT }}>
              View all
            </Link>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {leads.length === 0 ? (
              <p className="text-xs text-slate-500">No Get Started leads yet.</p>
            ) : (
              leads.slice(0, 10).map((l) => (
                <div key={l._id} className="py-2 border-b border-white/5 text-sm">
                  <p className="text-white font-medium">{l.name || l.email}</p>
                  <p className="text-xs text-slate-500">
                    {l.email} · {l.phone || "—"} · {l.internshipInterest || l.program || "—"}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/sales"
          className="text-xs px-4 py-2 rounded-xl font-semibold"
          style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44` }}
        >
          + Create sales staff &amp; coupon
        </Link>
        <Link
          to="/admin/tickets"
          className="text-xs px-4 py-2 rounded-xl font-semibold"
          style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}
        >
          + Raise student ticket
        </Link>
        <Link
          to="/admin/payments"
          className="text-xs px-4 py-2 rounded-xl font-semibold text-slate-300"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1" />
          Bills &amp; invoices
        </Link>
      </div>
    </div>
  );
}
