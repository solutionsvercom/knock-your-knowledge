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
