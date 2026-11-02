/** Crawlable public URLs and HTTP routing helpers. Keep sitemap and Express in sync with this list. */
export const SITE_ORIGIN = "https://knockyourknowledge.com";

export const COURSE_SLUGS = [
  "python-programming",
  "data-science",
  "mern-stack-development",
  "artificial-intelligence-fundamentals",
  "prompt-engineering",
  "8-best-ai-tools-for-productivity",
  "sql-for-data-analysis",
  "python-for-analytics",
  "power-bi-dashboarding",
  "tableau-visualization",
  "jira-for-project-management",
  "seo-search-engine-optimization",
  "sem-search-engine-marketing",
  "smm-social-media-marketing",
  "smo-social-media-optimization",
  "google-webmaster-search-console",
  "ai-tools-in-digital-marketing",
];

export const CAREER_SLUGS = ["how-to-land-your-first-internship", "internship-interview-prep"];

export const BUNDLE_SLUGS = ["development", "ai", "analytics", "marketing"];

export const INTERNSHIP_SLUGS = ["development", "ai", "analytics", "marketing"];

/** First-byte SEO for the internships listing HTML shell (Helmet replaces these after JS). */
export const INTERNSHIPS_LISTING_SEO = {
  title: "Internship Programs at KYK | Explore Career Opportunities",
  description:
    "Explore development, AI, business analytics and digital marketing internship programmes at KnockYourKnowledge. Discover programme details and apply online.",
};

export const CAREER_GUIDE_PATH = "/Blog";

/** First-byte + Helmet SEO for the Career Guide listing page only. */
export const CAREER_GUIDE_SEO = {
  title: "Career Guide | Internship Tips & Interview Prep | KYK",
  description:
    "KYK Career Guide: two articles on landing a first internship and internship interview prep. Then explore KYK’s paid internship programmes. Separate from courses and bundles.",
  h1: "Career Guide – Internship Tips and Interview Prep",
  ogImage: `${SITE_ORIGIN}/kyk-logo.png`,
  twitterCard: "summary_large_image",
};

export const ABOUT_PATH = "/About";

/** First-byte + Helmet SEO for the About Us page only. */
export const ABOUT_SEO = {
  title: "About Knock Your Knowledge | Paid Internship Programmes | KYK",
  description:
    "Knock Your Knowledge (KYK) offers paid, real-time internships in Development, AI, Analytics and Digital Marketing. Courses and bundles are separate products. About KYK, contact, and how to apply.",
  h1: "About Knock Your Knowledge",
  ogImage: `${SITE_ORIGIN}/kyk-logo.png`,
  twitterCard: "summary_large_image",
};

export const SMM_COURSE_PATH = "/Blog/smm-social-media-marketing";

/** First-byte + Helmet SEO for the SMM course page only. */
export const SMM_COURSE_SEO = {
  title: "Social Media Marketing Course & SMM Training | KYK",
  description:
    "Learn social media marketing with beginner-friendly SMM training covering Instagram, LinkedIn, X and YouTube, paid social, analytics and content calendars.",
  h1: "Social Media Marketing Course – Beginner SMM Training",
  ogImage: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "SMM — Social Media Marketing",
};

export const SEO_COURSE_PATH = "/Blog/seo-search-engine-optimization";

/** First-byte + Helmet SEO for the SEO course page only. */
export const SEO_COURSE_SEO = {
  title: "SEO Course & Search Engine Optimization Training | KYK",
  description:
    "Learn SEO with KYK's intermediate course: keyword research, on-page SEO, technical SEO and link building. 30 hours, 5 topics, 20 videos. ₹149 + 18% GST.",
  h1: "Search Engine Optimization Course – Intermediate SEO Training",
  ogImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "SEO — Search Engine Optimization",
};

export const SEM_COURSE_PATH = "/Blog/sem-search-engine-marketing";

