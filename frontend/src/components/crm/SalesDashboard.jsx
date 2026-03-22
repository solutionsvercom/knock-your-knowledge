import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import CRMLayout from "./CRMLayout";
import StatCard from "./StatCard";
import LeadsSection from "./sales/LeadsSection";
import TicketsSection from "./sales/TicketsSection";
import { TicketCheck, DollarSign, TrendingUp, LayoutDashboard, Users, Target } from "lucide-react";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, default: true },
  { id: "leads", label: "Lead Management", icon: Target },
  { id: "tickets", label: "Support Tickets", icon: TicketCheck },
  { id: "payments", label: "Payments", icon: DollarSign },
];

const statusColors = { open: "#f87171", in_progress: "#fbbf24", resolved: "#34d399", closed: "#475569" };
const priorityColors = { low: "#60a5fa", medium: "#fbbf24", high: "#fb923c", urgent: "#f87171" };

export default function SalesDashboard({ user }) {
  const [hash, setHash] = useState(window.location.hash.replace("#", "") || "overview");
  useEffect(() => {
    const handler = () => setHash(window.location.hash.replace("#", "") || "overview");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const { data: tickets = [] } = useQuery({ queryKey: ["sales-tickets"], queryFn: () => api.supportTickets.list() });
  const { data: payments = [] } = useQuery({ queryKey: ["sales-payments"], queryFn: () => api.payments.list() });
  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: () => api.leads.list() });

  const totalRevenue = payments.filter(p => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);
  const openTickets = tickets.filter(t => t.status === "open");
  const urgentTickets = tickets.filter(t => t.priority === "urgent" && t.status !== "closed");
  const hotLeads = leads.filter(l => l.status === "interested");
  const resolvedToday = tickets.filter(t => t.status === "resolved" && t.updated_date && new Date(t.updated_date).toDateString() === new Date().toDateString());

  return (
    <CRMLayout user={user} navItems={NAV} accentColor="#fb923c" roleLabel="Sales / Support">
      {hash === "overview" && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Sales & Support Overview</h1>
            <p className="text-sm" style={{ color: "#475569" }}>Manage leads, tickets, and track revenue</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="#34d399" />
            <StatCard label="Open Tickets" value={openTickets.length} icon={TicketCheck} color="#f87171" />
            <StatCard label="Hot Leads" value={hotLeads.length} icon={Target} color="#fb923c" sub="interested" />
            <StatCard label="Total Leads" value={leads.length} icon={Users} color="#a78bfa" />
          </div>

          {/* Sales pipeline mini-view */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">Sales Pipeline</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "cold", label: "Cold", color: "#60a5fa" },
                { id: "interested", label: "Interested", color: "#fb923c" },
                { id: "converted", label: "Converted", color: "#34d399" },
              ].map(s => {
                const count = leads.filter(l => l.status === s.id).length;
                const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={s.id} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: s.color }}>{s.label}</p>
                    <p className="text-3xl font-black text-white" style={{ fontFamily: "'Poppins',sans-serif" }}>{count}</p>
                    <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#334155" }}>{pct}% of all leads</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Urgent tickets */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">⚠️ Urgent Tickets</h2>
              <div className="space-y-2">
                {urgentTickets.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)" }}>
                    <div>
                      <p className="text-sm font-medium text-white">{t.subject}</p>
                      <p className="text-xs" style={{ color: "#475569" }}>{t.student_name || t.student_email}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${statusColors[t.status]}18`, color: statusColors[t.status] }}>
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
                {urgentTickets.length === 0 && <p className="text-sm py-4 text-center" style={{ color: "#334155" }}>No urgent tickets 🎉</p>}
              </div>
            </div>

            {/* Recent payments */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Recent Payments</h2>
              <div className="space-y-2">
                {payments.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <p className="text-sm font-medium text-white">{p.student_name || p.student_email}</p>
                      <p className="text-xs" style={{ color: "#475569" }}>{p.course_title || "—"}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#34d399" }}>${p.amount}</span>
                  </div>
                ))}
                {payments.length === 0 && <p className="text-sm py-4 text-center" style={{ color: "#334155" }}>No payments yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {hash === "leads" && <LeadsSection user={user} />}
      {hash === "tickets" && <TicketsSection user={user} />}

      {hash === "payments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Payments</h1>
            <p className="text-xl font-black" style={{ color: "#34d399" }}>${totalRevenue.toLocaleString()} total</p>
          </div>
          <div className="rounded-2xl overflow-auto" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Student", "Course", "Amount", "Method", "Status", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#334155" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-4 py-3 text-white">{p.student_name || p.student_email}</td>
                    <td className="px-4 py-3" style={{ color: "#64748b" }}>{p.course_title || "—"}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: "#34d399" }}>${p.amount}</td>
                    <td className="px-4 py-3 text-xs capitalize" style={{ color: "#475569" }}>{p.payment_method || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: `${p.status === "completed" ? "#34d399" : "#fbbf24"}18`, color: p.status === "completed" ? "#34d399" : "#fbbf24" }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#334155" }}>{p.created_date ? new Date(p.created_date).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No payments yet</p>}
          </div>
        </div>
      )}
    </CRMLayout>
  );
}