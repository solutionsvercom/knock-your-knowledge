import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const EMPTY = { title: "", description: "", price: "", course_ids: "" };

export default function BundlesSection({ bundles = [] }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = useMutation({
    mutationFn: () => {
      const courses = String(form.course_ids || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const title = String(form.title || "").trim();
      const data = {
        name: title,
        title,
        description: form.description,
        price: Number(form.price || 0),
        courses,
      };
      return editing
        ? api.bundles.update(editing.id, data)
        : api.bundles.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-bundles"] });
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY);
    },
  });

  const del = useMutation({
    mutationFn: (id) => api.bundles.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-bundles"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Bundles</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
            {bundles.length} bundles
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm(EMPTY);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          <Plus className="w-4 h-4" /> Add Bundle
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(167,139,250,0.25)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">{editing ? "Edit bundle" : "New bundle"}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4" style={{ color: "#64748b" }} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} placeholder="Bundle title" value={form.title} onChange={(e) => set("title", e.target.value)} />
            <input className="px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} placeholder="Price" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <textarea className="mt-4 w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} rows={3} placeholder="Description" value={form.description} onChange={(e) => set("description", e.target.value)} />
          <input className="mt-4 w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} placeholder="Course IDs (comma-separated)" value={form.course_ids} onChange={(e) => set("course_ids", e.target.value)} />
          <div className="flex gap-3 mt-5">
            <button onClick={() => save.mutate()} disabled={!form.title || save.isPending} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              {save.isPending ? "Saving..." : editing ? "Update Bundle" : "Create Bundle"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bundles.map((b) => (
          <div key={b.id} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-base font-bold text-white">{b.name || b.title}</h3>
            <p className="text-xs mt-2 min-h-[40px]" style={{ color: "#64748b" }}>{b.description || "No description"}</p>
            <p className="text-sm mt-3 text-white font-semibold">${b.price || 0}</p>
            <div className="flex gap-2 pt-3 mt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                onClick={() => {
                  setEditing(b);
                  setForm({
                    title: b.name || b.title || "",
                    description: b.description || "",
                    price: b.price || "",
                    course_ids: Array.isArray(b.courses)
                      ? b.courses.join(", ")
                      : Array.isArray(b.course_ids)
                        ? b.course_ids.join(", ")
                        : "",
                  });
                  setShowForm(true);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Delete this bundle?")) del.mutate(b.id);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