/** First-byte + Helmet SEO for the SEM course page only. */
export const SEM_COURSE_SEO = {
  title: "SEM Course & Search Engine Marketing Training | KYK",
  description:
    "Learn SEM with KYK's intermediate course: Google Ads, keyword bidding, ad copy, landing pages and ROI. 25 hours, 5 topics, 20 videos. ₹149 + 18% GST.",
  h1: "Search Engine Marketing Course – Intermediate SEM Training",
  ogImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "SEM — Search Engine Marketing",
};

export const SMO_COURSE_PATH = "/Blog/smo-social-media-optimization";

/** First-byte + Helmet SEO for the SMO course page only. */
export const SMO_COURSE_SEO = {
  title: "SMO Course & Social Media Optimization Training | KYK",
  description:
    "Learn SMO with KYK's beginner course: profile optimisation, hashtag strategy, engagement and analytics. 15 hours, 5 topics, 20 videos. ₹149 + 18% GST.",
  h1: "Social Media Optimization Course – Beginner SMO Training",
  ogImage: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "SMO — Social Media Optimization",
};

export const GSC_COURSE_PATH = "/Blog/google-webmaster-search-console";

/** First-byte + Helmet SEO for the Google Webmaster & Search Console course page only. */
export const GSC_COURSE_SEO = {
  title: "Google Search Console Course & Webmaster Tools Training | KYK",
  description:
    "Learn Google Search Console with KYK's beginner course: indexing, performance, Core Web Vitals and sitemaps. 10 hours, 5 topics, 20 videos. ₹149 + 18% GST.",
  h1: "Google Search Console Course – Beginner GSC Training",
  ogImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Google Webmaster & Search Console",
};

export const AI_MARKETING_COURSE_PATH = "/Blog/ai-tools-in-digital-marketing";

/** First-byte + Helmet SEO for the AI Tools in Digital Marketing course page only. */
export const AI_MARKETING_COURSE_SEO = {
  title: "AI for Digital Marketing Course & AI Tools Training | KYK",
  description:
    "Learn AI for Digital Marketing with KYK's intermediate course: Jasper, Surfer SEO, Canva AI and ChatGPT. 18 hours, 5 topics, 20 videos. ₹149 + 18% GST.",
  h1: "AI Tools in Digital Marketing Course – Intermediate AI Marketing Training",
  ogImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "AI Tools in Digital Marketing",
};

export const AI_PRODUCTIVITY_COURSE_PATH = "/Blog/8-best-ai-tools-for-productivity";

/** First-byte + Helmet SEO for the 8 Best AI Tools for Productivity course page only. */
export const AI_PRODUCTIVITY_COURSE_SEO = {
  title: "AI Tools for Productivity Course | KYK",
  description:
    "Learn AI Tools for Productivity with KYK's beginner course: Notion AI, Midjourney, Runway and Perplexity. 12 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "8 Best AI Tools for Productivity Course – Beginner AI Productivity Tools Training",
  ogImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "8 Best AI Tools for Productivity",
};

export const PROMPT_ENGINEERING_COURSE_PATH = "/Blog/prompt-engineering";

/** First-byte + Helmet SEO for the Prompt Engineering course page only. */
export const PROMPT_ENGINEERING_COURSE_SEO = {
  title: "Prompt Engineering Course & ChatGPT Prompt Training | KYK",
  description:
    "Learn Prompt Engineering with KYK's beginner course: ChatGPT, Claude and Gemini. 15 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "Prompt Engineering Course – Beginner Prompt Engineering Training",
  ogImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Prompt Engineering",
};

export const AI_FUNDAMENTALS_COURSE_PATH = "/Blog/artificial-intelligence-fundamentals";

/** First-byte + Helmet SEO for the Artificial Intelligence Fundamentals course page only. */
export const AI_FUNDAMENTALS_COURSE_SEO = {
  title: "AI Fundamentals Course & Beginner AI Training | KYK",
  description:
    "Learn AI Fundamentals with KYK's beginner course: machine learning, neural networks and NLP. 35 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "Artificial Intelligence Fundamentals Course – Beginner AI Training",
  ogImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Artificial Intelligence Fundamentals",
};

