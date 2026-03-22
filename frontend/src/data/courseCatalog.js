/**
 * Course catalog: `CATEGORIES` static cards + `mergeStaticCatalogWithApi` merges Mongo rows by title.
 * `getWebsiteCourseCatalog` (used by Courses.jsx) returns that merged list.
 */
import {
  Code2,
  Database,
  Globe,
  Brain,
  Zap,
  Wrench,
  BarChart2,
  TrendingUp,
  PieChart,
  LayoutDashboard,
  ClipboardList,
  GitBranch,
  FileText,
  Search,
  Megaphone,
  Share2,
  Settings,
  LineChart,
  Sparkles,
  Palette,
  Briefcase,
  BookOpen,
} from "lucide-react";

/** Normalize DB category string for grouping (matches admin dropdown values). */
export function normalizeCategoryKey(raw) {
  return String(raw || "general")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Visual + tab id for each admin category — used when the site catalog is driven by API.
 */
const LIVE_CATEGORY_META = {
  programming: {
    id: "development",
    label: "Development",
    icon: Code2,
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
    border: "rgba(96,165,250,0.25)",
    iconBg: "rgba(96,165,250,0.12)",
  },
  "data science": {
    id: "data-science",
    label: "Data Science",
    icon: Database,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
    border: "rgba(167,139,250,0.25)",
    iconBg: "rgba(167,139,250,0.12)",
  },
  design: {
    id: "design",
    label: "Design",
    icon: Palette,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
    border: "rgba(251,146,60,0.25)",
    iconBg: "rgba(251,146,60,0.12)",
  },
  marketing: {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
    border: "rgba(251,146,60,0.25)",
    iconBg: "rgba(251,146,60,0.12)",
  },
  business: {
    id: "business",
    label: "Business",
    icon: Briefcase,
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    border: "rgba(52,211,153,0.25)",
    iconBg: "rgba(52,211,153,0.12)",
  },
  general: {
    id: "general",
    label: "Courses",
    icon: BookOpen,
    color: "#94a3b8",
    glow: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.25)",
    iconBg: "rgba(148,163,184,0.12)",
  },
};

const LIVE_CATEGORY_ORDER = ["programming", "data science", "design", "marketing", "business", "general"];

function defaultLiveSectionMeta(key) {
  const label = key
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    id: `cat-${key.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "other"}`,
    label: label || "Courses",
    icon: Sparkles,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.25)",
    iconBg: "rgba(167,139,250,0.12)",
  };
}

function apiCourseToCardForLive(c, meta) {
  const mods = Array.isArray(c.modules)
    ? c.modules.map((m) => (typeof m === "object" && m ? m.title || String(m) : String(m)))
    : [];
  return {
    id: c.id,
    title: c.title,
    icon: meta.icon,
    iconBg: meta.iconBg,
    iconColor: meta.color,
    shortDesc: c.short_description || c.description || "No description available.",
    duration: `${c.duration_hours ?? 0} hrs`,
    level: capitalizeLevel(c.level || "beginner"),
    instructor: c.instructor || "Team",
    students: c.students_count != null ? String(c.students_count) : "—",
    rating: c.rating,
    tags: Array.isArray(c.tags) && c.tags.length ? c.tags : undefined,
    badge: !!c.has_certificate,
    modules: mods.length ? mods : undefined,
    price: c.price ?? 0,
    thumbnail: c.thumbnail || c.image || "",
    image: c.image || c.thumbnail || "",
  };
}

/**
 * Build the public catalog purely from Mongo/API rows (admin panel = source of truth).
 * Courses are grouped by `category` (same values as admin form).
 */
