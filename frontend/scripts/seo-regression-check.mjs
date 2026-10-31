import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  INDEXABLE_PATHS,
  COURSE_SLUGS,
  BUNDLE_SLUGS,
  INTERNSHIP_SLUGS,
  CAREER_SLUGS,
  canonicalUrl,
  sitemapXml,
  statusForFrontendPath,
  frontendRedirect,
  videoParentPath,
  applyInitialHtmlSeo,
  documentLinkHeader,
  INTERNSHIPS_LISTING_SEO,
} from "../src/config/publicPaths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const report = { passed: [], failed: [], warnings: [] };

function pass(msg) {
  report.passed.push(msg);
}
function fail(msg) {
  report.failed.push(msg);
}
function warn(msg) {
  report.warnings.push(msg);
}

const seoSrc = fs.readFileSync(path.join(root, "src/config/seo.js"), "utf8");
const titles = [...seoSrc.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1]);
const descriptions = [...seoSrc.matchAll(/description:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
if (!titles.includes(INTERNSHIPS_LISTING_SEO.title)) titles.push(INTERNSHIPS_LISTING_SEO.title);
if (!descriptions.includes(INTERNSHIPS_LISTING_SEO.description)) descriptions.push(INTERNSHIPS_LISTING_SEO.description);
const titleSet = new Set(titles);
const descSet = new Set(descriptions);
if (titles.length && titles.length === titleSet.size) pass(`Unique titles in seo.js (${titles.length})`);
else fail(`Duplicate titles in seo.js: ${titles.length} vs ${titleSet.size} unique`);
if (descriptions.length && descriptions.length === descSet.size) {
  pass(`Unique meta descriptions in seo.js (${descriptions.length})`);
} else {
  fail(`Duplicate descriptions in seo.js: ${descriptions.length} vs ${descSet.size} unique`);
}

const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = INDEXABLE_PATHS.map((p) => canonicalUrl(p));
if (locs.length === expected.length) pass(`Sitemap URL count ${locs.length}`);
else fail(`Sitemap count ${locs.length} vs expected ${expected.length}`);
const missing = expected.filter((u) => !locs.includes(u));
const extra = locs.filter((u) => !expected.includes(u));
if (!missing.length && !extra.length) pass("Sitemap matches INDEXABLE_PATHS exactly");
else {
  if (missing.length) fail(`Sitemap missing: ${missing.join(", ")}`);
  if (extra.length) fail(`Sitemap extra: ${extra.join(", ")}`);
}
if (locs.every((u) => u.startsWith("https://knockyourknowledge.com"))) pass("Sitemap uses absolute HTTPS URLs");
else fail("Sitemap has non-HTTPS loc");
if (COURSE_SLUGS.every((s) => locs.includes(canonicalUrl(`/Blog/${s}`)))) pass("Sitemap includes all 17 course URLs");
else fail("Sitemap missing a course URL");
if (BUNDLE_SLUGS.every((s) => locs.includes(canonicalUrl(`/Bundles/${s}`)))) pass("Sitemap includes all 4 bundle URLs");
else fail("Sitemap missing a bundle URL");
if (INTERNSHIP_SLUGS.every((s) => locs.includes(canonicalUrl(`/Internships/${s}`)))) {
  pass("Sitemap includes all 4 internship URLs");
} else fail("Sitemap missing an internship URL");
const blocked = ["/login", "/Checkout", "/Dashboard", "/admin", "/Home", "/Blog/python-programming/videos"];
if (blocked.every((p) => !locs.includes(canonicalUrl(p)))) pass("Sitemap excludes private/noindex URLs");
else fail("Sitemap includes a blocked URL");
if (sitemap === sitemapXml("2026-10-31")) pass("Sitemap file matches generator output");
else warn("Sitemap file differs from sitemapXml() generator (whitespace/lastmod)");

const robots = fs.readFileSync(path.join(root, "public/robots.txt"), "utf8");
if (robots.includes("Allow: /")) pass("robots.txt Allow: /");
else fail("robots.txt missing Allow: /");
if (robots.includes("Sitemap: https://knockyourknowledge.com/sitemap.xml")) pass("robots.txt lists sitemap");
else fail("robots.txt missing sitemap");
for (const d of ["/login", "/admin", "/Checkout", "/Dashboard", "/CourseLearning", "/Home"]) {
  if (robots.includes(`Disallow: ${d}`)) pass(`robots.txt Disallow ${d}`);
  else fail(`robots.txt missing Disallow ${d}`);
}
if (robots.includes("Disallow: /Blog/*/videos")) {
  fail("robots.txt still blocks /Blog/*/videos; Google cannot read noindex");
} else {
  pass("robots.txt allows crawl of /Blog/*/videos so Google can read noindex");
}
if (!/Disallow:\s*\/(assets|src|static)/.test(robots)) pass("robots.txt does not block CSS/JS/image folders");
else fail("robots.txt may block rendering assets");

if (COURSE_SLUGS.length === 17) pass("COURSE_SLUGS has 17 entries");
else fail(`COURSE_SLUGS length ${COURSE_SLUGS.length}`);
if (CAREER_SLUGS.length === 2) pass("2 career guide slugs");
if (statusForFrontendPath("/Blog/not-real") === 404) pass("Unknown course slug is HTTP 404 in matcher");
else fail("Unknown slug not 404");
if (statusForFrontendPath("/Blog/python-programming") === 200) pass("Python course matcher is 200");
if (frontendRedirect("/Home") === "/") pass("/Home redirects to /");
if (frontendRedirect("/index.html") === "/") pass("/index.html redirects to /");
else fail("/index.html is not mapped to /");
if (frontendRedirect("/Blog/sem-search-engine-marketing/videos") == null) {
  pass("SEM /videos is not 301-redirected (curriculum route kept)");
} else fail("SEM /videos should not 301 while CourseVideos is live");
if (videoParentPath("/Blog/sem-search-engine-marketing/videos") === "/Blog/sem-search-engine-marketing") {
  pass("SEM /videos canonical parent is the course page");
} else fail("SEM /videos missing parent course path");
if (statusForFrontendPath("/Blog/sem-search-engine-marketing/videos") === 200) {
  pass("SEM /videos matcher is HTTP 200");
} else fail("SEM /videos matcher is not 200");
if (locs.some((u) => u.includes("/videos"))) fail("Sitemap includes a /videos URL");
else pass("Sitemap excludes all /videos URLs");
if (seoSrc.includes("canonical: canonicalUrl(`/Blog/${slug}`)") && seoSrc.includes("noindex: true")) {
  pass("Video SEO sets parent canonical and noindex");
} else fail("Video SEO missing parent canonical or noindex");
if (locs.includes("https://knockyourknowledge.com/index.html")) fail("Sitemap includes /index.html");
else pass("Sitemap excludes /index.html");
if (locs.includes("https://knockyourknowledge.com/Internships")) pass("Sitemap includes /Internships");
else fail("Sitemap missing /Internships");
if (INTERNSHIP_SLUGS.every((s) => locs.includes(canonicalUrl(`/Internships/${s}`)))) {
  pass("Sitemap still includes four internship detail URLs");
} else fail("Sitemap missing an internship detail URL");

const internShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  "/Internships"
);
if (internShell.includes(INTERNSHIPS_LISTING_SEO.title)) pass("Initial HTML title for /Internships");
else fail("Initial HTML missing internships title");
if (internShell.includes(INTERNSHIPS_LISTING_SEO.description)) pass("Initial HTML description for /Internships");
else fail("Initial HTML missing internships description");
if ((internShell.match(/rel="canonical"/g) || []).length === 1) pass("Initial HTML has exactly one canonical");
else fail("Initial HTML canonical count is not 1");
if (internShell.includes('href="https://knockyourknowledge.com/Internships"')) pass("Initial HTML canonical is the listing URL");
else fail("Initial HTML canonical is not /Internships");
if (internShell.includes('content="index, follow"')) pass("Initial HTML robots is index, follow");
else fail("Initial HTML missing index, follow");
if (
  documentLinkHeader("/Internships") ===
  "<https://knockyourknowledge.com/Internships>; rel=\"canonical\""
) {
  pass("Internships Link header is self-canonical");
} else fail("Internships Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", "/Courses").includes("Internship Programs at KYK") === false) {
  pass("HTML SEO injection is limited to /Internships");
} else fail("HTML SEO injection leaked onto another path");

