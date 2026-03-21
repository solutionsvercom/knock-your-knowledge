import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { X, Save } from "lucide-react";

const EMPTY = {
  title: "", short_description: "", description: "", category: "programming",
  level: "beginner", instructor: "", price: "", original_price: "",
  duration_hours: "", language: "English", has_certificate: true, tags: ""
};

export default function CourseForm({ course, onClose, instructorName }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (course) {
      setForm({ ...EMPTY, ...course, tags: course.tags?.join(", ") || "" });
    } else {
      setForm({ ...EMPTY, instructor: instructorName || "" });
    }
  }, [course, instructorName]);

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const invalidateCourseCaches = () => {
    qc.invalidateQueries({ queryKey: ["crm-courses"] });
    qc.invalidateQueries({ queryKey: ["t-courses"] });
    qc.invalidateQueries({ queryKey: ["catalog-courses"] });
    qc.invalidateQueries({ queryKey: ["courses"] });
    qc.invalidateQueries({ queryKey: ["course"] });
  };

  const createCourse = useMutation({
    mutationFn: (d) => api.courses.create(d),
    onSuccess: () => { invalidateCourseCaches(); onClose(); }
  });
  const updateCourse = useMutation({
    mutationFn: ({ id, data }) => api.courses.update(id, data),
    onSuccess: () => { invalidateCourseCaches(); onClose(); }
  });

  const handleSubmit = () => {
    const data = {
      ...form,
      price: parseFloat(form.price) || 0,
      original_price: parseFloat(form.original_price) || undefined,
      duration_hours: parseFloat(form.duration_hours) || undefined,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };
    if (course) {
      updateCourse.mutate({ id: course.id, data });
    } else {
      createCourse.mutate(data);
    }
  };

  const isPending = createCourse.isPending || updateCourse.isPending;

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" };
  const Input = ({ k, placeholder, type = "text" }) => (
    <input type={type} placeholder={placeholder} value={form[k]} onChange={f(k)}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
  );
  const Select = ({ k, options }) => (
    <select value={form[k]} onChange={f(k)} className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );

  return (
    <div className="rounded-2xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.25)" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{course ? "Edit Course" : "Create New Course"}</h3>
        <button onClick={onClose}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Course Title *</label>
          <Input k="title" placeholder="e.g. Complete React Masterclass" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Instructor *</label>
          <Input k="instructor" placeholder="Instructor name" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Category</label>
          <Select k="category" options={[["programming","Programming"],["data science","Data Science"],["design","Design"],["marketing","Marketing"],["business","Business"]]} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Level</label>
          <Select k="level" options={[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]]} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Price ($)</label>
          <Input k="price" type="number" placeholder="49.99" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Original Price ($)</label>
          <Input k="original_price" type="number" placeholder="99.99" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Duration (hours)</label>
          <Input k="duration_hours" type="number" placeholder="12.5" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Language</label>
          <Input k="language" placeholder="English" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Short Description</label>
          <input placeholder="Brief overview shown on course cards…" value={form.short_description} onChange={f("short_description")}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Full Description</label>
          <textarea placeholder="Detailed course description…" value={form.description} onChange={f("description")} rows={4}
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Tags (comma separated)</label>
          <Input k="tags" placeholder="React, JavaScript, Hooks, Frontend" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>Course Image URL</label>
          <Input k="image" placeholder="https://images.unsplash.com/..." />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="cert" checked={form.has_certificate} onChange={e => setForm(p => ({ ...p, has_certificate: e.target.checked }))}
            className="w-4 h-4 rounded" />
          <label htmlFor="cert" className="text-sm" style={{ color: "#94a3b8" }}>Includes Certificate</label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button onClick={handleSubmit} disabled={!form.title || !form.instructor || isPending}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:scale-105 min-h-[48px]"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 16px rgba(124,58,237,0.3)" }}>
          <Save className="w-4 h-4" />
          {isPending ? "Saving…" : course ? "Update Course" : "Create Course"}
        </button>
        <button onClick={onClose} className="w-full sm:w-auto px-4 py-3 rounded-xl text-sm min-h-[48px]" style={{ color: "#475569" }}>Cancel</button>
      </div>
    </div>
  );
}