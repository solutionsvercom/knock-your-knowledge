import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, X, Upload, Loader2, FileText, Download, Trash2, File } from "lucide-react";

const typeColors = { pdf: "#f87171", doc: "#60a5fa", zip: "#fbbf24", image: "#a78bfa", other: "#64748b" };
const typeIcons = { pdf: "📄", doc: "📝", zip: "🗜️", image: "🖼️", other: "📎" };

export default function ResourcesTab({ course }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", file_url: "", file_type: "pdf", lesson_title: "" });

  const { data: resources = [] } = useQuery({
    queryKey: ["resources", course.id],
    queryFn: () => api.resources.listByCourse(course.id)
  });

  const createResource = useMutation({
    mutationFn: (d) => api.resources.create({ ...d, course_id: course.id }),
    onSuccess: () => { qc.invalidateQueries(["resources", course.id]); setShowForm(false); setForm({ title: "", description: "", file_url: "", file_type: "pdf", lesson_title: "" }); }
  });
  const deleteResource = useMutation({
    mutationFn: (id) => api.resources.delete(id),
    onSuccess: () => qc.invalidateQueries(["resources", course.id])
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop().toLowerCase();
    const type = ["pdf"].includes(ext) ? "pdf" : ["doc", "docx"].includes(ext) ? "doc" : ["zip", "rar"].includes(ext) ? "zip" : ["jpg", "jpeg", "png", "gif"].includes(ext) ? "image" : "other";
    const { file_url } = await api.ai.uploadFile({ file });
    setForm(p => ({ ...p, file_url, file_type: type, title: p.title || file.name }));
    setUploading(false);
  };

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{resources.length} resources</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #d97706, #fbbf24)", boxShadow: "0 0 12px rgba(251,191,36,0.25)" }}>
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(251,191,36,0.25)" }}>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white">Add Resource</h4>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input placeholder="Resource Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            <input placeholder="Related Lesson (optional)" value={form.lesson_title} onChange={e => setForm(p => ({ ...p, lesson_title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            <select value={form.file_type} onChange={e => setForm(p => ({ ...p, file_type: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
              {["pdf", "doc", "zip", "image", "other"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          <input placeholder="Description (optional)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />

          {/* Upload or URL */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "#64748b" }}>File</label>
            <div className="flex gap-2">
              <input placeholder="File URL" value={form.file_url} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all hover:scale-105"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading…" : "Upload File"}
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {form.file_url && !uploading && <p className="text-xs mt-1" style={{ color: "#34d399" }}>✓ File ready</p>}
          </div>

          <button onClick={() => createResource.mutate(form)} disabled={!form.title || !form.file_url || createResource.isPending}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #d97706, #fbbf24)" }}>
            {createResource.isPending ? "Saving…" : "Add Resource"}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {resources.map(r => {
          const color = typeColors[r.file_type] || "#64748b";
          return (
            <div key={r.id} className="flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  {typeIcons[r.file_type] || "📎"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.title}</p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#334155" }}>
                    <span className="uppercase font-semibold" style={{ color }}>{r.file_type}</span>
                    {r.lesson_title && <span>· {r.lesson_title}</span>}
                    {r.description && <span>· {r.description}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {r.file_url && (
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-xl transition-all hover:scale-110"
                    style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
                <button onClick={() => deleteResource.mutate(r.id)}
                  className="p-2 rounded-xl transition-all hover:scale-110"
                  style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {resources.length === 0 && !showForm && (
          <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No resources yet</p>
        )}
      </div>
    </div>
  );
}