const internPage = fs.readFileSync(path.join(root, "src/pages/Internships.jsx"), "utf8");
if (internPage.includes("Apply Now") && internPage.includes("addInternshipToCart") && internPage.includes("View program")) {
  pass("Internships listing still has Apply Now, Add to cart, and View program");
} else fail("Internships listing lost apply/cart/detail actions");

const nav = fs.readFileSync(path.join(root, "src/config/siteNav.js"), "utf8");
const navHrefs = [...nav.matchAll(/to:\s*"([^"]+)"/g)].map((m) => m[1]);
const courseHrefs = COURSE_SLUGS.map((s) => `/Blog/${s}`);
const missingNav = courseHrefs.filter((h) => !navHrefs.includes(h));
if (!missingNav.length) pass("Header nav includes all 17 course URLs");
else fail(`Nav missing courses: ${missingNav.join(", ")}`);
for (const s of BUNDLE_SLUGS) {
  if (navHrefs.includes(`/Bundles/${s}`)) continue;
  fail(`Nav missing bundle ${s}`);
}
for (const s of INTERNSHIP_SLUGS) {
  if (navHrefs.includes(`/Internships/${s}`)) continue;
  fail(`Nav missing internship ${s}`);
}
if (BUNDLE_SLUGS.every((s) => navHrefs.includes(`/Bundles/${s}`))) pass("Header nav includes 4 bundles");
if (INTERNSHIP_SLUGS.every((s) => navHrefs.includes(`/Internships/${s}`))) pass("Header nav includes 4 internships");

