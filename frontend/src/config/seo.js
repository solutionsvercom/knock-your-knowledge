import {
  canonicalUrl,
  INDEXABLE_PATHS,
  INTERNSHIPS_LISTING_SEO,
  isIndexablePath,
  SITE_ORIGIN,
  SMM_COURSE_SEO,
  SEO_COURSE_SEO,
  SEM_COURSE_SEO,
  SMO_COURSE_SEO,
  GSC_COURSE_SEO,
  AI_MARKETING_COURSE_SEO,
  AI_PRODUCTIVITY_COURSE_SEO,
  PROMPT_ENGINEERING_COURSE_SEO,
  AI_FUNDAMENTALS_COURSE_SEO,
  PYTHON_PROGRAMMING_COURSE_SEO,
} from "@/config/publicPaths";

export { canonicalUrl, SITE_ORIGIN } from "@/config/publicPaths";

export const SITE_NAME = "Knock Your Knowledge";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/kyk-logo.png`;

const STATIC_SEO = {
  "/": {
    title: "Knock Your Knowledge | Internship Courses in Development, AI, Analytics & Marketing",
    description:
      "Learn internship-ready skills at Knock Your Knowledge. Explore Development, AI & Prompt Engineering, Business Analytics, and Digital Marketing courses, bundles, and programs.",
    h1: "Learn Faster with AI Powered Learning",
  },
  "/Courses": {
    title: "Internship Courses Online | Development, AI, Analytics & Marketing | KYK",
    description:
      "Browse 17 KYK internship courses across Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing. Enroll in a single course or a full pack.",
    h1: "Internship Courses",
  },
  "/Bundles": {
    title: "Course Bundles | Save on KYK Internship Course Packs",
    description:
      "Buy KYK course bundles for Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing. Full track packs cost less than buying each course alone.",
    h1: "Course Bundles",
  },
  "/Internships": {
    title: INTERNSHIPS_LISTING_SEO.title,
    description: INTERNSHIPS_LISTING_SEO.description,
    h1: "Internship Programs",
  },
  "/Blog": {
    title: "Career Guide | Internship Tips & Interview Prep | KYK",
    description:
      "KYK Career Guide articles on landing your first internship and preparing for interviews across Development, AI, Analytics, and Digital Marketing tracks.",
    h1: "Career Guide",
  },
  "/LiveClasses": {
    title: "Live Classes | Interactive Sessions for KYK Internship Tracks",
    description:
      "See today’s KYK live classes for Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing. Sessions update from the admin panel.",
    h1: "Interactive Live Sessions",
  },
  "/About": {
    title: "About Knock Your Knowledge | Internship Courses & Career Support",
    description:
      "Knock Your Knowledge helps learners turn ambition into experience through internship courses, real programs, and career support across four practical tracks.",
    h1: "Knock Your Knowledge",
  },
};

export const COURSE_SEO = {
  "python-programming": {
    ...PYTHON_PROGRAMMING_COURSE_SEO,
  },
  "data-science": {
    title: "Data Science Course Online with Python & ML | KYK",
    description:
      "Study data analysis, visualization, and machine learning with Python, Pandas, and Scikit-learn. KYK Data Science internship course with practical modules and projects.",
    h1: "Data Science",
  },
  "mern-stack-development": {
    title: "MERN Stack Development Course Online | KYK",
    description:
      "Build full-stack web apps with MongoDB, Express, React, and Node.js. KYK MERN Stack internship course covering CRUD, auth, JWT, and a complete project.",
    h1: "MERN Stack Development",
  },
  "artificial-intelligence-fundamentals": {
    ...AI_FUNDAMENTALS_COURSE_SEO,
  },
  "prompt-engineering": {
    ...PROMPT_ENGINEERING_COURSE_SEO,
  },
  "8-best-ai-tools-for-productivity": {
    ...AI_PRODUCTIVITY_COURSE_SEO,
  },
  "sql-for-data-analysis": {
    title: "SQL Course for Data Analysis | KYK",
    description:
      "Write SQL queries to extract, transform, and analyse business data. KYK course on joins, aggregations, window functions, stored procedures, and an analytics project.",
    h1: "SQL for Data Analysis",
  },
  "python-for-analytics": {
    title: "Python for Data Analysis Course | KYK",
    description:
      "Use Python and Pandas for business analysis, reporting, and automated insights. KYK course on data cleaning, exploratory analysis, visualisation, and a business project.",
    h1: "Python for Analytics",
  },
  "power-bi-dashboarding": {
    title: "Power BI Course Online | KYK",
    description:
      "Design interactive Power BI dashboards with DAX, data modelling, and reporting. KYK internship course covering visuals, filters, and a live dashboard.",
    h1: "Power BI Dashboarding",
  },
  "tableau-visualization": {
    title: "Tableau Course Online | KYK",
    description:
      "Create Tableau dashboards with calculated fields, data blending, and storytelling. KYK visualisation course for business analytics internships.",
    h1: "Tableau Visualization",
  },
  "jira-for-project-management": {
    title: "Jira Project Management Course | KYK",
    description:
      "Learn Jira for Agile work — Scrum, Kanban, backlogs, sprints, reporting, and team workflows. Beginner project-management course at Knock Your Knowledge.",
    h1: "Jira for Project Management",
  },
  "seo-search-engine-optimization": {
    ...SEO_COURSE_SEO,
  },
  "sem-search-engine-marketing": {
    ...SEM_COURSE_SEO,
  },
  "smm-social-media-marketing": {
    ...SMM_COURSE_SEO,
  },
  "smo-social-media-optimization": {
    ...SMO_COURSE_SEO,
  },
  "google-webmaster-search-console": {
    ...GSC_COURSE_SEO,
  },
  "ai-tools-in-digital-marketing": {
    ...AI_MARKETING_COURSE_SEO,
  },
};

export const CAREER_SEO = {
  "how-to-land-your-first-internship": {
    title: "How to Land Your First Internship | KYK Career Guide",
    description:
      "A practical KYK guide to resumes, portfolios, outreach, and interviews so you can apply for Development, AI, Analytics, or Digital Marketing internships with a clear plan.",
    h1: "How to Land Your First Internship",
  },
  "internship-interview-prep": {
    title: "Internship Interview Prep Essentials | KYK Career Guide",
    description:
      "Prepare for KYK internship interviews with common questions, short project demos, communication tips, and follow-up — for Development, AI, Analytics, and Marketing tracks.",
    h1: "Internship Interview Prep Essentials",
  },
};

export const BUNDLE_SEO = {
  development: {
    title: "Development Course Bundle | Python, Data Science & MERN | KYK",
    description:
      "KYK Development bundle: Python Programming, Data Science, and MERN Stack together for ₹799/- instead of ₹897/-. Three courses in one pack.",
    h1: "Development Bundle",
  },
  ai: {
    title: "AI & Prompt Engineering Course Bundle | KYK",
    description:
      "KYK AI pack: Artificial Intelligence Fundamentals, Prompt Engineering, and 8 Best AI Tools for ₹499/- instead of ₹597/-. Three AI courses in one bundle.",
    h1: "AI & Prompt Engineering Bundle",
  },
  analytics: {
    title: "Business Analytics Course Bundle | SQL, Power BI & Tableau | KYK",
    description:
      "KYK Analytics pack: SQL, Python for Analytics, Power BI, Tableau, and Jira for ₹899/- instead of ₹995/-. Five business analytics courses in one bundle.",
    h1: "Business Analytics Bundle",
  },
  marketing: {
    title: "Digital Marketing Course Bundle | SEO, SEM & SMM | KYK",
    description:
      "KYK Marketing pack: SEO, SEM, SMM, SMO, Search Console, and AI Marketing for ₹799/- instead of ₹894/-. Six digital marketing courses in one bundle.",
    h1: "Advanced Digital Marketing Bundle",
  },
};

export const INTERNSHIP_SEO = {
  development: {
    title: "Development Internship Program | Python & MERN | KYK",
    description:
      "KYK Development internship: build with Python, MERN, and modern web stacks over 1–3 months. Remote/hybrid. Internship fee ₹3,999/- + 18% GST.",
    h1: "Development Internship",
  },
  ai: {
    title: "AI & Prompt Engineering Internship | ChatGPT & LLMs | KYK",
    description:
      "KYK AI & Prompt Engineering internship: design prompts, work with LLMs, and build AI-assisted workflows. Remote, 1–3 months. Fee ₹3,999/- + 18% GST.",
    h1: "AI & Prompt Engineering Internship",
  },
  analytics: {
    title: "Business Analytics Internship | SQL, Power BI & Tableau | KYK",
    description:
      "KYK Business Analytics internship: analyse data with SQL, Python, Power BI, and Tableau. Remote/hybrid, 1–3 months. Fee ₹3,999/- + 18% GST.",
    h1: "Business Analytics Internship",
  },
  marketing: {
    title: "Digital Marketing Internship | SEO, SEM & Social | KYK",
    description:
      "KYK Advanced Digital Marketing internship: SEO, SEM, social campaigns, and AI-powered marketing. Remote, 1–3 months. Fee ₹3,999/- + 18% GST.",
    h1: "Advanced Digital Marketing Internship",
  },
};

const PRIVATE_PREFIXES = [
  "/login",
  "/admin",
  "/Checkout",
  "/Dashboard",
  "/dashboard",
  "/dashbord",
  "/CourseLearning",
];

function isPrivatePath(pathname) {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function seoForPath(pathname) {
  const path = String(pathname || "/").split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const canonical = canonicalUrl(path);

  if (isPrivatePath(path)) {
    return {
      title: `${SITE_NAME} | Account`,
      description: "Sign in or manage your Knock Your Knowledge account.",
      canonical,
      noindex: true,
      ogType: "website",
    };
  }

  const videoMatch = path.match(/^\/Blog\/([^/]+)\/videos$/);
  if (videoMatch) {
    const slug = videoMatch[1];
    const course = COURSE_SEO[slug];
    if (course) {
      const courseLabel = course.productName || course.h1;
      return {
        title: `${courseLabel} Course Videos | KYK`,
        description: `Watch the ${courseLabel} video lessons at Knock Your Knowledge — five topics and twenty lessons. Enroll in this internship course to unlock playback.`,
        canonical: canonicalUrl(`/Blog/${slug}`),
        h1: `${courseLabel} videos`,
        ogType: "website",
        noindex: true,
      };
    }
  }

  const blogMatch = path.match(/^\/Blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const entry = COURSE_SEO[slug] || CAREER_SEO[slug];
    if (entry) {
      return {
        ...entry,
        canonical,
        ogType: CAREER_SEO[slug] ? "article" : "website",
      };
    }
    return {
      title: `Article | ${SITE_NAME}`,
      description: "KYK course or career guide article.",
      canonical,
      noindex: true,
      ogType: "website",
    };
  }

  const bundleMatch = path.match(/^\/Bundles\/([^/]+)$/);
  if (bundleMatch) {
    const entry = BUNDLE_SEO[bundleMatch[1]];
    if (entry) return { ...entry, canonical, ogType: "website" };
    return {
      title: `Bundle | ${SITE_NAME}`,
      description: "KYK course bundle.",
      canonical,
      noindex: true,
      ogType: "website",
    };
  }

  const internMatch = path.match(/^\/Internships\/([^/]+)$/);
  if (internMatch) {
    const entry = INTERNSHIP_SEO[internMatch[1]];
    if (entry) return { ...entry, canonical, ogType: "website" };
    return {
      title: `Internship | ${SITE_NAME}`,
      description: "KYK internship program.",
      canonical,
      noindex: true,
      ogType: "website",
    };
  }

  if (path === "/Home" || path === "/index.html" || path === "/index.htm") {
    return { ...STATIC_SEO["/"], canonical: canonicalUrl("/"), ogType: "website" };
  }

  if (STATIC_SEO[path]) {
    return { ...STATIC_SEO[path], canonical, ogType: "website" };
  }

  return {
    title: `Page Not Found | ${SITE_NAME}`,
    description: "This page could not be found on Knock Your Knowledge.",
    canonical,
    noindex: true,
    ogType: "website",
  };
}

export function listIndexableUrls() {
  return INDEXABLE_PATHS.filter((path) => isIndexablePath(path) && !seoForPath(path).noindex).map(
    (path) => ({ path, ...seoForPath(path) })
  );
}