export const PYTHON_PROGRAMMING_COURSE_PATH = "/Blog/python-programming";

/** First-byte + Helmet SEO for the Python Programming course page only. */
export const PYTHON_PROGRAMMING_COURSE_SEO = {
  title: "Python Programming Course & Beginner Python Training | KYK",
  description:
    "Learn Python Programming with KYK's beginner course: Python Basics, functions, OOP, files and APIs. 40 hours, 5 topics, 20 videos. ₹299 + 18% GST.",
  h1: "Python Programming Course – Beginner Python Training",
  ogImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Python Programming",
};

export const DATA_SCIENCE_COURSE_PATH = "/Blog/data-science";

/** First-byte + Helmet SEO for the Data Science course page only. */
export const DATA_SCIENCE_COURSE_SEO = {
  title: "Data Science Course & Intermediate Python ML Training | KYK",
  description:
    "Learn Data Science with KYK's intermediate course: Data Wrangling, EDA, ML Models, features and deployment. 55 hours, 5 topics, 20 videos. ₹299 + 18% GST.",
  h1: "Data Science Course – Intermediate Python ML Training",
  ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Data Science",
};

export const MERN_STACK_COURSE_PATH = "/Blog/mern-stack-development";

/** First-byte + Helmet SEO for the MERN Stack Development course page only. */
export const MERN_STACK_COURSE_SEO = {
  title: "MERN Stack Development Course & Full Stack Training | KYK",
  description:
    "Learn MERN Stack Development with KYK's advanced course: React, Node & Express, MongoDB CRUD, Auth & JWT. 70 hours, 5 topics, 20 videos. ₹299 + 18% GST.",
  h1: "MERN Stack Development Course – Advanced Full Stack Training",
  ogImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "MERN Stack Development",
};

export const JIRA_COURSE_PATH = "/Blog/jira-for-project-management";

/** First-byte + Helmet SEO for the Jira for Project Management course page only. */
export const JIRA_COURSE_SEO = {
  title: "Jira for Project Management Course & Jira Training | KYK",
  description:
    "Learn Jira for Project Management with KYK's beginner course: Jira Basics, Scrum & Kanban, Backlogs & Sprints, Reporting. 10 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "Jira for Project Management Course – Beginner Jira Training",
  ogImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Jira for Project Management",
};

export const SQL_COURSE_PATH = "/Blog/sql-for-data-analysis";

/** First-byte + Helmet SEO for the SQL for Data Analysis course page only. */
export const SQL_COURSE_SEO = {
  title: "SQL for Data Analysis Course & SQL Training | KYK",
  description:
    "Learn SQL for Data Analysis with KYK's beginner course: SQL Basics, Joins & Aggregations, Window Functions, Stored Procedures. 25 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "SQL for Data Analysis Course – Beginner SQL Training",
  ogImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "SQL for Data Analysis",
};

export const POWER_BI_COURSE_PATH = "/Blog/power-bi-dashboarding";

/** First-byte + Helmet SEO for the Power BI Dashboarding course page only. */
export const POWER_BI_COURSE_SEO = {
  title: "Power BI Dashboarding Course & Power BI Training | KYK",
  description:
    "Learn Power BI Dashboarding with KYK's intermediate course: Power BI Basics, DAX Formulas, Data Modelling, Visuals & Filters. 28 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "Power BI Dashboarding Course – Intermediate Power BI Training",
  ogImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Power BI Dashboarding",
};

export const TABLEAU_COURSE_PATH = "/Blog/tableau-visualization";

/** First-byte + Helmet SEO for the Tableau Visualization course page only. */
export const TABLEAU_COURSE_SEO = {
  title: "Tableau Visualization Course & Tableau Training | KYK",
  description:
    "Learn Tableau Visualization with KYK's intermediate course: Tableau Basics, Calculated Fields, Dashboard Design, Data Blending. 22 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "Tableau Visualization Course – Intermediate Tableau Training",
  ogImage: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Tableau Visualization",
};

