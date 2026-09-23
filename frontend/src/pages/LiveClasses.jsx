import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveClasses } from "@/api/liveClassesApi";
import { asArray } from "@/lib/asArray";
import { ApiQueryStatus } from "@/components/common/ApiQueryStatus";
import { Calendar as CalendarIcon, Users, Play, ExternalLink } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const classTypeStyles = {
  lecture: { background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" },
  doubt_session: { background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" },
  workshop: { background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" },
  webinar: { background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.25)" },
  mock_interview: { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
};

const classTypeLabels = {
  lecture: "Lecture",
  doubt_session: "Doubt Session",
  workshop: "Workshop",
  webinar: "Webinar",
  mock_interview: "Mock Interview",
};

export default function LiveClasses() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tab, setTab] = useState("upcoming");

  const {
    data: classesRaw,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["live-classes"],
        queryFn: async () => {
          try {
            const data = await fetchLiveClasses();
            return data.classes || [];
          } catch {
            return [];
          }
        },
    refetchInterval: 20000,
  });

  const classes = asArray(classesRaw);
  const selectedKey = format(selectedDate, "yyyy-MM-dd");
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const onSelectedDay = useMemo(
    () =>
      classes.filter((c) => {
        if (!c?.date) return false;
        try {
          return format(new Date(c.date), "yyyy-MM-dd") === selectedKey;
        } catch {
          return false;
        }
      }),
    [classes, selectedKey]
  );
  const liveNow =
    onSelectedDay.find((c) => c.is_live) ||
    (selectedKey === todayKey ? classes.find((c) => c.is_live) : null);
  const upcoming = onSelectedDay.filter((c) => c.id !== liveNow?.id);

  const joinClass = (cls) => {
    if (cls?.meet_link) {
      window.open(cls.meet_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      {/* Header */}
      <div className="py-16 border-b" style={{ borderColor: "rgba(167,139,250,0.15)", background: "linear-gradient(180deg, rgba(124,58,237,0.05) 0%, transparent 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5"
            style={{ background: "rgba(52,211,153,0.1)", borderColor: "rgba(52,211,153,0.3)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium" style={{ color: "#34d399" }}>Live Classes Available</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Interactive{" "}
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Live Sessions
            </span>
          </h1>
          <p style={{ color: "#475569" }}>
            Today&apos;s sessions for Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing — updated from the KYK admin panel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <CalendarIcon className="w-4 h-4" style={{ color: "#60a5fa" }} /> Schedule
              </h3>
              <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} className="rounded-xl" />
            </div>

            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="font-semibold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Class Types</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(classTypeLabels).map(([key, label]) => (
                  <span key={key} className="px-2.5 py-1 rounded-full text-xs font-medium" style={classTypeStyles[key] || {}}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div>
            <ApiQueryStatus
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => refetch()}
              loadingLabel="Loading live classes from API…"
            >
              <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {["upcoming", "my"].map((t) => (
                  <button key={t} type="button" onClick={() => setTab(t)}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                    style={{
                      background: tab === t ? "rgba(167,139,250,0.2)" : "transparent",
                      color: tab === t ? "#a78bfa" : "#475569",
                      border: tab === t ? "1px solid rgba(167,139,250,0.3)" : "1px solid transparent",
                    }}>
                    {t === "my" ? "My Sessions" : "Upcoming"}
                  </button>
                ))}
              </div>
              <p className="text-xs" style={{ color: "#475569" }}>
                Showing {format(selectedDate, "MMM d, yyyy")}
              </p>
              </div>

            {/* Live Now */}
            {liveNow && (
              <div className="rounded-2xl p-8 text-white mb-6"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)", boxShadow: "0 0 40px rgba(124,58,237,0.3)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold">Live Now</span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{liveNow.title}</h2>
                <p className="text-white/70 mb-1 text-sm">{liveNow.track_title}</p>
                <p className="text-white/70 mb-4">{liveNow.description || "Join this live internship session."}</p>
                <button
                  type="button"
                  onClick={() => joinClass(liveNow)}
                  disabled={!liveNow.meet_link}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <Play className="w-4 h-4" /> {liveNow.meet_link ? "Join Now" : "Link coming soon"}
                </button>
              </div>
            )}

            {/* Upcoming */}
            <div className="space-y-4">
              {upcoming.map((cls) => {
                const classDate = new Date(cls.date);
                const isToday = format(classDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                const isTomorrow = format(classDate, "yyyy-MM-dd") === format(new Date(Date.now() + 86400000), "yyyy-MM-dd");

                return (
                  <div key={cls.id} className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(167,139,250,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                      <div className="text-center flex-shrink-0 min-w-[100px]">
                        <p className="text-xs font-medium" style={{ color: "#60a5fa" }}>
                          {isToday ? "Today" : isTomorrow ? "Tomorrow" : format(classDate, "EEEE, MMM d")}
                        </p>
                        <p className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{format(classDate, "h:mm a")}</p>
                        <p className="text-xs" style={{ color: "#334155" }}>{cls.duration_mins} mins</p>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={classTypeStyles[cls.class_type] || {}}>
                            {classTypeLabels[cls.class_type] || "Session"}
                          </span>
                          {cls.track_title ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" }}>
                              {cls.track_title}
                            </span>
                          ) : null}
                          {cls.is_free && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
                              Free
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{cls.title}</h3>
                        <p className="text-sm mt-1" style={{ color: "#475569" }}>{cls.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm" style={{ color: "#334155" }}>
                          <span className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                              {cls.instructor?.[0]}
                            </div>
                            {cls.instructor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {cls.registered_count}/{cls.max_students}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => joinClass(cls)}
                        disabled={!cls.meet_link}
                        className="w-full md:w-auto min-h-[48px] px-6 rounded-xl text-base font-semibold text-white self-start md:self-center transition-all hover:scale-105 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 16px rgba(59,130,246,0.3)" }}
                      >
                        {cls.meet_link ? (
                          <>Join <ExternalLink className="w-4 h-4" /></>
                        ) : (
                          "Link soon"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {!isLoading && !isError && upcoming.length === 0 && !liveNow ? (
              <p className="text-center py-12 text-sm" style={{ color: "#475569" }}>
                No live sessions scheduled for this date yet. Check back after admin posts today&apos;s classes.
              </p>
            ) : null}
            </ApiQueryStatus>
          </div>
        </div>
      </div>
    </div>
  );
}