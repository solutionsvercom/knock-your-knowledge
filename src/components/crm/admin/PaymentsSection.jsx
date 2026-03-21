import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import {
  DollarSign, TrendingUp, Download, Filter, Search, RefreshCw,
  FileText, RotateCcw, ChevronDown, X, Calendar, User, BookOpen, CheckCircle2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";

const STATUS_COLORS = { completed: "#34d399", pending: "#fbbf24", failed: "#f87171", refunded: "#60a5fa" };

// ── Invoice Generator ─────────────────────────────────────────────────────────
function generateInvoice(payment) {
  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${payment.transaction_id || payment.id?.slice(0, 8).toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #1e293b; padding: 48px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #7c3aed; padding-bottom: 24px; margin-bottom: 32px; }
    .brand { font-size: 28px; font-weight: 900; background: linear-gradient(90deg, #7c3aed, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 20px; color: #7c3aed; margin-bottom: 4px; }
    .invoice-meta p { font-size: 13px; color: #64748b; }
    .section { margin-bottom: 28px; }
    .section h3 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
    .section p { font-size: 14px; color: #334155; line-height: 1.7; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #f8fafc; padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 1px solid #e2e8f0; }
    td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
    .total-row td { font-weight: 700; font-size: 16px; color: #1e293b; background: #f8fafc; border-top: 2px solid #7c3aed; }
    .status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status.completed { background: #dcfce7; color: #16a34a; }
    .status.refunded { background: #dbeafe; color: #2563eb; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">SkyBrisk</div>
      <p style="font-size:13px;color:#64748b;margin-top:4px;">Online Learning Platform</p>
    </div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p>#${payment.transaction_id || payment.id?.slice(0, 8).toUpperCase() || "INV-0001"}</p>
      <p>Date: ${payment.created_date ? new Date(payment.created_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px;">
    <div class="section">
      <h3>Billed To</h3>
      <p><strong>${payment.student_name || "Student"}</strong><br/>${payment.student_email || ""}</p>
    </div>
    <div class="section">
      <h3>Payment Info</h3>
      <p>Method: ${(payment.payment_method || "—").toUpperCase()}<br/>Status: <span class="status ${payment.status}">${payment.status}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Description</th><th>Course</th><th>Qty</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>Course Enrollment</td>
        <td>${payment.course_title || "—"}</td>
        <td>1</td>
        <td>$${(payment.amount || 0).toFixed(2)}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="total-row"><td colspan="3">Total</td><td>$${(payment.amount || 0).toFixed(2)}</td></tr>
    </tfoot>
  </table>

  <div class="footer">
    <p>Thank you for learning with SkyBrisk! • support@skybrisk.com</p>
    <p style="margin-top:4px;">This is a computer-generated invoice and does not require a signature.</p>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`);
  win.document.close();
}

// ── Filter Pill ───────────────────────────────────────────────────────────────
function Pill({ label, onClear }) {
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
      {label}
      <button onClick={onClear}><X className="w-3 h-3" /></button>
    </span>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "#0f172a", border: "1px solid rgba(52,211,153,0.3)", color: "#e2e8f0" }}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" && p.name.toLowerCase().includes("revenue") ? `$${p.value.toLocaleString()}` : p.value}</p>)}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PaymentsSection({ payments: allPayments }) {
  const qc = useQueryClient();

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Refund modal
  const [refundTarget, setRefundTarget] = useState(null);
  const [refundNote, setRefundNote] = useState("");

  const refundMutation = useMutation({
    mutationFn: ({ id }) => api.payments.updateStatus(id, { status: "refunded" }),
    onSuccess: () => { qc.invalidateQueries(["crm-payments"]); qc.invalidateQueries(["sales-payments"]); setRefundTarget(null); setRefundNote(""); }
  });

  // Unique courses for filter dropdown
  const uniqueCourses = useMemo(() => {
    const titles = [...new Set(allPayments.map(p => p.course_title).filter(Boolean))];
    return titles.sort();
  }, [allPayments]);

  // Apply all filters
  const filtered = useMemo(() => {
    return allPayments.filter(p => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (courseFilter && p.course_title !== courseFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.student_name?.toLowerCase().includes(q) && !p.student_email?.toLowerCase().includes(q) && !p.transaction_id?.toLowerCase().includes(q)) return false;
      }
      if (dateFrom && p.created_date && p.created_date < dateFrom) return false;
      if (dateTo && p.created_date && p.created_date > dateTo + "T23:59:59") return false;
      return true;
    });
  }, [allPayments, statusFilter, courseFilter, search, dateFrom, dateTo]);

  // KPIs
  const totalRevenue = allPayments.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmt = allPayments.filter(p => p.status === "pending").reduce((s, p) => s + (p.amount || 0), 0);
  const refundedAmt = allPayments.filter(p => p.status === "refunded").reduce((s, p) => s + (p.amount || 0), 0);
  const filteredRevenue = filtered.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);

  // Revenue by month chart
  const revenueByMonth = useMemo(() => {
    const map = {};
    allPayments.filter(p => p.status === "completed" && p.created_date).forEach(p => {
      const key = new Date(p.created_date).toLocaleDateString("en", { month: "short", year: "2-digit" });
      map[key] = (map[key] || 0) + (p.amount || 0);
    });
    return Object.entries(map).map(([month, revenue]) => ({ month, revenue })).slice(-8);
  }, [allPayments]);

  // Revenue by course (top 6)
  const revenueByCourse = useMemo(() => {
    const map = {};
    allPayments.filter(p => p.status === "completed").forEach(p => {
      const key = (p.course_title || "Unknown").slice(0, 22);
      map[key] = (map[key] || 0) + (p.amount || 0);
    });
    return Object.entries(map).map(([name, revenue]) => ({ name, revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [allPayments]);

  const activePills = [
    courseFilter && { label: `Course: ${courseFilter}`, clear: () => setCourseFilter("") },
    dateFrom && { label: `From: ${dateFrom}`, clear: () => setDateFrom("") },
    dateTo && { label: `To: ${dateTo}`, clear: () => setDateTo("") },
  ].filter(Boolean);

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment Management</h1>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Track purchases, manage refunds & generate invoices</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "#34d399", sub: `${allPayments.filter(p => p.status === "completed").length} completed` },
          { label: "Pending", value: `$${pendingAmt.toLocaleString()}`, color: "#fbbf24", sub: `${allPayments.filter(p => p.status === "pending").length} payments` },
          { label: "Refunded", value: `$${refundedAmt.toLocaleString()}`, color: "#60a5fa", sub: `${allPayments.filter(p => p.status === "refunded").length} refunds` },
          { label: "Failed", value: allPayments.filter(p => p.status === "failed").length, color: "#f87171", sub: "transactions failed" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}20` }}>
            <p className="text-xs font-medium mb-1.5" style={{ color: "#475569" }}>{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "#334155" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      {(revenueByMonth.length > 0 || revenueByCourse.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Revenue by Month</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={revenueByMonth} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#34d399" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Revenue by Course</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueByCourse} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#a78bfa" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters bar */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#475569" }} />
            <input placeholder="Search student, email, txn ID…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {["all", "completed", "pending", "failed", "refunded"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                style={{ background: statusFilter === s ? `${STATUS_COLORS[s] || "#a78bfa"}20` : "transparent", color: statusFilter === s ? (STATUS_COLORS[s] || "#a78bfa") : "#475569" }}>
                {s}
              </button>
            ))}
          </div>

          <button onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ background: showFilters ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: showFilters ? "#a78bfa" : "#64748b" }}>
            <Filter className="w-3.5 h-3.5" /> More Filters {showFilters ? <ChevronDown className="w-3 h-3 rotate-180" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <span className="ml-auto text-xs" style={{ color: "#334155" }}>
            {filtered.length} records · <span style={{ color: "#34d399" }}>${filteredRevenue.toLocaleString()}</span> revenue
          </span>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div>
              <label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: "#64748b" }}>
                <BookOpen className="w-3 h-3" /> Course
              </label>
              <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="">All Courses</option>
                {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: "#64748b" }}>
                <Calendar className="w-3 h-3" /> From Date
              </label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: "#64748b" }}>
                <Calendar className="w-3 h-3" /> To Date
              </label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
          </div>
        )}

        {/* Active filter pills */}
        {activePills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {activePills.map((pill, i) => <Pill key={i} label={pill.label} onClear={pill.clear} />)}
            <button onClick={() => { setCourseFilter(""); setDateFrom(""); setDateTo(""); setSearch(""); setStatusFilter("all"); }}
              className="text-xs px-2.5 py-1 rounded-full" style={{ color: "#475569" }}>Clear all</button>
          </div>
        )}
      </div>

      {/* Table (desktop) */}
      <div className="rounded-2xl overflow-auto hidden md:block" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Student", "Course", "Amount", "Method", "Status", "Transaction ID", "Date", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#475569" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="px-4 py-3">
                  <p className="text-white font-medium">{p.student_name || "—"}</p>
                  <p className="text-xs" style={{ color: "#334155" }}>{p.student_email}</p>
                </td>
                <td className="px-4 py-3 max-w-[160px]">
                  <p className="text-xs truncate" style={{ color: "#64748b" }}>{p.course_title || "—"}</p>
                </td>
                <td className="px-4 py-3 font-bold" style={{ color: "#34d399" }}>${(p.amount || 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs capitalize" style={{ color: "#475569" }}>{p.payment_method || "—"}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                    style={{ background: `${STATUS_COLORS[p.status] || "#64748b"}15`, color: STATUS_COLORS[p.status] || "#64748b" }}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "#334155" }}>{p.transaction_id || "—"}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "#334155" }}>
                  {p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {/* Invoice */}
                    <button onClick={() => generateInvoice(p)} title="Generate Invoice"
                      className="p-1.5 rounded-lg transition-all hover:scale-110"
                      style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    {/* Refund (only completed) */}
                    {p.status === "completed" && (
                      <button onClick={() => setRefundTarget(p)} title="Process Refund"
                        className="p-1.5 rounded-lg transition-all hover:scale-110"
                        style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
            <p className="text-sm" style={{ color: "#334155" }}>No transactions match your filters</p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{p.student_name || "—"}</p>
                <p className="text-xs truncate" style={{ color: "#334155" }}>{p.student_email}</p>
                <p className="text-xs mt-1 truncate" style={{ color: "#64748b" }}>{p.course_title || "—"}</p>
              </div>
              <p className="text-lg font-black flex-shrink-0" style={{ color: "#34d399" }}>${(p.amount || 0).toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ background: `${STATUS_COLORS[p.status] || "#64748b"}15`, color: STATUS_COLORS[p.status] || "#64748b" }}>
                  {p.status}
                </span>
                <span className="text-xs capitalize" style={{ color: "#475569" }}>{p.payment_method || "—"}</span>
              </div>
              <span className="text-xs" style={{ color: "#334155" }}>
                {p.created_date ? new Date(p.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <button onClick={() => generateInvoice(p)}
                className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-xs font-medium"
                style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
                <FileText className="w-3.5 h-3.5" /> Invoice
              </button>
              {p.status === "completed" && (
                <button onClick={() => setRefundTarget(p)}
                  className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>
                  <RotateCcw className="w-3.5 h-3.5" /> Refund
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
            <p className="text-sm" style={{ color: "#334155" }}>No transactions match your filters</p>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-5"
            style={{ background: "#0f172a", border: "1px solid rgba(96,165,250,0.35)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" style={{ color: "#60a5fa" }} />
                <h3 className="text-lg font-bold text-white">Process Refund</h3>
              </div>
              <button onClick={() => setRefundTarget(null)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
            </div>

            <div className="rounded-xl p-4 space-y-1" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-sm font-medium text-white">{refundTarget.student_name || refundTarget.student_email}</p>
              <p className="text-xs" style={{ color: "#64748b" }}>{refundTarget.course_title || "—"}</p>
              <p className="text-xl font-black mt-2" style={{ color: "#60a5fa" }}>${(refundTarget.amount || 0).toLocaleString()}</p>
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "#64748b" }}>Refund Reason (optional)</label>
              <textarea placeholder="e.g. Student request, duplicate charge…" value={refundNote} onChange={e => setRefundNote(e.target.value)} rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button onClick={() => refundMutation.mutate({ id: refundTarget.id })}
                disabled={refundMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)", boxShadow: "0 0 16px rgba(96,165,250,0.3)" }}>
                <CheckCircle2 className="w-4 h-4" />
                {refundMutation.isPending ? "Processing…" : "Confirm Refund"}
              </button>
              <button onClick={() => setRefundTarget(null)} className="px-4 py-2.5 rounded-xl text-sm" style={{ color: "#475569" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}