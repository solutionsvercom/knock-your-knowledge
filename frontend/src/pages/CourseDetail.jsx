import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { getStaticCourseDetailByTitle, normalizeTitle } from "@/data/courseCatalog";
import { asArray } from "@/lib/asArray";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, Globe, Award, ChevronDown, ChevronUp, CheckCircle2, Play, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";

const levelColors = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  advanced: "bg-red-100 text-red-700 border-red-200",
};

function formatLevelLabel(level) {
  const s = String(level || "beginner");
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function CourseDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  const courseTitle = urlParams.get("title");
  const [expandedModule, setExpandedModule] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const { data: course, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["course", courseId, courseTitle],
    queryFn: async () => {
      if (courseId) {
        return api.courses.getById(courseId);
      }
      const decodedTitle = courseTitle ? decodeURIComponent(courseTitle).trim() : "";
      if (decodedTitle) {
        const list = asArray(await api.courses.list("-createdAt"));
        const found = list.find((x) => normalizeTitle(x.title) === normalizeTitle(decodedTitle));
        if (found) return found;
        return getStaticCourseDetailByTitle(decodedTitle);
      }
      const courses = asArray(await api.courses.list("-createdAt", 1));
      return courses[0] || null;
    },
  });

  const canEnroll = Boolean(course?.id && !course?._catalogOnly);

  const enroll = useMutation({
    mutationFn: async () => {
      if (!course || !canEnroll) return;
      if (!isAuthenticated || !user?.email) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }
      const [existing] = await api.enrollments.mine().then((rows) =>
        rows.filter((r) => r.course_id === course.id)
      );
      if (existing) return existing;

      await api.payments.createCoursePayment({
        course_id: course.id,
        amount: Number(course.price || 0),
      });
      return api.enrollments.create({ course_id: course.id });
    },
    onSuccess: () => {
      if (course?.id) {
        window.location.href = `/CourseLearning?id=${encodeURIComponent(course.id)}`;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600 dark:text-red-400 text-center max-w-md">{error?.message || "Failed to load course."}</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Course not found</p>
      </div>
    );
  }

  const levelKey = String(course.level || "beginner").toLowerCase();
  const levelBadgeClass = levelColors[levelKey] || levelColors.beginner;

  const discount =
    course.original_price > 0 && course.price != null
      ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
      : 0;

  const moduleRows = Array.isArray(course.modules) ? course.modules : [];
  const videoRows = Array.isArray(course.videos) ? course.videos : [];
  const coverImage = course.thumbnail || course.image;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 dark:from-gray-900 dark:via-black dark:to-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${levelBadgeClass} border`}>{formatLevelLabel(course.level)}</Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">{course.category}</Badge>
                {course.has_certificate && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 border">
                    <Award className="w-3 h-3 mr-1" /> Certificate
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <strong className="text-white">{course.rating}</strong>
                  ({(course.reviews_count ?? 0).toLocaleString()} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {(course.students_count ?? 0).toLocaleString()} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {course.duration_hours} hours
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> {course.language || "English"}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <img src={course.instructor_image} alt={course.instructor} className="w-10 h-10 rounded-full object-cover max-w-full flex-shrink-0" loading="lazy" />
                <div>
                  <p className="text-xs text-gray-400">Instructor</p>
                  <p className="font-semibold text-sm">{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div className="relative order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden text-gray-900 dark:text-white lg:sticky lg:top-24">
                <div className="relative overflow-hidden">
                  <img src={coverImage} alt={course.title} className="w-full h-40 sm:h-48 object-cover object-center max-w-full" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-blue-600 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                    <span className="text-3xl font-bold">${course.price}</span>
                    {course.original_price > 0 && (
                      <span className="text-lg text-gray-400 line-through">${course.original_price}</span>
                    )}
                    {discount > 0 && Number.isFinite(discount) && (
                      <Badge className="bg-red-50 text-red-600 border-0">{discount}% OFF</Badge>
                    )}
                  </div>
                  {course._catalogOnly && (
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg p-3 border border-amber-200/50">
                      Preview catalog — this course isn&apos;t in your school database yet. Ask an admin to create it to enable enrollment and learning.
                    </p>
                  )}
                  <Button
                    onClick={() => enroll.mutate()}
                    disabled={!canEnroll || enroll.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl h-14 text-base font-bold mb-3 disabled:opacity-50"
                  >
                    {enroll.isPending ? "Processing..." : canEnroll ? "Enroll Now" : "Enrollment unavailable"}
                  </Button>
                  {canEnroll && (
                    <Button
                      variant="secondary"
                      className="w-full rounded-xl h-12 text-sm font-semibold mb-3"
                      onClick={() =>
                        addItem({
                          type: "course",
                          id: course.id,
                          title: course.title,
                          price: Number(course.price) || 0,
                          thumbnail: coverImage || "",
                        })
                      }
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to cart
                    </Button>
                  )}
                  <Button variant="outline" className="w-full rounded-xl h-12 text-sm mb-6">
                    Add to Wishlist
                  </Button>
                  <div className="space-y-3">
                    {[
                      `${course.lessons_count ?? moduleRows.length * 4} lessons`,
                      `${course.duration_hours} hours of content`,
                      "Certificate of completion",
                      "Lifetime access",
                      "24/7 AI tutor support",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="curriculum">
          <TabsList className="bg-gray-100 dark:bg-gray-900 rounded-xl p-1 mb-8 flex flex-wrap gap-1">
            <TabsTrigger value="curriculum" className="rounded-lg">Curriculum</TabsTrigger>
            <TabsTrigger value="videos" className="rounded-lg">Videos</TabsTrigger>
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold dark:text-white">Course Curriculum</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {moduleRows.length} modules •{" "}
                  {moduleRows.reduce((s, m) => s + (typeof m === "object" && m?.lessons ? m.lessons : 4), 0)} lessons
                </span>
              </div>
              <div className="space-y-3">
                {moduleRows.map((mod, i) => {
                  const title = typeof mod === "object" && mod?.title ? mod.title : String(mod);
                  const lessons = typeof mod === "object" && mod?.lessons != null ? mod.lessons : 4;
                  const durationMin = typeof mod === "object" && mod?.duration_min != null ? mod.duration_min : 45;
                  return (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lessons} lessons • {durationMin} min</p>
                          </div>
                        </div>
                        {expandedModule === i ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              {moduleRows.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">Curriculum will be updated soon.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold dark:text-white mb-6">Video lessons</h2>
              {videoRows.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No videos uploaded for this course yet.</p>
              ) : (
                <ul className="space-y-3">
                  {videoRows.map((v, i) => {
                    const title = typeof v === "object" && v?.title ? v.title : `Lesson ${i + 1}`;
                    const url = typeof v === "object" && v?.url ? v.url : "";
                    return (
                      <li
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                            <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{title}</p>
                            {v?.duration_min ? (
                              <p className="text-xs text-gray-500">{v.duration_min} min</p>
                            ) : null}
                          </div>
                        </div>
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap"
                          >
                            Watch
                          </a>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="overview">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold dark:text-white mb-4">About This Course</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.description}</p>
              <h3 className="text-lg font-bold dark:text-white mt-8 mb-3">Technologies Covered</h3>
              <div className="flex flex-wrap gap-2">
                {(course.tags || []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-lg px-3 py-1">{tag}</Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="max-w-3xl text-center py-12">
              <p className="text-gray-400">Reviews coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
