import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, X, User, Mail, Phone, BookOpen, ArrowRight, Target, Flame, CheckCircle2, BarChart3, Eye } from "lucide-react";

const PIPELINE_STAGES = [
  { id: "cold", label: "Cold Leads", icon: Target, color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
  { id: "interested", label: "Interested", icon: Flame, color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
  { id: "converted", label: "Converted", icon: CheckCircle2, color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
];

const sourceLabels = { organic: "🌿 Organic", referral: "👥 Referral", ad: "📢 Ad", social: "📱 Social", email: "📧 Email" };

const EMPTY_FORM = { name: "", email: "", phone: "", source: "organic", status: "cold", interested_course_title: "", notes: "" };

export default function LeadsSection({ user }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editLead, setEditLead] = useState(null);
  const [view, setView] = useState("pipeline"); // pipeline | table
  const [expandedLead, setExpandedLead] = useState(null);

  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: () => api.leads.list() });
  const { data: interests = [] } = useQuery({ queryKey: ["course-interests"], queryFn: () => api.courseInterests.list() });

  const createLead = useMutation({
    mutationFn: (d) => api.leads.create(d),
    onSuccess: () => { qc.invalidateQueries(["leads"]); setShowForm(false); setForm(EMPTY_FORM); }
  });
  const updateLead = useMutation({
    mutationFn: ({ id, data }) => api.leads.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["leads"]); setEditLead(null); }
  });
  const deleteLead = useMutation({
    mutationFn: (id) => api.leads.delete(id),
    onSuccess: () => qc.invalidateQueries(["leads"])
  });

  const handleSubmit = () => {
    if (editLead) {
      updateLead.mutate({ id: editLead.id, data: form });
    } else {
      createLead.mutate(form);
    }
  };

  const openEdit = (lead) => {
    setEditLead(lead);
    setForm({ name: lead.name || "", email: lead.email || "", phone: lead.phone || "", source: lead.source || "organic", status: lead.status || "cold", interested_course_title: lead.interested_course_title || "", notes: lead.notes || "" });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Lead Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>Track and convert potential students</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[{ id: "pipeline", label: "Pipeline" }, { id: "table", label: "Table" }].map(v => (
              <button key={v.id} onClick={() => setView(v.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: view === v.id ? "rgba(251,146,60,0.2)" : "transparent", color: view === v.id ? "#fb923c" : "#475569" }}>
                {v.label}
              </button>
            ))}
          </div>
          <button onClick={() => { setShowForm(true); setEditLead(null); setForm(EMPTY_FORM); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", boxShadow: "0 0 16px rgba(251,146,60,0.3)" }}>
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {PIPELINE_STAGES.map(s => {
          const count = leads.filter(l => l.status === s.id).length;
          const Icon = s.icon;
          return (
            <div key={s.id} className="rounded-2xl p-4 text-center"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
              <p className="text-2xl font-black" style={{ color: s.color }}>{count}</p>
              <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(251,146,60,0.25)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">{editLead ? "Edit Lead" : "New Lead"}</h3>
            <button onClick={() => { setShowForm(false); setEditLead(null); }}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: "name", placeholder: "Full Name" },
              { key: "email", placeholder: "Email Address" },
              { key: "phone", placeholder: "Phone Number" },
              { key: "interested_course_title", placeholder: "Interested Course" },
            ].map(f => (
              <input key={f.key} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
            ))}
            <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
              {Object.entries(sourceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
              <option value="cold">Cold</option>
              <option value="interested">Interested</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          <textarea placeholder="Notes…" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
          <button onClick={handleSubmit} disabled={!form.email || createLead.isPending || updateLead.isPending}
            className="w-full px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 min-h-[48px]"
            style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}>
            {(createLead.isPending || updateLead.isPending) ? "Saving…" : editLead ? "Update Lead" : "Add Lead"}
          </button>
        </div>
      )}

      {/* Pipeline View */}
      {view === "pipeline" && (
        <div className="grid lg:grid-cols-3 gap-4">
          {PIPELINE_STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage.id);
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="rounded-2xl p-4" style={{ background: stage.bg, border: `1px solid ${stage.border}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4" style={{ color: stage.color }} />
                  <h3 className="font-bold text-white text-sm">{stage.label}</h3>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${stage.color}20`, color: stage.color }}>{stageLeads.length}</span>
                </div>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01]"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{lead.name || lead.email}</p>
                          <p className="text-xs truncate" style={{ color: "#475569" }}>{lead.email}</p>
                          {lead.interested_course_title && (
                            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: stage.color }}>
                              <BookOpen className="w-3 h-3" />{lead.interested_course_title}
                            </p>
                          )}
                        </div>
                        <span className="text-xs px-1.5 py-0.5 rounded-lg flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                          {sourceLabels[lead.source]?.split(" ")[0]}
                        </span>
                      </div>
                      {expandedLead === lead.id && (
                        <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                          {lead.phone && <p className="text-xs flex items-center gap-1.5" style={{ color: "#64748b" }}><Phone className="w-3 h-3" />{lead.phone}</p>}
                          {lead.notes && <p className="text-xs p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", color: "#64748b" }}>{lead.notes}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            {/* Move stage buttons */}
                            {stage.id !== "cold" && (
                              <button onClick={e => { e.stopPropagation(); updateLead.mutate({ id: lead.id, data: { status: stage.id === "interested" ? "cold" : "interested" } }); }}
                                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                style={{ background: "rgba(255,255,255,0.05)", color: "#475569" }}>
                                ← Move Back
                              </button>
                            )}
                            {stage.id !== "converted" && (
                              <button onClick={e => { e.stopPropagation(); updateLead.mutate({ id: lead.id, data: { status: stage.id === "cold" ? "interested" : "converted" } }); }}
                                className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${stage.color}cc, ${stage.color})` }}>
                                Advance →
                              </button>
                            )}
                            <button onClick={e => { e.stopPropagation(); openEdit(lead); }}
                              className="px-2 py-1.5 rounded-lg text-xs transition-all"
                              style={{ background: "rgba(255,255,255,0.05)", color: "#475569" }}>✏️</button>
                            <button onClick={e => { e.stopPropagation(); deleteLead.mutate(lead.id); }}
                              className="px-2 py-1.5 rounded-lg text-xs transition-all"
                              style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>✕</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <p className="text-center py-6 text-xs" style={{ color: "#334155" }}>No leads</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-2xl overflow-auto" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Name", "Email", "Course Interest", "Source", "Stage", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#334155" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const stage = PIPELINE_STAGES.find(s => s.id === lead.status);
                return (
                  <tr key={lead.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-4 py-3 text-white font-medium">{lead.name || "—"}</td>
                    <td className="px-4 py-3" style={{ color: "#64748b" }}>{lead.email}</td>
                    <td className="px-4 py-3" style={{ color: "#a78bfa" }}>{lead.interested_course_title || "—"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#475569" }}>{sourceLabels[lead.source]}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${stage?.color}18`, color: stage?.color }}>
                        {stage?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(lead)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>Edit</button>
                        <button onClick={() => deleteLead.mutate(lead.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {leads.length === 0 && <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No leads yet</p>}
        </div>
      )}

      {/* Course Interest Tracking */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4" style={{ color: "#a78bfa" }} />
          <h2 className="text-lg font-bold text-white">Course Interest Tracking</h2>
          <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
            {interests.length} records
          </span>
        </div>
        {interests.length > 0 ? (
          <div className="rounded-2xl overflow-auto" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["User", "Course", "Views", "Last Viewed", "Purchased"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#334155" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interests.map(i => (
                  <tr key={i.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-4 py-3 text-white">{i.user_name || i.user_email}</td>
                    <td className="px-4 py-3" style={{ color: "#a78bfa" }}>{i.course_title}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#fb923c" }}>{i.view_count}</td>
                    <td className="px-4 py-3" style={{ color: "#475569" }}>{i.last_viewed ? new Date(i.last_viewed).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: i.purchased ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)", color: i.purchased ? "#34d399" : "#f87171" }}>
                        {i.purchased ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <BarChart3 className="w-8 h-8 mx-auto mb-2" style={{ color: "#1e293b" }} />
            <p className="text-sm" style={{ color: "#334155" }}>No course interest data yet. It will populate as users browse courses.</p>
          </div>
        )}
      </div>
    </div>
  );
}