export const PYTHON_FOR_ANALYTICS_COURSE_PATH = "/Blog/python-for-analytics";

/** First-byte + Helmet SEO for the Python for Analytics course page only. */
export const PYTHON_FOR_ANALYTICS_COURSE_SEO = {
  title: "Python for Analytics Course & Pandas Training | KYK",
  description:
    "Learn Python for Analytics with KYK's intermediate course: Data Cleaning, Exploratory Analysis, Visualisation, Reporting Automation. 30 hours, 5 topics, 20 videos. ₹199 + 18% GST.",
  h1: "Python for Analytics Course – Intermediate Python Analytics Training",
  ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Python for Analytics",
};

export const DEVELOPMENT_BUNDLE_PATH = "/Bundles/development";

/** First-byte + Helmet SEO for the Development Bundle page only. */
export const DEVELOPMENT_BUNDLE_SEO = {
  title: "Development Course Bundle | Python, Data Science & MERN | KYK",
  description:
    "KYK Development bundle: Python Programming, Data Science, and MERN Stack. 3 courses, 165 listed hours, ₹799/- instead of ₹897/- + 18% GST.",
  h1: "Development Bundle – Python, Data Science and MERN Training",
  ogImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Development Bundle",
};

export const AI_BUNDLE_PATH = "/Bundles/ai";

/** First-byte + Helmet SEO for the AI & Prompt Engineering Bundle page only. */
export const AI_BUNDLE_SEO = {
  title: "AI & Prompt Engineering Course Bundle | KYK",
  description:
    "KYK AI bundle: Artificial Intelligence Fundamentals, Prompt Engineering, and 8 Best AI Tools for Productivity. 3 courses, 62 listed hours, ₹499/- instead of ₹597/- + 18% GST.",
  h1: "AI & Prompt Engineering Bundle – AI Fundamentals, Prompts and Tools Training",
  ogImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "AI & Prompt Engineering Bundle",
};

export const ANALYTICS_BUNDLE_PATH = "/Bundles/analytics";

/** First-byte + Helmet SEO for the Business Analytics Bundle page only. */
export const ANALYTICS_BUNDLE_SEO = {
  title: "Business Analytics Course Bundle | SQL, Power BI & Tableau | KYK",
  description:
    "KYK Analytics bundle: SQL, Python for Analytics, Power BI, Tableau, and Jira. 5 courses, 115 listed hours, ₹899/- instead of ₹995/- + 18% GST.",
  h1: "Business Analytics Bundle – SQL, Python Analytics, Power BI, Tableau and Jira Training",
  ogImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Business Analytics Bundle",
};

export const MARKETING_BUNDLE_PATH = "/Bundles/marketing";

/** First-byte + Helmet SEO for the Advanced Digital Marketing Bundle page only. */
export const MARKETING_BUNDLE_SEO = {
  title: "Digital Marketing Course Bundle | SEO, SEM & SMM | KYK",
  description:
    "KYK Marketing bundle: SEO, SEM, SMM, SMO, Search Console, and AI Tools in Digital Marketing. 6 courses, 126 listed hours, ₹799/- instead of ₹894/- + 18% GST.",
  h1: "Advanced Digital Marketing Bundle – SEO, SEM, SMM, SMO, Search Console and AI Marketing Training",
  ogImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
  twitterCard: "summary_large_image",
  productName: "Advanced Digital Marketing Bundle",
};

export const DEVELOPMENT_INTERNSHIP_PATH = "/Internships/development";

