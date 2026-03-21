import React, { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { ApiQueryStatus } from "@/components/common/ApiQueryStatus";
import AIChat from "../components/learning/AIChat";
import LessonSidebar from "../components/learning/LessonSidebar";
import VideoPlayer from "../components/learning/VideoPlayer";
import LessonInfo from "../components/learning/LessonInfo";

const FALLBACK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

function buildLessonsFromApi(lessonRows, course) {
  const rows = asArray(lessonRows);
  if (rows.length > 0) {
    return rows.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration_mins ? `${l.duration_mins} min` : "—",
      completed: false,
      videoUrl: (l.video_url && String(l.video_url).trim()) || FALLBACK_VIDEO,
      description: l.description || "",
    }));
  }
  const vids = Array.isArray(course?.videos) ? course.videos : [];
  if (vids.length > 0) {
    return vids.map((v, i) => ({
      id: `video-${i}-${v.url || i}`,
      title: v.title || `Video ${i + 1}`,
      duration: v.duration_min != null ? `${v.duration_min} min` : "—",
      completed: false,
      videoUrl: (v.url && String(v.url).trim()) || FALLBACK_VIDEO,
      description: v.title || "",
    }));
  }
  return [];
}

export default function CourseLearning() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  const videoTimeRef = useRef(0);

  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
    error: courseErr,
    refetch: refetchCourse,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => api.courses.getById(courseId),
    enabled: Boolean(courseId),
  });

  const { data: lessonRows, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => api.lessons.listByCourse(courseId),
    enabled: Boolean(courseId),
  });

  const lessons = useMemo(() => buildLessonsFromApi(lessonRows, course), [lessonRows, course]);

  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (!lessons.length) {
      setActiveLesson(null);
      return;
    }
    const stillValid = activeLesson && lessons.some((l) => l.id === activeLesson.id);
    if (!stillValid) setActiveLesson(lessons[0]);
  }, [lessons, activeLesson]);

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <p className="text-slate-400">Missing course id. Open a course from the catalog.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <ApiQueryStatus
        isLoading={courseLoading}
        isError={courseError}
        error={courseErr}
        onRetry={() => refetchCourse()}
        loadingLabel="Loading course…"
      >
        {/* Top bar */}
        <div
          className="border-b px-6 py-3 flex items-center justify-between"
          style={{ background: "rgba(2,8,23,0.9)", borderColor: "rgba(167,139,250,0.15)", backdropFilter: "blur(20px)" }}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-0.5" style={{ color: "#a78bfa" }}>
              Now Learning
            </p>
            <h1 className="text-base font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {course?.title || "Course"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "#475569" }}>
              {completedCount}/{Math.max(lessons.length, 1)} lessons
            </span>
            <div className="w-32 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
              />
            </div>
            <span className="text-sm font-semibold" style={{ color: "#a78bfa" }}>
              {progress}%
            </span>
          </div>
        </div>

        {lessonsLoading ? (
          <div className="flex justify-center py-20">
            <p className="text-sm text-slate-500">Loading lessons…</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-20 px-4">
            <p className="text-slate-400 mb-4">No lessons or videos are linked to this course in the API yet.</p>
            <p className="text-sm text-slate-600">Add lessons (or course videos) in the admin panel / database.</p>
          </div>
        ) : activeLesson ? (
          <div className="flex h-[calc(100vh-116px)]">
            <LessonSidebar lessons={lessons} activeLesson={activeLesson} onSelect={setActiveLesson} />
            <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
              <VideoPlayer lesson={activeLesson} videoTimeRef={videoTimeRef} />
              <LessonInfo lesson={activeLesson} lessons={lessons} onSelect={setActiveLesson} />
            </div>
            <AIChat lesson={activeLesson} course={course} videoTimeRef={videoTimeRef} />
          </div>
        ) : null}
      </ApiQueryStatus>
    </div>
  );
}
