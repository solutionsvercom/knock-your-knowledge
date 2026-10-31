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
