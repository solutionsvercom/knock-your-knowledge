import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, X, Send, ChevronDown, ChevronUp, Filter } from "lucide-react";

const statusColors = { open: "#f87171", in_progress: "#fbbf24", resolved: "#34d399", closed: "#475569" };
const priorityColors = { low: "#60a5fa", medium: "#fbbf24", high: "#fb923c", urgent: "#f87171" };
const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

const EMPTY_FORM = { subject: "", description: "", student_email: "", student_name: "", category: "general", priority: "medium" };

export default function TicketsSection({ user }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState({});

  const { data: tickets = [] } = useQuery({
    queryKey: ["sales-tickets"],
    queryFn: () => api.supportTickets.list()
  });
  const { data: replies = [] } = useQuery({
    queryKey: ["ticket-replies"],
    queryFn: () => api.supportTickets.replies()
  });

  const createTicket = useMutation({
    mutationFn: (d) => api.supportTickets.create(d),
    onSuccess: () => { qc.invalidateQueries(["sales-tickets"]); setShowForm(false); setForm(EMPTY_FORM); }
  });
  const updateTicket = useMutation({
    mutationFn: ({ id, data }) => api.supportTickets.update(id, data),
    onSuccess: () => qc.invalidateQueries(["sales-tickets"])
  });
  const sendReply = useMutation({
    mutationFn: ({ ticketId, message }) => api.supportTickets.reply({ ticket_id: ticketId, message }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries(["ticket-replies"]);
      setReplyText(p => ({ ...p, [vars.ticketId]: "" }));
      // Mark ticket as in_progress if open
      const t = tickets.find(t => t.id === vars.ticketId);
      if (t && t.status === "open") updateTicket.mutate({ id: vars.ticketId, data: { status: "in_progress" } });
    }
  });

  // Sort by priority then date
  const filtered = tickets
    .filter(t => (statusFilter === "all" || t.status === statusFilter) && (priorityFilter === "all" || t.priority === priorityFilter))
    .sort((a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4));

  const counts = { all: tickets.length, open: 0, in_progress: 0, resolved: 0, closed: 0 };
  tickets.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Support Tickets</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Manage and resolve student support requests</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", boxShadow: "0 0 16px rgba(251,146,60,0.3)" }}>
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "open", "in_progress", "resolved", "closed"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: statusFilter === s ? `${statusColors[s] || "#fb923c"}20` : "rgba(255,255,255,0.04)",
              color: statusFilter === s ? (statusColors[s] || "#fb923c") : "#475569",
              border: `1px solid ${statusFilter === s ? (statusColors[s] || "#fb923c") + "40" : "rgba(255,255,255,0.07)"}`
            }}>
            {s === "all" ? "All" : s.replace("_", " ")} ({counts[s] ?? filtered.length})
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Filter className="w-3.5 h-3.5" style={{ color: "#475569" }} />
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* New ticket form */}
      {showForm && (
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(251,146,60,0.25)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">Create Ticket</h3>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: "subject", placeholder: "Subject" },
              { key: "student_email", placeholder: "Student Email" },
              { key: "student_name", placeholder: "Student Name" },
            ].map(f => (
              <input key={f.key} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
            ))}
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
              {["technical", "billing", "course_content", "general"].map(v => <option key={v} value={v}>{v.replace("_", " ")}</option>)}
            </select>
            <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
              {["low", "medium", "high", "urgent"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <textarea placeholder="Description…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
          <button onClick={() => createTicket.mutate(form)} disabled={!form.subject || createTicket.isPending}
            className="w-full px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 min-h-[48px]"
            style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>
            {createTicket.isPending ? "Creating…" : "Create Ticket"}
          </button>
        </div>
      )}

      {/* Ticket list */}
      <div className="space-y-3">
        {filtered.map(t => {
          const ticketReplies = replies.filter(r => r.ticket_id === t.id).sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
          const isOpen = expanded === t.id;
          return (
            <div key={t.id} className="rounded-2xl overflow-hidden transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isOpen ? "rgba(251,146,60,0.25)" : "rgba(255,255,255,0.07)"}` }}>
              {/* Ticket header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {/* Priority badge */}
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase"
                        style={{ background: `${priorityColors[t.priority]}20`, color: priorityColors[t.priority] }}>
                        {t.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs capitalize"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                        {t.category?.replace("_", " ")}
                      </span>
                      {ticketReplies.length > 0 && (
                        <span className="text-xs" style={{ color: "#475569" }}>{ticketReplies.length} repl{ticketReplies.length === 1 ? "y" : "ies"}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{t.subject}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                      {t.student_name || t.student_email} · {t.created_date ? new Date(t.created_date).toLocaleDateString() : ""}
                    </p>
                    {t.description && <p className="text-xs mt-2 line-clamp-2" style={{ color: "#334155" }}>{t.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {/* Status selector */}
                    <select value={t.status}
                      onChange={e => updateTicket.mutate({ id: t.id, data: { status: e.target.value } })}
                      className="text-xs px-2 py-1 rounded-lg outline-none"
                      style={{ background: `${statusColors[t.status]}18`, color: statusColors[t.status], border: `1px solid ${statusColors[t.status]}40` }}>
                      {["open", "in_progress", "resolved", "closed"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                    {/* Assign to */}
                    <input placeholder="Assign to…" defaultValue={t.assigned_to || ""}
                      onBlur={e => { if (e.target.value !== t.assigned_to) updateTicket.mutate({ id: t.id, data: { assigned_to: e.target.value } }); }}
                      className="text-xs px-2 py-1 rounded-lg outline-none w-28"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }} />
                  </div>
                </div>

                <button onClick={() => setExpanded(isOpen ? null : t.id)}
                  className="flex items-center gap-1.5 mt-3 text-xs transition-colors"
                  style={{ color: "#475569" }}>
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {isOpen ? "Hide" : "View replies & respond"}
                </button>
              </div>

              {/* Expanded: replies + reply box */}
              {isOpen && (
                <div className="border-t px-5 pb-5 pt-4 space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {/* Replies */}
                  {ticketReplies.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {ticketReplies.map(r => (
                        <div key={r.id} className={`flex gap-3 ${r.sender_role === "support" || r.sender_role === "admin" ? "flex-row-reverse" : "flex-row"}`}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                            style={{ background: r.sender_role === "student" ? "rgba(96,165,250,0.3)" : "linear-gradient(135deg, #fb923c, #f97316)" }}>
                            {r.sender_name?.[0] || "?"}
                          </div>
                          <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${r.sender_role === "student" ? "rounded-tl-sm" : "rounded-tr-sm"}`}
                            style={r.sender_role === "student"
                              ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }
                              : { background: "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(249,115,22,0.1))", border: "1px solid rgba(251,146,60,0.2)", color: "#e2e8f0" }}>
                            <p className="font-semibold mb-0.5" style={{ color: r.sender_role === "student" ? "#60a5fa" : "#fb923c" }}>{r.sender_name}</p>
                            {r.message}
                            <p className="text-right mt-1 opacity-50">{r.created_date ? new Date(r.created_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply box */}
                  {t.status !== "closed" ? (
                    <div className="flex items-end gap-2 rounded-xl p-2"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,146,60,0.2)" }}>
                      <textarea
                        placeholder="Type a reply…"
                        rows={2}
                        value={replyText[t.id] || ""}
                        onChange={e => setReplyText(p => ({ ...p, [t.id]: e.target.value }))}
                        className="flex-1 bg-transparent text-sm resize-none outline-none px-2 py-1"
                        style={{ color: "#e2e8f0" }}
                      />
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => sendReply.mutate({ ticketId: t.id, message: replyText[t.id] })}
                          disabled={!replyText[t.id]?.trim() || sendReply.isPending}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
                          style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>
                          <Send className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={() => updateTicket.mutate({ id: t.id, data: { status: "closed" } })}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110"
                          style={{ background: "rgba(71,85,105,0.3)", color: "#94a3b8" }}
                          title="Close ticket">
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-center py-2" style={{ color: "#334155" }}>
                      Ticket closed · <button className="underline" style={{ color: "#fb923c" }} onClick={() => updateTicket.mutate({ id: t.id, data: { status: "open" } })}>Reopen</button>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: "#334155" }}>
            <p className="text-sm">No tickets match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}