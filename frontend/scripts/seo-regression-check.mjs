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
for (const d of ["/login", "/admin", "/Checkout", "/Dashboard", "/CourseLearning", "/Home", "/Blog/*/videos"]) {
  if (robots.includes(`Disallow: ${d}`)) pass(`robots.txt Disallow ${d}`);
  else fail(`robots.txt missing Disallow ${d}`);
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
if (locs.includes("https://knockyourknowledge.com/index.html")) fail("Sitemap includes /index.html");
else pass("Sitemap excludes /index.html");

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

const internDetail = fs.readFileSync(path.join(root, "src/pages/InternshipDetail.jsx"), "utf8");
if (internDetail.includes("openContactForm") && internDetail.includes("addInternshipToCart")) {
  pass("Internship Apply Now and Add to cart still present");
} else fail("Internship apply/cart handlers missing");

const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
for (const route of ["/Checkout", "/Dashboard", "/login", "/Blog/:slug", "/Bundles/:slug", "/Internships/:slug", "/CourseLearning"]) {
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