const pagesConfig = fs.readFileSync(path.join(root, "src/pages.config.js"), "utf8");
for (const name of ["About", "Blog", "Bundles", "Courses", "Home", "Internships", "LiveClasses"]) {
  if (pagesConfig.includes(`"${name}"`)) pass(`pages.config still registers ${name}`);
  else fail(`pages.config missing ${name}`);
}

const pricing = fs.readFileSync(path.join(root, "src/config/pricing.js"), "utf8");
if (pricing.includes("INTERNSHIP_FEE_AMOUNT = 3999")) pass("Internship fee still ₹3999");
else fail("Internship fee constant changed");
if (pricing.includes("DEVELOPMENT_BUNDLE_FEE = 799") && pricing.includes("AI_BUNDLE_FEE = 499") && pricing.includes("ANALYTICS_BUNDLE_FEE = 899") && pricing.includes("MARKETING_BUNDLE_FEE = 799")) {
  pass("Bundle fees unchanged (799/499/899/799)");
} else fail("Bundle fees changed");

const checkout = fs.readFileSync(path.join(root, "src/pages/Checkout.jsx"), "utf8");
if (checkout.includes("payWithCashfree") && checkout.includes("createCashfreeOrder")) pass("Checkout Cashfree handlers still present");
else fail("Checkout Cashfree handlers missing");

const courseVideos = fs.readFileSync(path.join(root, "src/pages/CourseVideos.jsx"), "utf8");
if (courseVideos.includes("addItem") && courseVideos.includes("/Checkout") && courseVideos.includes("20 videos")) {
  pass("CourseVideos still enrolls via cart/checkout and lists 20 videos");
} else fail("CourseVideos enrollment or 20-video copy missing");