/** First-byte + Helmet SEO for the Development Internship page only. */
export const DEVELOPMENT_INTERNSHIP_SEO = {
  title: "Development Internship Program | Python & MERN | KYK",
  description:
    "Paid KYK Development Internship: 1–3 month Remote/Hybrid programme. Build with Python, MERN, React, Node.js, MongoDB and Git. Programme fee ₹3,999/- + 18% GST.",
  h1: "Development Internship – Python, MERN and Full-Stack Project Experience",
  ogImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  twitterCard: "summary_large_image",
};

export const AI_INTERNSHIP_PATH = "/Internships/ai";

/** First-byte + Helmet SEO for the AI & Prompt Engineering Internship page only. */
export const AI_INTERNSHIP_SEO = {
  title: "AI & Prompt Engineering Internship | ChatGPT & LLMs | KYK",
  description:
    "Paid KYK AI & Prompt Engineering Internship: 1–3 month Remote programme. Design prompts and AI-assisted workflows with ChatGPT, Claude, and productivity tools. Programme fee ₹3,999/- + 18% GST.",
  h1: "AI & Prompt Engineering Internship – ChatGPT, Claude and LLM Workflow Experience",
  ogImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  twitterCard: "summary_large_image",
};

export const ANALYTICS_INTERNSHIP_PATH = "/Internships/analytics";

/** First-byte + Helmet SEO for the Business Analytics Internship page only. */
export const ANALYTICS_INTERNSHIP_SEO = {
  title: "Business Analytics Internship | SQL, Power BI & Tableau | KYK",
  description:
    "Paid KYK Business Analytics Internship: 1–3 month Remote/Hybrid programme. Analyse data with SQL, Python, Power BI, Tableau, and Excel. Programme fee ₹3,999/- + 18% GST.",
  h1: "Business Analytics Internship – SQL, Python, Power BI and Tableau Project Experience",
  ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  twitterCard: "summary_large_image",
};

export const MARKETING_INTERNSHIP_PATH = "/Internships/marketing";

/** First-byte + Helmet SEO for the Advanced Digital Marketing Internship page only. */
export const MARKETING_INTERNSHIP_SEO = {
  title: "Advanced Digital Marketing Internship | SEO, SEM & Social | KYK",
  description:
    "Paid KYK Advanced Digital Marketing Internship: 1–3 month Remote programme. Run SEO, SEM, social campaigns, and AI-powered marketing experiments. Programme fee ₹3,999/- + 18% GST.",
  h1: "Advanced Digital Marketing Internship – SEO, SEM and Social Campaign Experience",
  ogImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
  twitterCard: "summary_large_image",
};

export const STATIC_INDEXABLE_PATHS = [
  "/",
  "/Courses",
  "/Bundles",
  "/Internships",
  "/Blog",
  "/LiveClasses",
  "/About",
];

export const PRIVATE_PREFIXES = [
  "/login",
  "/admin",
  "/Checkout",
  "/Dashboard",
  "/dashboard",
  "/dashbord",
  "/CourseLearning",
];

export const INDEXABLE_PATHS = [
  ...STATIC_INDEXABLE_PATHS,
  ...BUNDLE_SLUGS.map((slug) => `/Bundles/${slug}`),
  ...INTERNSHIP_SLUGS.map((slug) => `/Internships/${slug}`),
  ...COURSE_SLUGS.map((slug) => `/Blog/${slug}`),
  ...CAREER_SLUGS.map((slug) => `/Blog/${slug}`),
];

const INDEXABLE_SET = new Set(INDEXABLE_PATHS);
const VIDEO_SET = new Set(COURSE_SLUGS.map((slug) => `/Blog/${slug}/videos`));
const PRIVATE_EXACT = new Set([
  "/login",
  "/Checkout",
  "/Dashboard",
  "/dashboard",
  "/dashbord",
  "/CourseLearning",
  "/admin/login",
]);

export function normalizePath(pathname) {
  const raw = String(pathname || "/").split("?")[0].split("#")[0];
  if (!raw || raw === "/") return "/";
  return raw.replace(/\/+$/, "") || "/";
}