export function buildLiveCatalogFromApi(apiCourses = []) {
  const list = (apiCourses || []).filter((c) => {
    if (!c || !rowId(c)) return false;
    const s = String(c.status ?? "published").trim().toLowerCase();
    if (s === "draft") return false;
    return true;
  });
  if (list.length === 0) return [];

  const groups = new Map();
  for (const c of list) {
    const key = normalizeCategoryKey(c.category);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  }

  const keys = [...groups.keys()];
  keys.sort((a, b) => {
    const ia = LIVE_CATEGORY_ORDER.indexOf(a);
    const ib = LIVE_CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return keys.map((key) => {
    const meta = LIVE_CATEGORY_META[key] || defaultLiveSectionMeta(key);
    const courses = groups.get(key).map((c) => apiCourseToCardForLive(c, meta));
    return {
      id: meta.id,
      label: meta.label,
      icon: meta.icon,
      color: meta.color,
      glow: meta.glow,
      border: meta.border,
      courses,
    };
  });
}

/**
 * Public Courses page: full static marketing catalog + overlay from API (match by title).
 * DB-only courses appear under "More courses". This avoids an empty or single-card page when the DB has few rows.
 */
export function getWebsiteCourseCatalog(apiCourses = []) {
  const list = Array.isArray(apiCourses) ? apiCourses : [];
  return mergeStaticCatalogWithApi(list);
}

export const CATEGORIES = [
  {
    id: "development",
    label: "Development",
    icon: Code2,
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
    border: "rgba(96,165,250,0.25)",
    courses: [
      {
        title: "Python Programming",
        icon: Code2,
        iconBg: "rgba(96,165,250,0.12)",
        iconColor: "#60a5fa",
        shortDesc:
          "Master Python from scratch — variables, loops, OOP, file handling and real-world projects.",
        duration: "40 hrs",
        level: "Beginner",
        instructor: "Alex Chen",
        students: "12.4K",
        rating: 4.8,
        tags: ["Python", "OOP", "Automation"],
        badge: true,
        modules: ["Python Basics", "Functions & Modules", "OOP Concepts", "File I/O & APIs", "Capstone Project"],
      },
      {
        title: "Data Science",
        icon: Database,
        iconBg: "rgba(167,139,250,0.12)",
        iconColor: "#a78bfa",
        shortDesc:
          "Explore data analysis, visualization and machine learning using Python, Pandas and Scikit-learn.",
        duration: "55 hrs",
        level: "Intermediate",
        instructor: "Sarah Patel",
        students: "9.1K",
        rating: 4.9,
        tags: ["Pandas", "NumPy", "ML", "Matplotlib"],
        badge: true,
        modules: ["Data Wrangling", "EDA", "ML Models", "Feature Engineering", "Deployment"],
      },
      {
        title: "MERN Stack Development",
        icon: Globe,
        iconBg: "rgba(52,211,153,0.12)",
        iconColor: "#34d399",
        shortDesc: "Build full-stack web apps using MongoDB, Express, React and Node.js end-to-end.",
        duration: "70 hrs",
        level: "Advanced",
        instructor: "James Rivera",
        students: "7.3K",
        rating: 4.7,
        tags: ["MongoDB", "Express", "React", "Node.js"],
        badge: true,
        modules: ["React Fundamentals", "Node & Express", "MongoDB CRUD", "Auth & JWT", "Full-Stack Project"],
      },
    ],
  },
  {
    id: "ai",
    label: "AI & Prompt Engineering",
    icon: Brain,
    color: "#e879f9",
    glow: "rgba(232,121,249,0.15)",
    border: "rgba(232,121,249,0.25)",
    courses: [
      {
        title: "Artificial Intelligence Fundamentals",
        icon: Brain,
        iconBg: "rgba(232,121,249,0.12)",
        iconColor: "#e879f9",
        shortDesc:
          "Understand core AI concepts — machine learning, neural networks, NLP and real-world AI applications.",
        duration: "35 hrs",
        level: "Beginner",
        instructor: "Dr. Meera Singh",
        students: "15.2K",
        rating: 4.9,
        tags: ["AI", "ML", "Neural Networks", "NLP"],
        badge: true,
        modules: ["Introduction to AI", "Machine Learning Basics", "Neural Networks", "NLP Essentials", "Real-world AI Use Cases"],
      },
      {
        title: "Prompt Engineering",
        icon: Zap,
        iconBg: "rgba(251,191,36,0.12)",
        iconColor: "#fbbf24",
        shortDesc: "Learn to craft powerful prompts for ChatGPT, Claude and Gemini to 10× your productivity.",
        duration: "15 hrs",
        level: "Beginner",
        instructor: "Lisa Monroe",
        students: "22.8K",
        rating: 4.8,
        tags: ["ChatGPT", "Claude", "Gemini", "Prompts"],
        badge: false,
        modules: ["Prompt Design Techniques", "Working with AI Tools", "Chain-of-Thought", "Few-Shot Prompting", "Advanced Use Cases"],
      },
      {
        title: "8 Best AI Tools for Productivity",
        icon: Wrench,
        iconBg: "rgba(6,182,212,0.12)",
        iconColor: "#06b6d4",
        shortDesc:
          "Hands-on deep-dive into the top 8 AI tools — Notion AI, Midjourney, Runway, Perplexity & more.",
        duration: "12 hrs",
        level: "Beginner",
        instructor: "Tom Watts",
        students: "18.5K",
        rating: 4.7,
        tags: ["Midjourney", "Runway", "Notion AI", "Perplexity"],
        badge: false,
        modules: ["Introduction to AI Tools", "Image & Video AI", "Writing & Research AI", "Coding Assistants", "Workflow Automation"],
      },
    ],
  },
  {
    id: "analytics",
    label: "Business Analytics",
    icon: BarChart2,
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    border: "rgba(52,211,153,0.25)",
    courses: [
      {
        title: "SQL for Data Analysis",
        icon: Database,
        iconBg: "rgba(96,165,250,0.12)",
        iconColor: "#60a5fa",
        shortDesc:
          "Write powerful SQL queries to extract, transform and analyse business data from relational databases.",
        duration: "25 hrs",
        level: "Beginner",
        instructor: "Nina Brooks",
        students: "10.6K",
        rating: 4.8,
        tools: ["MySQL", "PostgreSQL"],
        projects: ["Sales Dashboard", "Customer Segmentation"],
        badge: true,
        modules: ["SQL Basics", "Joins & Aggregations", "Window Functions", "Stored Procedures", "Analytics Project"],
      },
      {
        title: "Python for Analytics",
        icon: TrendingUp,
        iconBg: "rgba(167,139,250,0.12)",
        iconColor: "#a78bfa",
        shortDesc: "Apply Python and Pandas for business data analysis, reporting and automated insights.",
        duration: "30 hrs",
        level: "Intermediate",
        instructor: "Alex Chen",
        students: "8.2K",
        rating: 4.7,
        tools: ["Python", "Pandas", "Seaborn"],
        projects: ["Revenue Analysis", "KPI Dashboard"],
        badge: true,
        modules: ["Data Cleaning", "Exploratory Analysis", "Visualisation", "Reporting Automation", "Business Project"],
      },
      {
        title: "Power BI Dashboarding",
        icon: LayoutDashboard,
        iconBg: "rgba(251,146,60,0.12)",
        iconColor: "#fb923c",
        shortDesc: "Design interactive Power BI dashboards with DAX, data modelling and real-time reporting.",
        duration: "28 hrs",
        level: "Intermediate",
        instructor: "Rachel Kim",
        students: "9.7K",
        rating: 4.9,
        tools: ["Power BI", "DAX", "Power Query"],
        projects: ["Sales Report", "HR Analytics"],
        badge: true,
        modules: ["Power BI Basics", "DAX Formulas", "Data Modelling", "Visuals & Filters", "Live Dashboard"],
      },
      {
        title: "Tableau Visualization",
        icon: PieChart,
        iconBg: "rgba(52,211,153,0.12)",
        iconColor: "#34d399",
        shortDesc: "Create stunning Tableau dashboards with drag-and-drop analytics and storytelling techniques.",
        duration: "22 hrs",
        level: "Intermediate",
        instructor: "David Lee",
        students: "7.4K",
        rating: 4.7,
        tools: ["Tableau", "Tableau Prep"],
        projects: ["Market Trend Map", "Financial Dashboard"],
        badge: true,
        modules: ["Tableau Basics", "Calculated Fields", "Dashboard Design", "Data Blending", "Storytelling"],
      },
      {
        title: "Jira for Project Management",
        icon: ClipboardList,
        iconBg: "rgba(96,165,250,0.12)",
        iconColor: "#60a5fa",
        shortDesc: "Master Jira for Agile project management — sprints, backlogs, epics, and team workflows.",
        duration: "10 hrs",
        level: "Beginner",
        instructor: "Chris Taylor",
        students: "6.1K",
        rating: 4.6,
        tools: ["Jira", "Confluence"],
        projects: ["Sprint Board Setup", "Release Tracker"],
        badge: false,
        modules: ["Jira Basics", "Scrum & Kanban", "Backlogs & Sprints", "Reporting", "Team Workflow"],
      },
      {
        title: "Draw.io for Process Mapping",
        icon: GitBranch,
        iconBg: "rgba(232,121,249,0.12)",
        iconColor: "#e879f9",
        shortDesc: "Design professional flowcharts, process maps and system diagrams using Draw.io.",
        duration: "8 hrs",
        level: "Beginner",
        instructor: "Sara Gomez",
        students: "4.3K",
        rating: 4.5,
        tools: ["Draw.io", "Lucidchart"],
        projects: ["Business Process Map", "System Architecture"],
        badge: false,
        modules: ["Diagram Types", "Flowcharting", "Process Maps", "Data Flow Diagrams", "Publishing"],
      },
      {
        title: "Confluence Documentation",
        icon: FileText,
        iconBg: "rgba(251,191,36,0.12)",
        iconColor: "#fbbf24",
        shortDesc: "Build structured team wikis and technical documentation using Confluence best practices.",
        duration: "6 hrs",
        level: "Beginner",
        instructor: "Mark Jones",
        students: "3.8K",
        rating: 4.5,
        tools: ["Confluence", "Jira"],
        projects: ["Team Wiki", "API Docs"],
        badge: false,
        modules: ["Confluence Basics", "Page Templates", "Spaces & Permissions", "Jira Integration", "Documentation Strategy"],
      },
    ],
  },
  {
    id: "marketing",
    label: "Advanced Digital Marketing",
    icon: Megaphone,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.15)",
    border: "rgba(251,146,60,0.25)",
    courses: [
      {
        title: "SEO — Search Engine Optimization",
        icon: Search,
        iconBg: "rgba(52,211,153,0.12)",
        iconColor: "#34d399",
        shortDesc:
          "Rank higher on Google with technical SEO, on-page optimization, link building and keyword strategy.",
        duration: "30 hrs",
        level: "Intermediate",
        instructor: "Emily Ross",
        students: "14.1K",
        rating: 4.8,
        tags: ["Google", "Keywords", "Backlinks", "Technical SEO"],
        badge: true,
        modules: ["SEO Fundamentals", "Keyword Research", "On-Page SEO", "Technical SEO", "Link Building"],
      },
      {
        title: "SEM — Search Engine Marketing",
        icon: LineChart,
        iconBg: "rgba(96,165,250,0.12)",
        iconColor: "#60a5fa",
        shortDesc:
          "Run high-ROI Google Ads and Bing Ads campaigns — bidding, ad copy, quality score and retargeting.",
        duration: "25 hrs",
        level: "Intermediate",
        instructor: "Paul Martinez",
        students: "8.9K",
        rating: 4.7,
        tags: ["Google Ads", "PPC", "Retargeting"],
        badge: true,
        modules: ["Google Ads Setup", "Keyword Bidding", "Ad Copy", "Landing Pages", "ROI Optimisation"],
      },
      {
        title: "SMM — Social Media Marketing",
        icon: Share2,
        iconBg: "rgba(167,139,250,0.12)",
        iconColor: "#a78bfa",
        shortDesc:
          "Grow brand presence across Instagram, LinkedIn, X and YouTube with content strategies and paid ads.",
        duration: "28 hrs",
        level: "Beginner",
        instructor: "Jasmine Patel",
        students: "19.2K",
        rating: 4.9,
        tags: ["Instagram", "LinkedIn", "YouTube", "Paid Ads"],
        badge: true,
        modules: ["Platform Strategy", "Content Calendar", "Paid Social", "Analytics", "Influencer Marketing"],
      },
      {
        title: "SMO — Social Media Optimization",
        icon: TrendingUp,
        iconBg: "rgba(232,121,249,0.12)",
        iconColor: "#e879f9",
        shortDesc: "Optimise profiles, increase organic reach and build communities with advanced SMO tactics.",
        duration: "15 hrs",
        level: "Beginner",
        instructor: "Kevin Wu",
        students: "7.5K",
        rating: 4.6,
        tags: ["Organic Reach", "Hashtags", "Engagement"],
        badge: false,
        modules: ["Profile Optimisation", "Hashtag Strategy", "Engagement Tactics", "Community Building", "Analytics"],
      },
      {
        title: "Google Webmaster & Search Console",
        icon: Settings,
        iconBg: "rgba(251,191,36,0.12)",
        iconColor: "#fbbf24",
        shortDesc:
          "Use Google Search Console and Webmaster Tools to monitor, debug and grow your site's search presence.",
        duration: "10 hrs",
        level: "Beginner",
        instructor: "Emily Ross",
        students: "5.6K",
        rating: 4.7,
        tags: ["Search Console", "Core Web Vitals", "Indexing"],
        badge: false,
        modules: ["GSC Overview", "Performance Reports", "Index Coverage", "Core Web Vitals", "Sitemaps & Robots"],
      },
      {
        title: "AI Tools in Digital Marketing",
        icon: Sparkles,
        iconBg: "rgba(6,182,212,0.12)",
        iconColor: "#06b6d4",
        shortDesc:
          "Leverage AI tools — Jasper, Surfer SEO, Canva AI and ChatGPT — to automate and scale marketing.",
        duration: "18 hrs",
        level: "Intermediate",
        instructor: "Lisa Monroe",
        students: "11.4K",
        rating: 4.9,
        tags: ["Jasper", "Surfer SEO", "Canva AI", "ChatGPT"],
        badge: true,
        modules: ["AI for Content", "AI SEO Tools", "AI Ad Creatives", "Chatbot Marketing", "Automation Workflows"],
      },
    ],
  },
];

export function normalizeTitle(t) {
  return String(t || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function capitalizeLevel(level) {
  const s = String(level || "beginner");
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function parseStudentCountDisplay(studentsStr) {
  if (!studentsStr) return 1000;
  const s = String(studentsStr);
  const m = s.match(/([\d.]+)\s*K/i);
  if (m) return Math.round(parseFloat(m[1]) * 1000);
  const n = parseInt(s.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : 1000;
}

function apiCourseToCard(c) {
  const mods = Array.isArray(c.modules)
    ? c.modules.map((m) => (typeof m === "object" && m ? m.title || String(m) : String(m)))
    : [];
  return {
    id: rowId(c) || c.id,
    title: c.title,
    icon: Code2,
    iconBg: "rgba(96,165,250,0.12)",
    iconColor: "#60a5fa",
    shortDesc: c.short_description || c.description || "No description available.",
    duration: `${c.duration_hours ?? 0} hrs`,
    level: capitalizeLevel(c.level || "Beginner"),
    instructor: c.instructor || "Team",
    students: String(c.students_count ?? 0),
    rating: c.rating ?? 0,
    tags: c.tags || [],
    badge: !!c.has_certificate,
    modules: mods,
    price: c.price ?? 0,
    thumbnail: c.thumbnail || c.image || "",
    image: c.image || c.thumbnail || "",
  };
}

/**
 * Always show the full static catalog; attach Mongo ids when a course title matches the API.
 * API-only courses (no static row) are listed under "More courses".
 */
function rowId(row) {
  if (!row) return "";
  return String(row.id || row._id || "");
}

export function mergeStaticCatalogWithApi(apiCourses = []) {
  const apiByTitle = new Map();
  for (const a of apiCourses) {
    if (a?.title) apiByTitle.set(normalizeTitle(a.title), a);
  }
  const usedApiIds = new Set();

  const merged = CATEGORIES.map((cat) => ({
    ...cat,
    courses: cat.courses.map((staticCourse) => {
      const match = apiByTitle.get(normalizeTitle(staticCourse.title));
      if (match) {
        const mid = rowId(match);
        if (mid) usedApiIds.add(mid);
      }

      const mergedModules =
        Array.isArray(match?.modules) && match.modules.length
          ? typeof match.modules[0] === "object"
            ? match.modules.map((m) => m.title || String(m))
            : match.modules
          : staticCourse.modules;

      return {
        ...staticCourse,
        id: match ? rowId(match) || null : null,
        shortDesc: match
          ? match.short_description || match.description || staticCourse.shortDesc
          : staticCourse.shortDesc,
        duration:
          match && match.duration_hours != null ? `${match.duration_hours} hrs` : staticCourse.duration,
        level: match?.level ? capitalizeLevel(match.level) : staticCourse.level,
        instructor: match?.instructor || staticCourse.instructor,
        students:
          match && match.students_count != null ? String(match.students_count) : staticCourse.students,
        rating: match?.rating ?? staticCourse.rating,
        tags: match?.tags?.length ? match.tags : staticCourse.tags || staticCourse.tools,
        badge: match ? !!match.has_certificate : staticCourse.badge,
        modules: mergedModules || staticCourse.modules,
        price: match != null ? match.price ?? 0 : undefined,
        thumbnail: match?.thumbnail || match?.image || "",
        image: match?.image || match?.thumbnail || "",
      };
    }),
  }));

  const extras = apiCourses.filter((a) => {
    const id = rowId(a);
    return id && !usedApiIds.has(id);
  });
  if (extras.length === 0) return merged;

  return [
    ...merged,
    {
      id: "other",
      label: "More courses",
      icon: Code2,
      color: "#94a3b8",
      glow: "rgba(148,163,184,0.12)",
      border: "rgba(148,163,184,0.25)",
      courses: extras.map(apiCourseToCard),
    },
  ];
}

/** Fallback detail payload for CourseDetail when browsing by ?title= (no DB row). */
export function getStaticCourseDetailByTitle(rawTitle) {
  const nt = normalizeTitle(rawTitle);
  for (const cat of CATEGORIES) {
    for (const c of cat.courses) {
      if (normalizeTitle(c.title) === nt) {
        return staticCourseToDetail(c, cat.label);
      }
    }
  }
  return null;
}

function staticCourseToDetail(c, categoryLabel) {
  const h = parseInt(String(c.duration).match(/\d+/)?.[0] || "40", 10);
  const modules = (c.modules || []).map((name) => ({
    title: typeof name === "string" ? name : name.title,
    lessons: 4,
    duration_min: 45,
  }));
  return {
    _catalogOnly: true,
    id: null,
    title: c.title,
    description: c.shortDesc,
    short_description: c.shortDesc,
    category: categoryLabel,
    level: (c.level || "Beginner").toLowerCase(),
    instructor: c.instructor,
    price: 49,
    original_price: 99,
    rating: c.rating || 4.8,
    reviews_count: 128,
    students_count: parseStudentCountDisplay(c.students),
    duration_hours: h,
    language: "English",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    instructor_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    has_certificate: !!c.badge,
    tags: c.tags || c.tools || [],
    lessons_count: modules.length * 4,
    modules,
  };
}