const serverSrc = fs.readFileSync(path.join(root, "../backend/src/server.js"), "utf8");
if (serverSrc.includes('X-Robots-Tag", "noindex, nofollow') && serverSrc.includes("videoParentPath")) {
  pass("Express sets X-Robots-Tag noindex, nofollow on video routes");
} else fail("Express missing X-Robots-Tag on video routes");

const internDetail = fs.readFileSync(path.join(root, "src/pages/InternshipDetail.jsx"), "utf8");
if (internDetail.includes("openContactForm") && internDetail.includes("addInternshipToCart")) {
  pass("Internship Apply Now and Add to cart still present");
} else fail("Internship apply/cart handlers missing");

const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
for (const route of ["/Checkout", "/Dashboard", "/login", "/Blog/:slug/videos", "/Blog/:slug", "/Bundles/:slug", "/Internships/:slug", "/CourseLearning"]) {
  if (app.includes(`path="${route}"`) || app.includes(`path={\`${route}\``) || app.includes(route)) pass(`App still routes ${route}`);
  else fail(`App missing route ${route}`);
}

const jsonLd = fs.readFileSync(path.join(root, "src/config/jsonLd.js"), "utf8");
for (const t of ["EducationalOrganization", "WebSite", "BreadcrumbList", "Course", "ItemList", "CourseInstance", "Offer"]) {
  if (jsonLd.includes(`"${t}"`) || jsonLd.includes(`@type": "${t}"`) || jsonLd.includes(`"@type": "${t}"`)) {
    pass(`JSON-LD builder includes ${t}`);
  } else fail(`JSON-LD builder missing ${t}`);
}
if (!jsonLd.includes("aggregateRating") && !jsonLd.includes("Review")) pass("JSON-LD omits unverified ratings/reviews");
else warn("JSON-LD includes rating/review fields");

const origin = process.env.SEO_ORIGIN || "http://localhost:5173";
const pathsToFetch = [
  ...INDEXABLE_PATHS,
  "/login",
  "/Blog/python-programming/videos",
  "/this-page-does-not-exist-kyk",
];

async function fetchPath(p) {
  const url = `${origin}${p === "/" ? "/" : p}`;
  const res = await fetch(url, { redirect: "manual" });
  const text = await res.text();
  return { path: p, status: res.status, text, location: res.headers.get("location") };
}

let httpResults = [];
try {
  httpResults = await Promise.all(pathsToFetch.map((p) => fetchPath(p)));
  const indexableHttp = httpResults.filter((r) => INDEXABLE_PATHS.includes(r.path));
  const bad = indexableHttp.filter((r) => r.status !== 200);
  if (!bad.length) pass(`HTTP 200 for all ${indexableHttp.length} indexable URLs on ${origin}`);
  else fail(`Non-200 indexable: ${bad.map((r) => `${r.path} ${r.status}`).join(", ")}`);
  const missingPage = httpResults.find((r) => r.path.includes("does-not-exist"));
  if (missingPage && missingPage.status === 404) pass("Unknown URL returns HTTP 404");
  else warn(`Unknown URL status ${missingPage?.status} (Vite dev always 200; Express production should 404)`);
  const brokenHtml = indexableHttp.filter((r) => !r.text.includes("<div id=\"root\">") && !r.text.includes("Knock Your Knowledge"));
  if (!brokenHtml.length) pass("Indexable URLs return the app HTML shell");
  else fail(`Empty/broken HTML: ${brokenHtml.map((r) => r.path).join(", ")}`);
} catch (err) {
  warn(`Could not HTTP-fetch ${origin}: ${err.message}`);
}

console.log(JSON.stringify({ origin, ...report, httpSample: httpResults.map((r) => ({ path: r.path, status: r.status })) }, null, 2));
