/**
 * Course blog posts derived from the internship course catalog (+ career guides).
 */
import { CATEGORIES } from "./courseCatalog";

export function slugifyTitle(title) {
  return String(title || "")
    .trim()
    .toLowerCase()
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildFromCatalog() {
  const posts = [];
  for (const cat of CATEGORIES) {
    for (const c of cat.courses) {
      const tags = c.tags || c.tools || [];
      const modules = c.modules || [];
      posts.push({
        slug: slugifyTitle(c.title),
        title: c.title,
        category: cat.label,
        categoryId: cat.id,
        image: c.image || "",
        shortDesc: c.shortDesc,
        duration: c.duration,
        level: c.level,
        instructor: c.instructor,
        students: c.students,
        rating: c.rating,
        tags,
        modules,
        iconColor: c.iconColor || cat.color,
        excerpt: c.shortDesc,
        intro: `${c.shortDesc} At Knock Your Knowledge (KYK), this internship course is built for learners who want hands-on practice, mentor guidance, and career-ready skills — not just theory.`,
        whyLearn: `Whether you are preparing for an internship or upskilling for your first role, ${c.title} helps you build confidence with practical modules, real projects, and clear learning outcomes aligned to industry expectations.`,
        whoFor: [
          "Students and graduates preparing for internships",
          "Career switchers building a job-ready portfolio",
          `Anyone starting or growing in ${cat.label.toLowerCase()}`,
        ],
        outcomes: modules.map(
          (m) => `Gain practical experience in ${typeof m === "string" ? m : m.title}`
        ),
        readMins: Math.max(4, Math.min(12, Math.round((parseInt(String(c.duration), 10) || 20) / 5))),
      });
    }
  }
  return posts;
}

/** Extra career blogs to complete 19 articles (catalog has 17 courses). */
const EXTRA_BLOGS = [
  {
    slug: "how-to-land-your-first-internship",
    title: "How to Land Your First Internship",
    category: "Career Guide",
    categoryId: "career",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
    shortDesc: "A practical roadmap to find, apply for, and win your first internship opportunity.",
    duration: "Guide",
    level: "Beginner",
    instructor: "KYK Career Team",
    students: "—",
    rating: 4.9,
    tags: ["Internships", "Career", "Applications"],
    modules: ["Resume basics", "Portfolio tips", "Outreach", "Interview prep", "Follow-up"],
    iconColor: "#60a5fa",
    excerpt: "A practical roadmap to find, apply for, and win your first internship opportunity.",
    intro:
      "Landing your first internship can feel overwhelming — but with a clear plan, you can stand out. KYK helps learners build skills and connect with real programs across Development, AI, Analytics, and Marketing.",
    whyLearn:
      "This guide walks you through resume prep, portfolio projects, outreach messages, and interview confidence so you can apply to KYK internship programs with clarity.",
    whoFor: [
      "College students seeking their first internship",
      "Fresh graduates exploring career tracks",
      "Anyone new to professional applications",
    ],
    outcomes: [
      "Build a simple internship-ready resume",
      "Showcase projects that recruiters notice",
      "Write strong WhatsApp / email outreach",
      "Prepare for common internship interview questions",
      "Choose the right KYK internship track",
    ],
    readMins: 7,
  },
  {
    slug: "internship-interview-prep",
    title: "Internship Interview Prep Essentials",
    category: "Career Guide",
    categoryId: "career",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    shortDesc: "Prepare for internship interviews with confidence — questions, demos, and soft skills that matter.",
    duration: "Guide",
    level: "Beginner",
    instructor: "KYK Career Team",
    students: "—",
    rating: 4.8,
    tags: ["Interviews", "Soft Skills", "Internships"],
    modules: ["Common questions", "Project demos", "Communication", "Problem solving", "Follow-up"],
    iconColor: "#a78bfa",
    excerpt: "Prepare for internship interviews with confidence — questions, demos, and soft skills that matter.",
    intro:
      "Internship interviews test curiosity, learning ability, and clarity more than years of experience. This KYK guide helps you prepare stories, project demos, and calm communication for every track.",
    whyLearn:
      "Use this checklist before interviews for Development, AI & Prompt Engineering, Business Analytics, or Advanced Digital Marketing roles.",
    whoFor: [
      "Students shortlisted for internship interviews",
      "Learners finishing KYK internship courses",
      "Anyone nervous about first professional interviews",
    ],
    outcomes: [
      "Answer “tell me about yourself” clearly",
      "Present a project in under 3 minutes",
      "Handle basic technical / domain questions",
      "Show teamwork and learning mindset",
      "Follow up professionally after interviews",
    ],
    readMins: 6,
  },
];

export const COURSE_BLOGS = [...buildFromCatalog(), ...EXTRA_BLOGS];

export function getBlogBySlug(slug) {
  return COURSE_BLOGS.find((p) => p.slug === slug) || null;
}

export function getRelatedBlogs(slug, limit = 3) {
  const current = getBlogBySlug(slug);
  if (!current) return COURSE_BLOGS.slice(0, limit);
  const same = COURSE_BLOGS.filter((p) => p.slug !== slug && p.categoryId === current.categoryId);
  const rest = COURSE_BLOGS.filter((p) => p.slug !== slug && p.categoryId !== current.categoryId);
  return [...same, ...rest].slice(0, limit);
}
