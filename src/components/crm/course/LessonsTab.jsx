import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { Plus, X, Play, Upload, Loader2, GripVertical, Eye, Lock } from "lucide-react";

const EMPTY_LESSON = { title: "", description: "", module_title: "", module_order: 1, video_url: "", duration_mins: "", order: 1, is_free_preview: false };

export default function LessonsTab({ course }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [form, setForm] = useState(EMPTY_LESSON);
  const [uploading, setUploading] = useState(false);

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", course.id],
    queryFn: () => api.lessons.listByCourse(course.id)
  });

  const createLesson = useMutation({
    mutationFn: (d) => api.lessons.create({ ...d, course_id: course.id, course_title: course.title }),
    onSuccess: () => { qc.invalidateQueries(["lessons", course.id]); setShowForm(false); setForm(EMPTY_LESSON); }
  });
  const updateLesson = useMutation({
    mutationFn: ({ id, data }) => api.lessons.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["lessons", course.id]); setEditLesson(null); setShowForm(false); }
  });
  const deleteLesson = useMutation({
    mutationFn: (id) => api.lessons.delete(id),
    onSuccess: () => qc.invalidateQueries(["lessons", course.id])
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await api.ai.uploadFile({ file });
    setForm(p => ({ ...p, video_url: file_url }));
    setUploading(false);
  };

  const openEdit = (lesson) => {
    setEditLesson(lesson);
    setForm({ ...EMPTY_LESSON, ...lesson });
    setShowForm(true);
  };

  const handleSubmit = () => {
    const data = { ...form, module_order: parseInt(form.module_order) || 1, order: parseInt(form.order) || 1, duration_mins: parseFloat(form.duration_mins) || undefined };
    if (editLesson) {
      updateLesson.mutate({ id: editLesson.id, data });
    } else {
      createLesson.mutate(data);
    }
  };

  // Group by module
  const modules = {};
  lessons.forEach(l => {
    const key = l.module_title || "Uncategorized";
    if (!modules[key]) modules[key] = { order: l.module_order || 99, lessons: [] };
    modules[key].lessons.push(l);
  });
  const sortedModules = Object.entries(modules).sort((a, b) => a[1].order - b[1].order);

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{lessons.length} lessons across {sortedModules.length} modules</p>
        <button onClick={() => { setShowForm(true); setEditLesson(null); setForm(EMPTY_LESSON); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
          <Plus className="w-4 h-4" /> Add Lesson
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.25)" }}>
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white">{editLesson ? "Edit Lesson" : "New Lesson"}</h4>
            <button onClick={() => { setShowForm(false); setEditLesson(null); }}><X className="w-4 h-4" style={{ color: "#475569" }} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Lesson Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
            <input placeholder="Module Title" value={form.module_title} onChange={e => setForm(p => ({ ...p, module_title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
            <input placeholder="Module Order" type="number" value={form.module_order} onChange={e => setForm(p => ({ ...p, module_order: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
            <input placeholder="Lesson Order" type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
            <input placeholder="Duration (mins)" type="number" value={form.duration_mins} onChange={e => setForm(p => ({ ...p, duration_mins: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
            <div className="flex items-center gap-3">
              <input type="checkbox" id="free" checked={form.is_free_preview} onChange={e => setForm(p => ({ ...p, is_free_preview: e.target.checked }))} className="w-4 h-4" />
              <label htmlFor="free" className="text-sm" style={{ color: "#94a3b8" }}>Free Preview</label>
            </div>
          </div>
          <textarea placeholder="Lesson description…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
          {/* Video URL or Upload */}
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "#64748b" }}>Video</label>
            <div className="flex gap-2">
              <input placeholder="Video URL (YouTube, Vimeo, or uploaded)" value={form.video_url} onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none min-h-[48px]" style={inputStyle} />
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all hover:scale-105"
                style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa" }}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading…" : "Upload"}
                <input type="file" accept="video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            {form.video_url && !uploading && (
              <p className="text-xs mt-1.5" style={{ color: "#34d399" }}>✓ Video URL set</p>
            )}
          </div>
          <button onClick={handleSubmit} disabled={!form.title || createLesson.isPending || updateLesson.isPending}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 min-h-[48px]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
            {createLesson.isPending || updateLesson.isPending ? "Saving…" : editLesson ? "Update" : "Add Lesson"}
          </button>
        </div>
      )}

      {/* Modules */}
      {sortedModules.length > 0 ? (
        <div className="space-y-4">
          {sortedModules.map(([moduleName, mod]) => (
            <div key={moduleName} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: "rgba(124,58,237,0.08)" }}>
                <GripVertical className="w-4 h-4" style={{ color: "#334155" }} />
                <h4 className="text-sm font-bold text-white">{moduleName}</h4>
                <span className="ml-auto text-xs" style={{ color: "#475569" }}>{mod.lessons.length} lessons</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {mod.lessons.sort((a, b) => (a.order || 0) - (b.order || 0)).map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: lesson.video_url ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)" }}>
                        {lesson.video_url ? <Play className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} /> : <div className="w-2 h-2 rounded-full" style={{ background: "#334155" }} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "#334155" }}>
                          {lesson.duration_mins && <span>{lesson.duration_mins} min</span>}
                          {lesson.is_free_preview ? <span className="flex items-center gap-0.5" style={{ color: "#34d399" }}><Eye className="w-3 h-3" /> Free Preview</span>
                            : <span className="flex items-center gap-0.5"><Lock className="w-3 h-3" /> Paid</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => openEdit(lesson)} className="text-xs px-2.5 py-1 rounded-lg transition-all"
                        style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>Edit</button>
                      <button onClick={() => deleteLesson.mutate(lesson.id)} className="text-xs px-2.5 py-1 rounded-lg transition-all"
                        style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && <p className="text-center py-8 text-sm" style={{ color: "#334155" }}>No lessons yet. Add your first lesson above.</p>
      )}
    </div>
  );
}