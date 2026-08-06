/**
 * Static demo data for frontend-only mode (no backend / MongoDB).
 */
import { CATEGORIES } from "./courseCatalog";

function slugify(title) {
  return String(title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseHours(duration) {
  const n = parseInt(String(duration).match(/\d+/)?.[0] || "40", 10);
  return Number.isFinite(n) ? n : 40;
}

function parseStudents(studentsStr) {
  if (!studentsStr) return 1000;
  const s = String(studentsStr);
  const m = s.match(/([\d.]+)\s*K/i);
  if (m) return Math.round(parseFloat(m[1]) * 1000);
  const n = parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 1000;
}

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";

/** Build API-shaped courses from the marketing catalog. */
export function buildDemoCourses() {
  const courses = [];
  for (const cat of CATEGORIES) {
    for (const c of cat.courses) {
      const id = `course-${slugify(c.title)}`;
      const hours = parseHours(c.duration);
      const cover = c.image || c.thumbnail || FALLBACK_COVER;
      const modules = (c.modules || []).map((name) => ({
        title: typeof name === "string" ? name : name.title,
        lessons: 4,
        duration_min: 45,
      }));
      courses.push({
        id,
        title: c.title,
        category: cat.label,
        level: String(c.level || "Beginner").toLowerCase(),
        instructor: c.instructor || "KYK Team",
        price: 49,
        original_price: 99,
        short_description: c.shortDesc,
        description: c.shortDesc,
        duration_hours: hours,
        language: "English",
        has_certificate: !!c.badge,
        thumbnail: cover,
        image: cover,
        instructor_image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        tags: c.tags || c.tools || [],
        modules,
        rating: c.rating ?? 4.8,
        reviews_count: 128,
        students_count: parseStudents(c.students),
        lessons_count: modules.length * 4,
        status: "published",
        videos: (c.modules || []).slice(0, 3).map((name, i) => ({
          title: typeof name === "string" ? name : name.title,
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          duration_min: 8 + i * 2,
          order: i,
        })),
        createdAt: "2025-01-01T00:00:00.000Z",
        created_date: "2025-01-01T00:00:00.000Z",
      });
    }
  }
  return courses;
}

export const DEMO_COURSES = buildDemoCourses();

export const DEMO_BUNDLES = [
  {
    id: "bundle-dev-starter",
    name: "Developer Starter Pack",
    title: "Developer Starter Pack",
    description: "Python, MERN Stack, and Data Science — everything to launch as a developer.",
    price: 3999,
    course_ids: DEMO_COURSES.filter((c) =>
      ["Python Programming", "MERN Stack Development", "Data Science"].includes(c.title)
    ).map((c) => c.id),
    status: "published",
    created_date: "2025-02-01T00:00:00.000Z",
  },
  {
    id: "bundle-ai-mastery",
    name: "AI Mastery Bundle",
    title: "AI Mastery Bundle",
    description: "AI Fundamentals, Prompt Engineering, and top AI productivity tools.",
    price: 3999,
    course_ids: DEMO_COURSES.filter((c) =>
      [
        "Artificial Intelligence Fundamentals",
        "Prompt Engineering",
        "8 Best AI Tools for Productivity",
      ].includes(c.title)
    ).map((c) => c.id),
    status: "published",
    created_date: "2025-02-15T00:00:00.000Z",
  },
  {
    id: "bundle-marketing-pro",
    name: "Digital Marketing Pro",
    title: "Digital Marketing Pro",
    description: "SEO, social growth, and AI marketing tools in one career track.",
    price: 3999,
    course_ids: DEMO_COURSES.filter((c) =>
      [
        "SEO — Search Engine Optimization",
        "SMO — Social Media Optimization",
        "AI Tools in Digital Marketing",
      ].includes(c.title)
    ).map((c) => c.id),
    status: "published",
    created_date: "2025-03-01T00:00:00.000Z",
  },
].map((b) => ({ ...b, courses: b.course_ids }));

export const DEMO_INTERNSHIPS = [
  {
    id: "intern-development",
    title: "Development",
    company: "Knock Your Knowledge",
    description:
      "Build real products with Python, MERN, and modern web stacks. Ship features with mentors and grow into a full-stack developer role.",
    location: "Remote / Hybrid",
    work_type: "hybrid",
    duration: "3–6 months",
    stipend: "₹3999/-",
    skills: ["Python", "React", "Node.js", "MongoDB", "Git"],
    deadline: "2026-12-31T00:00:00.000Z",
    applicants: 248,
    openings: 25,
    company_logo: "",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    id: "intern-ai-prompt",
    title: "AI & Prompt Engineering",
    company: "Knock Your Knowledge",
    description:
      "Design prompts, work with LLMs, and build AI-assisted workflows for real use cases across ChatGPT, Claude, and productivity tools.",
    location: "Remote",
    work_type: "remote",
    duration: "3–6 months",
    stipend: "₹3999/-",
    skills: ["Prompt Engineering", "ChatGPT", "Claude", "AI Tools", "NLP"],
    deadline: "2026-12-31T00:00:00.000Z",
    applicants: 312,
    openings: 20,
    company_logo: "",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  },
  {
    id: "intern-business-analytics",
    title: "Business Analytics",
    company: "Knock Your Knowledge",
    description:
      "Analyze business data with SQL, Python, Power BI, and Tableau. Turn insights into dashboards and decisions partners can use.",
    location: "Remote / Hybrid",
    work_type: "hybrid",
    duration: "3–6 months",
    stipend: "₹3999/-",
    skills: ["SQL", "Python", "Power BI", "Tableau", "Excel"],
    deadline: "2026-12-31T00:00:00.000Z",
    applicants: 198,
    openings: 18,
    company_logo: "",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: "intern-digital-marketing",
    title: "Advanced Digital Marketing",
    company: "Knock Your Knowledge",
    description:
      "Run SEO, SEM, social campaigns, and AI-powered marketing experiments. Learn growth tactics used by modern digital teams.",
    location: "Remote",
    work_type: "remote",
    duration: "3–6 months",
    stipend: "₹3999/-",
    skills: ["SEO", "Google Ads", "Social Media", "Analytics", "Content"],
    deadline: "2026-12-31T00:00:00.000Z",
    applicants: 276,
    openings: 22,
    company_logo: "",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
  },
];

function daysFromNow(days, hour = 18) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const DEMO_LIVE_CLASSES = [
  {
    id: "live-1",
    title: "Live: React Hooks Deep Dive",
    description: "React patterns live with Q&A",
    date: daysFromNow(0, 19),
    duration_mins: 90,
    class_type: "lecture",
    instructor: "James Rivera",
    registered_count: 86,
    max_students: 120,
    is_live: true,
    is_free: true,
    live_students: 86,
  },
  {
    id: "live-2",
    title: "Doubt Clearing: Python & Pandas",
    description: "Bring your coding questions",
    date: daysFromNow(1, 17),
    duration_mins: 60,
    class_type: "doubt",
    instructor: "Sarah Patel",
    registered_count: 42,
    max_students: 80,
    is_live: false,
    is_free: true,
  },
  {
    id: "live-3",
    title: "Career Workshop: Portfolio Reviews",
    description: "Get feedback on your projects",
    date: daysFromNow(3, 18),
    duration_mins: 75,
    class_type: "workshop",
    instructor: "Alex Chen",
    registered_count: 58,
    max_students: 100,
    is_live: false,
    is_free: false,
  },
  {
    id: "live-4",
    title: "Prompt Engineering Lab",
    description: "Hands-on prompting for productivity",
    date: daysFromNow(5, 16),
    duration_mins: 60,
    class_type: "lecture",
    instructor: "Lisa Monroe",
    registered_count: 71,
    max_students: 150,
    is_live: false,
    is_free: true,
  },
];

/** Seed admin for local demo (matches previous seed defaults). */
export const DEMO_ADMIN = {
  id: "user-admin",
  email: "vinay@gmail.com",
  full_name: "Vinay Admin",
  password: "12345678",
  role: "admin",
};

export function lessonsForCourse(course) {
  if (!course) return [];
  const mods = Array.isArray(course.modules) ? course.modules : [];
  const lessons = [];
  mods.forEach((mod, mi) => {
    const title = typeof mod === "string" ? mod : mod.title;
    const count = typeof mod === "object" && mod.lessons ? mod.lessons : 3;
    for (let i = 0; i < count; i++) {
      lessons.push({
        id: `lesson-${course.id}-${mi}-${i}`,
        course_id: course.id,
        course_title: course.title,
        title: `${title} — Part ${i + 1}`,
        description: `Learn ${title} with guided examples.`,
        duration_mins: 12 + i * 3,
        order: mi * 10 + i,
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
      });
    }
  });
  return lessons;
}
