import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { Plus, Pencil, Trash2, X, BookOpen, Users, Star, DollarSign } from "lucide-react";

const EMPTY = { title: "", category: "programming", level: "beginner", instructor: "", price: "", original_price: "", short_description: "", description: "", duration_hours: "", language: "English", has_certificate: true, thumbnail: "", image: "" };

const levelColors = { beginner: "#34d399", intermediate: "#fbbf24", advanced: "#f87171" };
const catColors = { programming: "#60a5fa", "data science": "#a78bfa", design: "#fb923c", marketing: "#f43f5e", business: "#34d399" };

export default function CoursesSection({ courses: coursesProp, teachers }) {
  const courses = asArray(coursesProp);
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditing(c); setShowForm(true); };

  const save = useMutation({
    mutationFn: () => {
      const data = { ...form, price: Number(form.price), original_price: Number(form.original_price), duration_hours: Number(form.duration_hours) };
      return editing ? api.courses.update(editing.id, data) : api.courses.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-courses"] });
      qc.invalidateQueries({ queryKey: ["catalog-courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course"] });
      setShowForm(false);
    }
  });

  const del = useMutation({
    mutationFn: id => api.courses.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["crm-courses"] });
      qc.invalidateQueries({ queryKey: ["catalog-courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course"] });
    }
  });

  const teacherNames = teachers.map(t => t.full_name).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Courses</h1>
          <p className="text-sm mt-0.5" style={{ color: "#475569" }}>{courses.length} published courses</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 16px rgba(124,58,237,0.35)" }}>
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl p-6" style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(167,139,250,0.25)" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">{editing ? "Edit Course" : "New Course"}</h3>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "title", label: "Title", placeholder: "Course title" },
              { key: "instructor", label: "Instructor", placeholder: "Instructor name", type: "select", options: teacherNames },
              { key: "price", label: "Price ($)", placeholder: "49", type: "number" },
              { key: "original_price", label: "Original Price ($)", placeholder: "99", type: "number" },
              { key: "duration_hours", label: "Duration (hours)", placeholder: "10", type: "number" },
              { key: "language", label: "Language", placeholder: "English" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>{f.label}</label>
                {f.type === "select" ? (
                  <select value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
                    <option value="">Select teacher</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type || "text"} placeholder={f.placeholder} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
                )}
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
                {["programming", "data science", "design", "marketing", "business"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Level</label>
              <select value={form.level} onChange={e => set("level", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }}>
                {["beginner", "intermediate", "advanced"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Thumbnail URL</label>
              <input value={form.thumbnail || form.image || ""} onChange={e => set("thumbnail", e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Short Description</label>
            <textarea value={form.short_description} onChange={e => set("short_description", e.target.value)} rows={2} placeholder="Brief description shown on cards"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#475569" }}>Full Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Full course description"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" }} />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.has_certificate} onChange={e => set("has_certificate", e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm" style={{ color: "#94a3b8" }}>Certificate included</span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => save.mutate()} disabled={!form.title || save.isPending}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              {save.isPending ? "Saving…" : editing ? "Update Course" : "Create Course"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c, index) => (
          <div
            key={c?.id != null && String(c.id) !== "" ? String(c.id) : `course-row-${index}`}
            className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {(c.thumbnail || c.image) && <img src={c.thumbnail || c.image} alt={c.title} className="w-full h-36 object-cover" />}
            {!c.thumbnail && !c.image && (
              <div className="w-full h-28 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${catColors[c.category] || "#a78bfa"}20, ${catColors[c.category] || "#a78bfa"}08)` }}>
                <BookOpen className="w-8 h-8" style={{ color: catColors[c.category] || "#a78bfa", opacity: 0.5 }} />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                  style={{ background: `${catColors[c.category] || "#a78bfa"}15`, color: catColors[c.category] || "#a78bfa" }}>{c.category}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: `${levelColors[c.level]}15`, color: levelColors[c.level] || "#94a3b8" }}>{c.level}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{c.title}</h3>
              <p className="text-xs mb-3" style={{ color: "#475569" }}>{c.instructor}</p>
              <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "#334155" }}>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.students_count || 0}</span>
                {c.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{c.rating}</span>}
                <span className="flex items-center gap-1 font-bold ml-auto" style={{ color: "#34d399" }}><DollarSign className="w-3 h-3" />{c.price}</span>
              </div>
              <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}>
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => { if (window.confirm("Delete this course?")) del.mutate(c.id); }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && !showForm && (
        <div className="text-center py-16">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "#1e293b" }} />
          <p className="text-sm mb-4" style={{ color: "#334155" }}>No courses yet. Create your first course.</p>
        </div>
      )}
    </div>
  );
}