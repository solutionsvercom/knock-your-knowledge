import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { Video, Save, Loader2, ExternalLink, Radio } from "lucide-react";

const CLASS_TYPE_LABELS = {
  lecture: "Lecture",
  doubt_session: "Doubt session",
  workshop: "Workshop",
  webinar: "Webinar",
  mock_interview: "Mock interview",
};

function toLocalInput(iso) {
  if (!iso) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function emptyForm(track, existing) {
  return {
    title: existing?.title || `${track.title} — today's live class`,
    description: existing?.description || "",
    instructor: existing?.instructor || "KYK Mentor",
    classType: existing?.class_type || "lecture",
    date: toLocalInput(existing?.date),
    durationMins: existing?.duration_mins || 60,
    meetLink: existing?.meet_link || "",
    isLive: Boolean(existing?.is_live),
  };
}

function TrackCard({ track, existing, classTypes, onSaved }) {
  const [form, setForm] = useState(() => emptyForm(track, existing));
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setForm(emptyForm(track, existing));
  }, [track.id, existing?.id, existing?.updatedAt]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = useMutation({
    mutationFn: () =>
      adminApi.liveClasses.upsertTrack(track.id, {
        title: form.title,
        description: form.description,
        instructor: form.instructor,
        classType: form.classType,
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
        durationMins: Number(form.durationMins) || 60,
        meetLink: form.meetLink,
        isLive: form.isLive,
      }),
    onSuccess: (data) => {
      setMsg(data.message || "Saved.");
      onSaved?.();
    },
    onError: (err) => setMsg(err.message || "Could not save."),
  });

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a78bfa" }}>
            Internship track
          </p>
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {track.title}
          </h2>
        </div>
        {existing?.is_live ? (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
          >
            <Radio className="w-3 h-3" /> Live
          </span>
        ) : (
          <span className="text-xs" style={{ color: "#475569" }}>
            {existing ? "Scheduled today" : "No class yet"}
          </span>
        )}
      </div>

      <label className="block text-xs font-semibold" style={{ color: "#94a3b8" }}>
        Class title
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </label>

      <label className="block text-xs font-semibold" style={{ color: "#94a3b8" }}>
        Description
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={2}
          className="mt-1.5 w-full px-3 py-2 rounded-xl text-sm text-white outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block text-xs font-semibold" style={{ color: "#94a3b8" }}>
          Date & time
          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </label>
        <label className="block text-xs font-semibold" style={{ color: "#94a3b8" }}>
          Duration (mins)
          <input
            type="number"
            min={15}
            max={240}
            value={form.durationMins}
            onChange={(e) => set("durationMins", e.target.value)}
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </label>
        <label className="block text-xs font-semibold" style={{ color: "#94a3b8" }}>
          Instructor
          <input
            value={form.instructor}
            onChange={(e) => set("instructor", e.target.value)}
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </label>
        <label className="block text-xs font-semibold" style={{ color: "#94a3b8" }}>
          Class type
          <select
            value={form.classType}
            onChange={(e) => set("classType", e.target.value)}
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "#0b1224", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {(classTypes || Object.keys(CLASS_TYPE_LABELS)).map((t) => (
              <option key={t} value={t}>
                {CLASS_TYPE_LABELS[t] || t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-xs font-semibold" style={{ color: "#94a3b8" }}>
        Meet / join link
        <input
          value={form.meetLink}
          onChange={(e) => set("meetLink", e.target.value)}
          placeholder="https://meet.google.com/..."
          className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={form.isLive}
          onChange={(e) => set("isLive", e.target.checked)}
        />
        Mark as live now
      </label>

      {msg ? (
        <p className="text-xs" style={{ color: save.isError ? "#fca5a5" : "#86efac" }}>
          {msg}
        </p>
      ) : null}

      <button
        type="button"
        disabled={save.isPending}
        onClick={() => {
          setMsg("");
          save.mutate();
        }}
        className="w-full h-11 rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
      >
        {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save & notify students
      </button>
    </div>
  );
}

export default function AdminLiveClassesPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-live-classes"],
    queryFn: () => adminApi.liveClasses.list(),
  });

  const tracks = data?.tracks || [];
  const classTypes = data?.classTypes || Object.keys(CLASS_TYPE_LABELS);
  const upcoming = useMemo(() => data?.classes || [], [data]);

  if (isLoading) return <p className="text-slate-400 text-sm">Loading live classes…</p>;
  if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Today&apos;s live classes
        </h1>
        <p className="text-sm mt-0.5 text-slate-500">
          Set a separate class for each of the 4 internship tracks. Saving updates the Live Classes page and sends
          student dashboard notifications.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            existing={data?.todayByTrack?.[track.id]}
            classTypes={classTypes}
            onSaved={() => qc.invalidateQueries({ queryKey: ["admin-live-classes"] })}
          />
        ))}
      </div>

      {upcoming.length > 0 ? (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="px-5 py-3 border-b border-white/5">
            <p className="text-sm font-bold text-white inline-flex items-center gap-2">
              <Video className="w-4 h-4" style={{ color: "#a78bfa" }} /> Upcoming / today
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {upcoming.map((cls) => (
              <div key={cls.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{cls.title}</p>
                  <p className="text-xs text-slate-500">
                    {cls.track_title} · {cls.date ? new Date(cls.date).toLocaleString("en-IN") : "—"} · {cls.duration_mins} mins
                  </p>
                </div>
                {cls.meet_link ? (
                  <a
                    href={cls.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs inline-flex items-center gap-1"
                    style={{ color: "#67e8f9" }}
                  >
                    Join <ExternalLink className="w-3 h-3" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
