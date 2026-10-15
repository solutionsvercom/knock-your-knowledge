/**
 * 5 topics × 4 videos = 20 lessons per internship course.
 * Upload later to Cloudinary using the publicId on each lesson
 * (folder kyk/courses/{slug}/t01 … t05).
 */
import { COURSE_BLOGS, isCareerGuide, slugifyTitle } from "./courseBlogs";
import { cloudinaryVideoUrl } from "@/config/cloudinary";
import { courseUnitPrice } from "@/config/pricing";

const LESSON_LABELS = [
  "Introduction",
  "Core concepts",
  "Hands-on practice",
  "Project & recap",
];

const LESSON_MINS = [8, 12, 15, 10];

/**
 * Optional overrides after videos are uploaded.
 * Example:
 * { "python-programming": { "t01-v01": { publicId: "kyk/courses/python-programming/t01/v01", ready: true } } }
 */
export const COURSE_VIDEO_OVERRIDES = {};

export function catalogCourseId(slug) {
  return `course-${String(slug || "").trim()}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function topicTitlesForCourse(course) {
  const raw = Array.isArray(course?.modules) ? course.modules : [];
  const titles = raw
    .map((m) => (typeof m === "string" ? m : m?.title))
    .filter(Boolean);
  const filled = [...titles];
  while (filled.length < 5) {
    filled.push(`Topic ${filled.length + 1}`);
  }
  return filled.slice(0, 5);
}

function buildCurriculum({ slug, title, modules, image, category, categoryId, instructor }, cloudName = "") {
  const topics = topicTitlesForCourse({ modules }).map((topicTitle, ti) => {
    const topicKey = `t${pad2(ti + 1)}`;
    const videos = LESSON_LABELS.map((label, vi) => {
      const videoKey = `${topicKey}-v${pad2(vi + 1)}`;
      const publicId = `kyk/courses/${slug}/${topicKey}/v${pad2(vi + 1)}`;
      const override = COURSE_VIDEO_OVERRIDES[slug]?.[videoKey] || {};
      const resolvedPublicId = override.publicId || publicId;
      const url = override.url || cloudinaryVideoUrl(resolvedPublicId, cloudName);
      const ready = Boolean(url);
      return {
        id: `${catalogCourseId(slug)}-${videoKey}`,
        key: videoKey,
        title: `${topicTitle} — ${label}`,
        durationMins: LESSON_MINS[vi],
        publicId: resolvedPublicId,
        url,
        ready,
        isFreePreview: ti === 0 && vi === 0,
        order: ti * 4 + vi + 1,
      };
    });
    return {
      id: topicKey,
      title: topicTitle,
      videos,
    };
  });

  return {
    slug,
    courseId: catalogCourseId(slug),
    title,
    category,
    categoryId,
    instructor,
    image,
    topicCount: 5,
    videoCount: 20,
    topics,
  };
}

export function getAllCourseCurricula(cloudName = "") {
  return COURSE_BLOGS.filter((p) => !isCareerGuide(p)).map((post) =>
    buildCurriculum(post, cloudName)
  );
}

export function getCourseCurriculum(slug, cloudName = "") {
  const post = COURSE_BLOGS.find((p) => p.slug === slug && !isCareerGuide(p));
  if (!post) return null;
  return buildCurriculum(post, cloudName);
}

export function flattenCurriculumLessons(curriculum) {
  if (!curriculum?.topics) return [];
  return curriculum.topics.flatMap((topic) =>
    topic.videos.map((v) => ({
      ...v,
      module_title: topic.title,
      videoUrl: v.ready ? v.url : "",
      video_url: v.ready ? v.url : "",
      duration: `${v.durationMins} min`,
      duration_mins: v.durationMins,
      completed: false,
      description: `Part of ${topic.title} in ${curriculum.title}.`,
    }))
  );
}

export function catalogCourseProduct(postOrSlug) {
  const post =
    typeof postOrSlug === "string"
      ? COURSE_BLOGS.find((p) => p.slug === postOrSlug)
      : postOrSlug;
  if (!post || isCareerGuide(post)) return null;
  return {
    type: "course",
    id: catalogCourseId(post.slug),
    title: post.title,
    price: courseUnitPrice(post),
    thumbnail: post.image || "",
    slug: post.slug,
  };
}

export const CATALOG_COURSE_PRODUCTS = COURSE_BLOGS.filter((p) => !isCareerGuide(p))
  .map((p) => catalogCourseProduct(p))
  .filter(Boolean);

export function slugFromCourseId(courseId) {
  const id = String(courseId || "");
  if (id.startsWith("course-")) return id.slice("course-".length);
  return slugifyTitle(id);
}