export function canonicalUrl(pathname) {
  const path = normalizePath(pathname);
  if (path === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isIndexablePath(pathname) {
  return INDEXABLE_SET.has(normalizePath(pathname));
}

export function frontendRedirect(pathname) {
  const path = normalizePath(pathname);
  if (path === "/Home" || path === "/home") return "/";
  if (path === "/index.html" || path === "/index.htm") return "/";
  return null;
}

export function initialHtmlSeoForPath(pathname) {
  const path = normalizePath(pathname);
  if (path === "/Internships") {
    return {
      title: INTERNSHIPS_LISTING_SEO.title,
      description: INTERNSHIPS_LISTING_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === CAREER_GUIDE_PATH) {
    return {
      title: CAREER_GUIDE_SEO.title,
      description: CAREER_GUIDE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: CAREER_GUIDE_SEO.ogImage,
      twitterCard: CAREER_GUIDE_SEO.twitterCard,
    };
  }
  if (path === ABOUT_PATH) {
    return {
      title: ABOUT_SEO.title,
      description: ABOUT_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: ABOUT_SEO.ogImage,
      twitterCard: ABOUT_SEO.twitterCard,
    };
  }
  if (path === DEVELOPMENT_INTERNSHIP_PATH) {
    return {
      title: DEVELOPMENT_INTERNSHIP_SEO.title,
      description: DEVELOPMENT_INTERNSHIP_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: DEVELOPMENT_INTERNSHIP_SEO.ogImage,
      twitterCard: DEVELOPMENT_INTERNSHIP_SEO.twitterCard,
    };
  }
  if (path === AI_INTERNSHIP_PATH) {
    return {
      title: AI_INTERNSHIP_SEO.title,
      description: AI_INTERNSHIP_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: AI_INTERNSHIP_SEO.ogImage,
      twitterCard: AI_INTERNSHIP_SEO.twitterCard,
    };
  }
  if (path === ANALYTICS_INTERNSHIP_PATH) {
    return {
      title: ANALYTICS_INTERNSHIP_SEO.title,
      description: ANALYTICS_INTERNSHIP_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: ANALYTICS_INTERNSHIP_SEO.ogImage,
      twitterCard: ANALYTICS_INTERNSHIP_SEO.twitterCard,
    };
  }
  if (path === MARKETING_INTERNSHIP_PATH) {
    return {
      title: MARKETING_INTERNSHIP_SEO.title,
      description: MARKETING_INTERNSHIP_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: MARKETING_INTERNSHIP_SEO.ogImage,
      twitterCard: MARKETING_INTERNSHIP_SEO.twitterCard,
    };
  }
  if (path === SMM_COURSE_PATH) {
    return {
      title: SMM_COURSE_SEO.title,
      description: SMM_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === SEO_COURSE_PATH) {
    return {
      title: SEO_COURSE_SEO.title,
      description: SEO_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === SEM_COURSE_PATH) {
    return {
      title: SEM_COURSE_SEO.title,
      description: SEM_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === SMO_COURSE_PATH) {
    return {
      title: SMO_COURSE_SEO.title,
      description: SMO_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === GSC_COURSE_PATH) {
    return {
      title: GSC_COURSE_SEO.title,
      description: GSC_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === AI_MARKETING_COURSE_PATH) {
    return {
      title: AI_MARKETING_COURSE_SEO.title,
      description: AI_MARKETING_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === AI_PRODUCTIVITY_COURSE_PATH) {
    return {
      title: AI_PRODUCTIVITY_COURSE_SEO.title,
      description: AI_PRODUCTIVITY_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === PROMPT_ENGINEERING_COURSE_PATH) {
    return {
      title: PROMPT_ENGINEERING_COURSE_SEO.title,
      description: PROMPT_ENGINEERING_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === AI_FUNDAMENTALS_COURSE_PATH) {
    return {
      title: AI_FUNDAMENTALS_COURSE_SEO.title,
      description: AI_FUNDAMENTALS_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: AI_FUNDAMENTALS_COURSE_SEO.ogImage,
      twitterCard: AI_FUNDAMENTALS_COURSE_SEO.twitterCard,
    };
  }
  if (path === PYTHON_PROGRAMMING_COURSE_PATH) {
    return {
      title: PYTHON_PROGRAMMING_COURSE_SEO.title,
      description: PYTHON_PROGRAMMING_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
    };
  }
  if (path === DATA_SCIENCE_COURSE_PATH) {
    return {
      title: DATA_SCIENCE_COURSE_SEO.title,
      description: DATA_SCIENCE_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: DATA_SCIENCE_COURSE_SEO.ogImage,
      twitterCard: DATA_SCIENCE_COURSE_SEO.twitterCard,
    };
  }
  if (path === MERN_STACK_COURSE_PATH) {
    return {
      title: MERN_STACK_COURSE_SEO.title,
      description: MERN_STACK_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: MERN_STACK_COURSE_SEO.ogImage,
      twitterCard: MERN_STACK_COURSE_SEO.twitterCard,
    };
  }
  if (path === JIRA_COURSE_PATH) {
    return {
      title: JIRA_COURSE_SEO.title,
      description: JIRA_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: JIRA_COURSE_SEO.ogImage,
      twitterCard: JIRA_COURSE_SEO.twitterCard,
    };
  }
  if (path === SQL_COURSE_PATH) {
    return {
      title: SQL_COURSE_SEO.title,
      description: SQL_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: SQL_COURSE_SEO.ogImage,
      twitterCard: SQL_COURSE_SEO.twitterCard,
    };
  }
  if (path === POWER_BI_COURSE_PATH) {
    return {
      title: POWER_BI_COURSE_SEO.title,
      description: POWER_BI_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: POWER_BI_COURSE_SEO.ogImage,
      twitterCard: POWER_BI_COURSE_SEO.twitterCard,
    };
  }
  if (path === TABLEAU_COURSE_PATH) {
    return {
      title: TABLEAU_COURSE_SEO.title,
      description: TABLEAU_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: TABLEAU_COURSE_SEO.ogImage,
      twitterCard: TABLEAU_COURSE_SEO.twitterCard,
    };
  }
  if (path === PYTHON_FOR_ANALYTICS_COURSE_PATH) {
    return {
      title: PYTHON_FOR_ANALYTICS_COURSE_SEO.title,
      description: PYTHON_FOR_ANALYTICS_COURSE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: PYTHON_FOR_ANALYTICS_COURSE_SEO.ogImage,
      twitterCard: PYTHON_FOR_ANALYTICS_COURSE_SEO.twitterCard,
    };
  }
  if (path === DEVELOPMENT_BUNDLE_PATH) {
    return {
      title: DEVELOPMENT_BUNDLE_SEO.title,
      description: DEVELOPMENT_BUNDLE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: DEVELOPMENT_BUNDLE_SEO.ogImage,
      twitterCard: DEVELOPMENT_BUNDLE_SEO.twitterCard,
    };
  }
  if (path === AI_BUNDLE_PATH) {
    return {
      title: AI_BUNDLE_SEO.title,
      description: AI_BUNDLE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: AI_BUNDLE_SEO.ogImage,
      twitterCard: AI_BUNDLE_SEO.twitterCard,
    };
  }
  if (path === ANALYTICS_BUNDLE_PATH) {
    return {
      title: ANALYTICS_BUNDLE_SEO.title,
      description: ANALYTICS_BUNDLE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: ANALYTICS_BUNDLE_SEO.ogImage,
      twitterCard: ANALYTICS_BUNDLE_SEO.twitterCard,
    };
  }
  if (path === MARKETING_BUNDLE_PATH) {
    return {
      title: MARKETING_BUNDLE_SEO.title,
      description: MARKETING_BUNDLE_SEO.description,
      canonical: canonicalUrl(path),
      robots: "index, follow",
      ogImage: MARKETING_BUNDLE_SEO.ogImage,
      twitterCard: MARKETING_BUNDLE_SEO.twitterCard,
    };
  }
  return null;
}

export function documentLinkHeader(pathname) {
  const parent = videoParentPath(pathname);
  if (parent) return `<${canonicalUrl(parent)}>; rel="canonical"`;
  const seo = initialHtmlSeoForPath(pathname);
  if (seo) return `<${seo.canonical}>; rel="canonical"`;
  return null;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** Inject title, description, and one data-rh canonical into the SPA shell for mapped routes only. */
export function applyInitialHtmlSeo(html, pathname) {
  const seo = initialHtmlSeoForPath(pathname);
  if (!seo || typeof html !== "string") return html;
  let next = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-rh="true">${escapeAttr(seo.title)}</title>`);
  if (/<meta\b[^>]*name=["']description["'][^>]*>/i.test(next)) {
    next = next.replace(
      /<meta\b[^>]*name=["']description["'][^>]*>/i,
      `<meta data-rh="true" name="description" content="${escapeAttr(seo.description)}" />`
    );
  } else {
    next = next.replace(/<\/head>/i, `    <meta data-rh="true" name="description" content="${escapeAttr(seo.description)}" />\n  </head>`);
  }
  next = next.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, "");
  next = next.replace(
    /<\/head>/i,
    `    <link data-rh="true" rel="canonical" href="${seo.canonical}" />\n    <meta data-rh="true" name="robots" content="${escapeAttr(seo.robots)}" />\n  </head>`
  );
  if (seo.ogImage) {
    const twitterCard = seo.twitterCard || "summary_large_image";
    next = next.replace(
      /<meta\b[^>]*(?:property=["']og:(?:title|description|url|image)["']|name=["']twitter:(?:card|title|description|image)["'])[^>]*>\s*/gi,
      ""
    );
    next = next.replace(
      /<\/head>/i,
      [
        `    <meta data-rh="true" property="og:title" content="${escapeAttr(seo.title)}" />`,
        `    <meta data-rh="true" property="og:description" content="${escapeAttr(seo.description)}" />`,
        `    <meta data-rh="true" property="og:url" content="${escapeAttr(seo.canonical)}" />`,
        `    <meta data-rh="true" property="og:image" content="${escapeAttr(seo.ogImage)}" />`,
        `    <meta data-rh="true" name="twitter:card" content="${escapeAttr(twitterCard)}" />`,
        `    <meta data-rh="true" name="twitter:title" content="${escapeAttr(seo.title)}" />`,
        `    <meta data-rh="true" name="twitter:description" content="${escapeAttr(seo.description)}" />`,
        `    <meta data-rh="true" name="twitter:image" content="${escapeAttr(seo.ogImage)}" />`,
        `  </head>`,
      ].join("\n")
    );
  }
  return next;
}

/** Parent course URL for /Blog/{slug}/videos, or null if not a known video route. */
export function videoParentPath(pathname) {
  const path = normalizePath(pathname);
  const match = path.match(/^\/Blog\/([^/]+)\/videos$/);
  if (!match) return null;
  const slug = match[1];
  if (!COURSE_SLUGS.includes(slug)) return null;
  return `/Blog/${slug}`;
}

/** HTTP status for SPA HTML: 200 for known app routes, 404 otherwise. */
export function statusForFrontendPath(pathname) {
  const path = normalizePath(pathname);
  if (path === "/Home" || path === "/home") return 200;
  if (INDEXABLE_SET.has(path)) return 200;
  if (VIDEO_SET.has(path)) return 200;
  if (PRIVATE_EXACT.has(path)) return 200;
  if (path === "/admin" || path.startsWith("/admin/")) return 200;
  return 404;
}

export function sitemapXml(lastmod = "2026-10-31") {
  const urls = INDEXABLE_PATHS.map((path) => {
    const loc = canonicalUrl(path);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
