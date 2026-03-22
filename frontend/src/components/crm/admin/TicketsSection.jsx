import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Search, Filter, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

const statusColors = { open: "#f87171", in_progress: "#fbbf24", resolved: "#34d399", closed: "#475569" };
const priorityColors = { low: "#60a5fa", medium: "#94a3b8", high: "#fb923c", urgent: "#f87171" };

export default function TicketsSection({ tickets, users }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [resolutionText, setResolutionText] = useState({});

  const update = useMutation({
    mutationFn: ({ id, data }) => api.supportTickets.update(id, data),
    onSuccess: () => qc.invalidateQueries(["crm-tickets"])
  });

  const agentNames = users.filter(u => u.role === "sales" || u.role === "admin").map(u => u.full_name).filter(Boolean);

  const filtered = tickets.filter(t => {
    const matchSearch = !search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.student_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = tickets.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Support Tickets</h1>
        <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Manage and resolve student queries</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {["open", "in_progress", "resolved", "closed"].map(s => (
          <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className="rounded-xl p-3 text-left transition-all hover:scale-[1.02]"
            style={{
              background: statusFilter === s ? `${statusColors[s]}12` : "rgba(255,255,255,0.03)",
              border: `1px solid ${statusFilter === s ? statusColors[s] + "40" : "rgba(255,255,255,0.07)"}`,
            }}>
            <p className="text-2xl font-black mb-0.5" style={{ color: statusColors[s] }}>{statusCounts[s] || 0}</p>
            <p className="text-xs capitalize font-medium" style={{ color: "#475569" }}>{s.replace("_", " ")}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..."
            className="pl-9 pr-4 h-10 rounded-xl text-sm outline-none w-full"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-2">
        {filtered.map(t => (
          <div key={t.id} className="rounded-2xl overflow-hidden transition-all"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${expanded === t.id ? statusColors[t.status] + "30" : "rgba(255,255,255,0.07)"}` }}>
            {/* Header */}
            <button className="w-full text-left px-5 py-4" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: `${statusColors[t.status]}15`, color: statusColors[t.status] }}>
                      {t.status?.replace("_", " ")}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: `${priorityColors[t.priority]}12`, color: priorityColors[t.priority] }}>
                      {t.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#475569" }}>{t.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{t.subject}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{t.student_name || t.student_email} · {t.created_date ? new Date(t.created_date).toLocaleDateString() : ""}</p>
                </div>
                {expanded === t.id ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "#475569" }} /> : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "#475569" }} />}
              </div>
            </button>

            {/* Expanded */}
            {expanded === t.id && (
              <div className="px-5 pb-5 pt-0 space-y-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {t.description && (
                  <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.03)", color: "#94a3b8" }}>
                    {t.description}
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-3">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#475569" }}>Status</label>
                    <select value={t.status} onChange={e => update.mutate({ id: t.id, data: { status: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{ background: `${statusColors[t.status]}12`, border: `1px solid ${statusColors[t.status]}30`, color: statusColors[t.status] }}>
                      {["open", "in_progress", "resolved", "closed"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </div>
                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#475569" }}>Priority</label>
                    <select value={t.priority || "medium"} onChange={e => update.mutate({ id: t.id, data: { priority: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                      {["low", "medium", "high", "urgent"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {/* Assign */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#475569" }}>Assign To</label>
                    <select value={t.assigned_to || ""} onChange={e => update.mutate({ id: t.id, data: { assigned_to: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                      <option value="">Unassigned</option>
                      {agentNames.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#475569" }}>Resolution / Reply</label>
                  <textarea
                    value={resolutionText[t.id] ?? t.resolution ?? ""}
                    onChange={e => setResolutionText(p => ({ ...p, [t.id]: e.target.value }))}
                    rows={2} placeholder="Write resolution or reply to student..."
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }} />
                  <button
                    onClick={() => update.mutate({ id: t.id, data: { resolution: resolutionText[t.id] ?? t.resolution, status: "resolved" } })}
                    className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #059669, #34d399)" }}>
                    Save & Mark Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: "#1e293b" }} />
            <p className="text-sm" style={{ color: "#334155" }}>No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
}