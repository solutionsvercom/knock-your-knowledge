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

export function documentLinkHeader(pathname) {
  const parent = videoParentPath(pathname);
  if (parent) return `<${canonicalUrl(parent)}>; rel="canonical"`;
  if (normalizePath(pathname) === "/Internships") {
    return `<${canonicalUrl("/Internships")}>; rel="canonical"`;
  }
  return null;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** Inject listing title, description, and one data-rh canonical into the SPA shell for /Internships. */
export function applyInitialHtmlSeo(html, pathname) {
  if (normalizePath(pathname) !== "/Internships" || typeof html !== "string") return html;
  const canonical = canonicalUrl("/Internships");
  const title = INTERNSHIPS_LISTING_SEO.title;
  const description = INTERNSHIPS_LISTING_SEO.description;
  let next = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title data-rh="true">${escapeAttr(title)}</title>`);
  if (/<meta\b[^>]*name=["']description["'][^>]*>/i.test(next)) {
    next = next.replace(
      /<meta\b[^>]*name=["']description["'][^>]*>/i,
      `<meta data-rh="true" name="description" content="${escapeAttr(description)}" />`
    );
  } else {
    next = next.replace(/<\/head>/i, `    <meta data-rh="true" name="description" content="${escapeAttr(description)}" />\n  </head>`);
  }
  next = next.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, "");
  next = next.replace(
    /<\/head>/i,
    `    <link data-rh="true" rel="canonical" href="${canonical}" />\n    <meta data-rh="true" name="robots" content="index, follow" />\n  </head>`
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
