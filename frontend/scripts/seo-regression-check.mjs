import fs from "node:fs";
import http from "node:http";
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
  SMM_COURSE_SEO,
  SMM_COURSE_PATH,
  SEO_COURSE_SEO,
  SEO_COURSE_PATH,
  SEM_COURSE_SEO,
  SEM_COURSE_PATH,
  SMO_COURSE_SEO,
  SMO_COURSE_PATH,
  GSC_COURSE_SEO,
  GSC_COURSE_PATH,
  AI_MARKETING_COURSE_SEO,
  AI_MARKETING_COURSE_PATH,
  AI_PRODUCTIVITY_COURSE_SEO,
  AI_PRODUCTIVITY_COURSE_PATH,
  PROMPT_ENGINEERING_COURSE_SEO,
  PROMPT_ENGINEERING_COURSE_PATH,
  AI_FUNDAMENTALS_COURSE_SEO,
  AI_FUNDAMENTALS_COURSE_PATH,
  PYTHON_PROGRAMMING_COURSE_SEO,
  PYTHON_PROGRAMMING_COURSE_PATH,
  DATA_SCIENCE_COURSE_SEO,
  DATA_SCIENCE_COURSE_PATH,
  MERN_STACK_COURSE_SEO,
  MERN_STACK_COURSE_PATH,
  JIRA_COURSE_SEO,
  JIRA_COURSE_PATH,
  SQL_COURSE_SEO,
  SQL_COURSE_PATH,
  POWER_BI_COURSE_SEO,
  POWER_BI_COURSE_PATH,
  TABLEAU_COURSE_SEO,
  TABLEAU_COURSE_PATH,
  PYTHON_FOR_ANALYTICS_COURSE_SEO,
  PYTHON_FOR_ANALYTICS_COURSE_PATH,
  DEVELOPMENT_BUNDLE_SEO,
  DEVELOPMENT_BUNDLE_PATH,
  AI_BUNDLE_SEO,
  AI_BUNDLE_PATH,
  ANALYTICS_BUNDLE_SEO,
  ANALYTICS_BUNDLE_PATH,
  MARKETING_BUNDLE_SEO,
  MARKETING_BUNDLE_PATH,
  DEVELOPMENT_INTERNSHIP_SEO,
  DEVELOPMENT_INTERNSHIP_PATH,
  AI_INTERNSHIP_SEO,
  AI_INTERNSHIP_PATH,
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
if (!titles.includes(SMM_COURSE_SEO.title)) titles.push(SMM_COURSE_SEO.title);
if (!descriptions.includes(SMM_COURSE_SEO.description)) descriptions.push(SMM_COURSE_SEO.description);
if (!titles.includes(SEO_COURSE_SEO.title)) titles.push(SEO_COURSE_SEO.title);
if (!descriptions.includes(SEO_COURSE_SEO.description)) descriptions.push(SEO_COURSE_SEO.description);
if (!titles.includes(SEM_COURSE_SEO.title)) titles.push(SEM_COURSE_SEO.title);
if (!descriptions.includes(SEM_COURSE_SEO.description)) descriptions.push(SEM_COURSE_SEO.description);
if (!titles.includes(SMO_COURSE_SEO.title)) titles.push(SMO_COURSE_SEO.title);
if (!descriptions.includes(SMO_COURSE_SEO.description)) descriptions.push(SMO_COURSE_SEO.description);
if (!titles.includes(GSC_COURSE_SEO.title)) titles.push(GSC_COURSE_SEO.title);
if (!descriptions.includes(GSC_COURSE_SEO.description)) descriptions.push(GSC_COURSE_SEO.description);
if (!titles.includes(AI_MARKETING_COURSE_SEO.title)) titles.push(AI_MARKETING_COURSE_SEO.title);
if (!descriptions.includes(AI_MARKETING_COURSE_SEO.description)) descriptions.push(AI_MARKETING_COURSE_SEO.description);
if (!titles.includes(AI_PRODUCTIVITY_COURSE_SEO.title)) titles.push(AI_PRODUCTIVITY_COURSE_SEO.title);
if (!descriptions.includes(AI_PRODUCTIVITY_COURSE_SEO.description)) descriptions.push(AI_PRODUCTIVITY_COURSE_SEO.description);
if (!titles.includes(PROMPT_ENGINEERING_COURSE_SEO.title)) titles.push(PROMPT_ENGINEERING_COURSE_SEO.title);
if (!descriptions.includes(PROMPT_ENGINEERING_COURSE_SEO.description)) descriptions.push(PROMPT_ENGINEERING_COURSE_SEO.description);
if (!titles.includes(AI_FUNDAMENTALS_COURSE_SEO.title)) titles.push(AI_FUNDAMENTALS_COURSE_SEO.title);
if (!descriptions.includes(AI_FUNDAMENTALS_COURSE_SEO.description)) descriptions.push(AI_FUNDAMENTALS_COURSE_SEO.description);
if (!titles.includes(PYTHON_PROGRAMMING_COURSE_SEO.title)) titles.push(PYTHON_PROGRAMMING_COURSE_SEO.title);
if (!descriptions.includes(PYTHON_PROGRAMMING_COURSE_SEO.description)) descriptions.push(PYTHON_PROGRAMMING_COURSE_SEO.description);
if (!titles.includes(DATA_SCIENCE_COURSE_SEO.title)) titles.push(DATA_SCIENCE_COURSE_SEO.title);
if (!descriptions.includes(DATA_SCIENCE_COURSE_SEO.description)) descriptions.push(DATA_SCIENCE_COURSE_SEO.description);
if (!titles.includes(MERN_STACK_COURSE_SEO.title)) titles.push(MERN_STACK_COURSE_SEO.title);
if (!descriptions.includes(MERN_STACK_COURSE_SEO.description)) descriptions.push(MERN_STACK_COURSE_SEO.description);
if (!titles.includes(JIRA_COURSE_SEO.title)) titles.push(JIRA_COURSE_SEO.title);
if (!descriptions.includes(JIRA_COURSE_SEO.description)) descriptions.push(JIRA_COURSE_SEO.description);
if (!titles.includes(SQL_COURSE_SEO.title)) titles.push(SQL_COURSE_SEO.title);
if (!descriptions.includes(SQL_COURSE_SEO.description)) descriptions.push(SQL_COURSE_SEO.description);
if (!titles.includes(POWER_BI_COURSE_SEO.title)) titles.push(POWER_BI_COURSE_SEO.title);
if (!descriptions.includes(POWER_BI_COURSE_SEO.description)) descriptions.push(POWER_BI_COURSE_SEO.description);
if (!titles.includes(TABLEAU_COURSE_SEO.title)) titles.push(TABLEAU_COURSE_SEO.title);
if (!descriptions.includes(TABLEAU_COURSE_SEO.description)) descriptions.push(TABLEAU_COURSE_SEO.description);
if (!titles.includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title)) titles.push(PYTHON_FOR_ANALYTICS_COURSE_SEO.title);
if (!descriptions.includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.description)) descriptions.push(PYTHON_FOR_ANALYTICS_COURSE_SEO.description);
if (!titles.includes(DEVELOPMENT_BUNDLE_SEO.title)) titles.push(DEVELOPMENT_BUNDLE_SEO.title);
if (!descriptions.includes(DEVELOPMENT_BUNDLE_SEO.description)) descriptions.push(DEVELOPMENT_BUNDLE_SEO.description);
if (!titles.includes(AI_BUNDLE_SEO.title)) titles.push(AI_BUNDLE_SEO.title);
if (!descriptions.includes(AI_BUNDLE_SEO.description)) descriptions.push(AI_BUNDLE_SEO.description);
if (!titles.includes(ANALYTICS_BUNDLE_SEO.title)) titles.push(ANALYTICS_BUNDLE_SEO.title);
if (!descriptions.includes(ANALYTICS_BUNDLE_SEO.description)) descriptions.push(ANALYTICS_BUNDLE_SEO.description);
if (!titles.includes(MARKETING_BUNDLE_SEO.title)) titles.push(MARKETING_BUNDLE_SEO.title);
if (!descriptions.includes(MARKETING_BUNDLE_SEO.description)) descriptions.push(MARKETING_BUNDLE_SEO.description);
if (!titles.includes(DEVELOPMENT_INTERNSHIP_SEO.title)) titles.push(DEVELOPMENT_INTERNSHIP_SEO.title);
if (!descriptions.includes(DEVELOPMENT_INTERNSHIP_SEO.description)) descriptions.push(DEVELOPMENT_INTERNSHIP_SEO.description);
if (!titles.includes(AI_INTERNSHIP_SEO.title)) titles.push(AI_INTERNSHIP_SEO.title);
if (!descriptions.includes(AI_INTERNSHIP_SEO.description)) descriptions.push(AI_INTERNSHIP_SEO.description);
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
  pass("Internships HTML SEO injection does not leak onto /Courses");
} else fail("HTML SEO injection leaked internships metadata onto /Courses");

const smmShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  SMM_COURSE_PATH
);
const smmTitleHtml = SMM_COURSE_SEO.title.replace(/&/g, "&amp;");
if (smmShell.includes(smmTitleHtml)) pass("Initial HTML title for SMM course");
else fail("Initial HTML missing SMM title");
if (smmShell.includes(SMM_COURSE_SEO.description)) pass("Initial HTML description for SMM course");
else fail("Initial HTML missing SMM description");
if ((smmShell.match(/rel="canonical"/g) || []).length === 1) pass("SMM initial HTML has exactly one canonical");
else fail("SMM initial HTML canonical count is not 1");
if (smmShell.includes(`href="${canonicalUrl(SMM_COURSE_PATH)}"`)) pass("SMM initial HTML canonical is the course URL");
else fail("SMM initial HTML canonical is not the course URL");
if (smmShell.includes('content="index, follow"')) pass("SMM initial HTML robots is index, follow");
else fail("SMM initial HTML missing index, follow");
if (
  documentLinkHeader(SMM_COURSE_PATH) ===
  `<${canonicalUrl(SMM_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SMM Link header is self-canonical");
} else fail("SMM Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(SMM_COURSE_SEO.title) === false) {
  pass("SMM HTML SEO injection does not change /Internships");
} else fail("SMM metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", "/Blog/sem-search-engine-marketing").includes(SMM_COURSE_SEO.title) === false) {
  pass("SMM HTML SEO injection does not change SEM course page");
} else fail("SMM metadata leaked onto SEM course page");
if (applyInitialHtmlSeo("<title>Home</title>", "/Blog/sem-search-engine-marketing/videos").includes(SMM_COURSE_SEO.title) === false) {
  pass("SMM HTML SEO injection does not change SEM /videos");
} else fail("SMM metadata leaked onto SEM /videos");
if (
  documentLinkHeader("/Blog/sem-search-engine-marketing/videos") ===
  "<https://knockyourknowledge.com/Blog/sem-search-engine-marketing>; rel=\"canonical\""
) {
  pass("SEM /videos Link header still points at the parent course");
} else fail("SEM /videos Link header changed");
if (
  documentLinkHeader("/Blog/smm-social-media-marketing/videos") ===
  `<${canonicalUrl(SMM_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SMM /videos Link header still points at the parent course");
} else fail("SMM /videos Link header is not the parent course");

const seoCourseTitleHtml = SEO_COURSE_SEO.title.replace(/&/g, "&amp;");
const seoCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  SEO_COURSE_PATH
);
if (seoCourseShell.includes(seoCourseTitleHtml)) pass("Initial HTML title for SEO course");
else fail("Initial HTML missing SEO course title");
if (seoCourseShell.includes(SEO_COURSE_SEO.description)) pass("Initial HTML description for SEO course");
else fail("Initial HTML missing SEO course description");
if ((seoCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("SEO course initial HTML has exactly one canonical");
else fail("SEO course initial HTML canonical count is not 1");
if (seoCourseShell.includes(`href="${canonicalUrl(SEO_COURSE_PATH)}"`)) pass("SEO course initial HTML canonical is the course URL");
else fail("SEO course initial HTML canonical is not the course URL");
if (seoCourseShell.includes('content="index, follow"')) pass("SEO course initial HTML robots is index, follow");
else fail("SEO course initial HTML missing index, follow");
if (
  documentLinkHeader(SEO_COURSE_PATH) ===
  `<${canonicalUrl(SEO_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SEO course Link header is self-canonical");
} else fail("SEO course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(SEO_COURSE_SEO.title) === false) {
  pass("SEO course HTML SEO injection does not change SMM");
} else fail("SEO course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(SEO_COURSE_SEO.title) === false) {
  pass("SEO course HTML SEO injection does not change /Internships");
} else fail("SEO course metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", "/Blog/sem-search-engine-marketing").includes(SEO_COURSE_SEO.title) === false) {
  pass("SEO course HTML SEO injection does not change SEM course page");
} else fail("SEO course metadata leaked onto SEM course page");
if (
  documentLinkHeader("/Blog/seo-search-engine-optimization/videos") ===
  `<${canonicalUrl(SEO_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SEO course /videos Link header still points at the parent course");
} else fail("SEO course /videos Link header is not the parent course");

const semCourseTitleHtml = SEM_COURSE_SEO.title.replace(/&/g, "&amp;");
const semCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  SEM_COURSE_PATH
);
if (semCourseShell.includes(semCourseTitleHtml)) pass("Initial HTML title for SEM course");
else fail("Initial HTML missing SEM course title");
if (semCourseShell.includes(SEM_COURSE_SEO.description)) pass("Initial HTML description for SEM course");
else fail("Initial HTML missing SEM course description");
if ((semCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("SEM course initial HTML has exactly one canonical");
else fail("SEM course initial HTML canonical count is not 1");
if (semCourseShell.includes(`href="${canonicalUrl(SEM_COURSE_PATH)}"`)) pass("SEM course initial HTML canonical is the course URL");
else fail("SEM course initial HTML canonical is not the course URL");
if (semCourseShell.includes('content="index, follow"')) pass("SEM course initial HTML robots is index, follow");
else fail("SEM course initial HTML missing index, follow");
if (
  documentLinkHeader(SEM_COURSE_PATH) ===
  `<${canonicalUrl(SEM_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SEM course Link header is self-canonical");
} else fail("SEM course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(SEM_COURSE_SEO.title) === false) {
  pass("SEM course HTML SEO injection does not change SMM");
} else fail("SEM course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(SEM_COURSE_SEO.title) === false) {
  pass("SEM course HTML SEO injection does not change SEO course");
} else fail("SEM course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(SEM_COURSE_SEO.title) === false) {
  pass("SEM course HTML SEO injection does not change /Internships");
} else fail("SEM course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/sem-search-engine-marketing/videos") ===
  `<${canonicalUrl(SEM_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SEM course /videos Link header still points at the parent course");
} else fail("SEM course /videos Link header is not the parent course");
if (SEM_COURSE_SEO.productName === "SEM — Search Engine Marketing") {
  pass("SEM productName is unchanged for the videos page title");
} else fail("SEM productName changed");

const smoCourseTitleHtml = SMO_COURSE_SEO.title.replace(/&/g, "&amp;");
const smoCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  SMO_COURSE_PATH
);
if (smoCourseShell.includes(smoCourseTitleHtml)) pass("Initial HTML title for SMO course");
else fail("Initial HTML missing SMO course title");
if (smoCourseShell.includes(SMO_COURSE_SEO.description)) pass("Initial HTML description for SMO course");
else fail("Initial HTML missing SMO course description");
if ((smoCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("SMO course initial HTML has exactly one canonical");
else fail("SMO course initial HTML canonical count is not 1");
if (smoCourseShell.includes(`href="${canonicalUrl(SMO_COURSE_PATH)}"`)) pass("SMO course initial HTML canonical is the course URL");
else fail("SMO course initial HTML canonical is not the course URL");
if (smoCourseShell.includes('content="index, follow"')) pass("SMO course initial HTML robots is index, follow");
else fail("SMO course initial HTML missing index, follow");
if (
  documentLinkHeader(SMO_COURSE_PATH) ===
  `<${canonicalUrl(SMO_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SMO course Link header is self-canonical");
} else fail("SMO course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(SMO_COURSE_SEO.title) === false) {
  pass("SMO course HTML SEO injection does not change SMM");
} else fail("SMO course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(SMO_COURSE_SEO.title) === false) {
  pass("SMO course HTML SEO injection does not change SEO course");
} else fail("SMO course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(SMO_COURSE_SEO.title) === false) {
  pass("SMO course HTML SEO injection does not change SEM course");
} else fail("SMO course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(SMO_COURSE_SEO.title) === false) {
  pass("SMO course HTML SEO injection does not change /Internships");
} else fail("SMO course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/smo-social-media-optimization/videos") ===
  `<${canonicalUrl(SMO_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SMO course /videos Link header still points at the parent course");
} else fail("SMO course /videos Link header is not the parent course");
if (SMO_COURSE_SEO.productName === "SMO — Social Media Optimization") {
  pass("SMO productName is unchanged for the videos page title");
} else fail("SMO productName changed");

const gscCourseTitleHtml = GSC_COURSE_SEO.title.replace(/&/g, "&amp;");
const gscCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  GSC_COURSE_PATH
);
if (gscCourseShell.includes(gscCourseTitleHtml)) pass("Initial HTML title for GSC course");
else fail("Initial HTML missing GSC course title");
if (gscCourseShell.includes(GSC_COURSE_SEO.description)) pass("Initial HTML description for GSC course");
else fail("Initial HTML missing GSC course description");
if ((gscCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("GSC course initial HTML has exactly one canonical");
else fail("GSC course initial HTML canonical count is not 1");
if (gscCourseShell.includes(`href="${canonicalUrl(GSC_COURSE_PATH)}"`)) pass("GSC course initial HTML canonical is the course URL");
else fail("GSC course initial HTML canonical is not the course URL");
if (gscCourseShell.includes('content="index, follow"')) pass("GSC course initial HTML robots is index, follow");
else fail("GSC course initial HTML missing index, follow");
if (
  documentLinkHeader(GSC_COURSE_PATH) ===
  `<${canonicalUrl(GSC_COURSE_PATH)}>; rel="canonical"`
) {
  pass("GSC course Link header is self-canonical");
} else fail("GSC course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(GSC_COURSE_SEO.title) === false) {
  pass("GSC course HTML SEO injection does not change SMM");
} else fail("GSC course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(GSC_COURSE_SEO.title) === false) {
  pass("GSC course HTML SEO injection does not change SEO course");
} else fail("GSC course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(GSC_COURSE_SEO.title) === false) {
  pass("GSC course HTML SEO injection does not change SEM course");
} else fail("GSC course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(GSC_COURSE_SEO.title) === false) {
  pass("GSC course HTML SEO injection does not change SMO course");
} else fail("GSC course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(GSC_COURSE_SEO.title) === false) {
  pass("GSC course HTML SEO injection does not change /Internships");
} else fail("GSC course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/google-webmaster-search-console/videos") ===
  `<${canonicalUrl(GSC_COURSE_PATH)}>; rel="canonical"`
) {
  pass("GSC course /videos Link header still points at the parent course");
} else fail("GSC course /videos Link header is not the parent course");
if (GSC_COURSE_SEO.productName === "Google Webmaster & Search Console") {
  pass("GSC productName is unchanged for the videos page title");
} else fail("GSC productName changed");

const aimCourseTitleHtml = AI_MARKETING_COURSE_SEO.title.replace(/&/g, "&amp;");
const aimCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  AI_MARKETING_COURSE_PATH
);
if (aimCourseShell.includes(aimCourseTitleHtml)) pass("Initial HTML title for AI marketing course");
else fail("Initial HTML missing AI marketing course title");
if (aimCourseShell.includes(AI_MARKETING_COURSE_SEO.description)) pass("Initial HTML description for AI marketing course");
else fail("Initial HTML missing AI marketing course description");
if ((aimCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("AI marketing course initial HTML has exactly one canonical");
else fail("AI marketing course initial HTML canonical count is not 1");
if (aimCourseShell.includes(`href="${canonicalUrl(AI_MARKETING_COURSE_PATH)}"`)) pass("AI marketing course initial HTML canonical is the course URL");
else fail("AI marketing course initial HTML canonical is not the course URL");
if (aimCourseShell.includes('content="index, follow"')) pass("AI marketing course initial HTML robots is index, follow");
else fail("AI marketing course initial HTML missing index, follow");
if (
  documentLinkHeader(AI_MARKETING_COURSE_PATH) ===
  `<${canonicalUrl(AI_MARKETING_COURSE_PATH)}>; rel="canonical"`
) {
  pass("AI marketing course Link header is self-canonical");
} else fail("AI marketing course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(AI_MARKETING_COURSE_SEO.title) === false) {
  pass("AI marketing course HTML SEO injection does not change SMM");
} else fail("AI marketing course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(AI_MARKETING_COURSE_SEO.title) === false) {
  pass("AI marketing course HTML SEO injection does not change SEO course");
} else fail("AI marketing course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(AI_MARKETING_COURSE_SEO.title) === false) {
  pass("AI marketing course HTML SEO injection does not change SEM course");
} else fail("AI marketing course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(AI_MARKETING_COURSE_SEO.title) === false) {
  pass("AI marketing course HTML SEO injection does not change SMO course");
} else fail("AI marketing course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(AI_MARKETING_COURSE_SEO.title) === false) {
  pass("AI marketing course HTML SEO injection does not change GSC course");
} else fail("AI marketing course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(AI_MARKETING_COURSE_SEO.title) === false) {
  pass("AI marketing course HTML SEO injection does not change /Internships");
} else fail("AI marketing course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/ai-tools-in-digital-marketing/videos") ===
  `<${canonicalUrl(AI_MARKETING_COURSE_PATH)}>; rel="canonical"`
) {
  pass("AI marketing course /videos Link header still points at the parent course");
} else fail("AI marketing course /videos Link header is not the parent course");
if (AI_MARKETING_COURSE_SEO.productName === "AI Tools in Digital Marketing") {
  pass("AI marketing productName is unchanged for the videos page title");
} else fail("AI marketing productName changed");

const aipCourseTitleHtml = AI_PRODUCTIVITY_COURSE_SEO.title.replace(/&/g, "&amp;");
const aipCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  AI_PRODUCTIVITY_COURSE_PATH
);
if (aipCourseShell.includes(aipCourseTitleHtml)) pass("Initial HTML title for AI productivity course");
else fail("Initial HTML missing AI productivity course title");
if (aipCourseShell.includes(AI_PRODUCTIVITY_COURSE_SEO.description)) pass("Initial HTML description for AI productivity course");
else fail("Initial HTML missing AI productivity course description");
if ((aipCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("AI productivity course initial HTML has exactly one canonical");
else fail("AI productivity course initial HTML canonical count is not 1");
if (aipCourseShell.includes(`href="${canonicalUrl(AI_PRODUCTIVITY_COURSE_PATH)}"`)) pass("AI productivity course initial HTML canonical is the course URL");
else fail("AI productivity course initial HTML canonical is not the course URL");
if (aipCourseShell.includes('content="index, follow"')) pass("AI productivity course initial HTML robots is index, follow");
else fail("AI productivity course initial HTML missing index, follow");
if (
  documentLinkHeader(AI_PRODUCTIVITY_COURSE_PATH) ===
  `<${canonicalUrl(AI_PRODUCTIVITY_COURSE_PATH)}>; rel="canonical"`
) {
  pass("AI productivity course Link header is self-canonical");
} else fail("AI productivity course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(AI_PRODUCTIVITY_COURSE_SEO.title) === false) {
  pass("AI productivity course HTML SEO injection does not change SMM");
} else fail("AI productivity course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(AI_PRODUCTIVITY_COURSE_SEO.title) === false) {
  pass("AI productivity course HTML SEO injection does not change SEO course");
} else fail("AI productivity course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(AI_PRODUCTIVITY_COURSE_SEO.title) === false) {
  pass("AI productivity course HTML SEO injection does not change SEM course");
} else fail("AI productivity course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(AI_PRODUCTIVITY_COURSE_SEO.title) === false) {
  pass("AI productivity course HTML SEO injection does not change SMO course");
} else fail("AI productivity course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(AI_PRODUCTIVITY_COURSE_SEO.title) === false) {
  pass("AI productivity course HTML SEO injection does not change GSC course");
} else fail("AI productivity course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(AI_PRODUCTIVITY_COURSE_SEO.title) === false) {
  pass("AI productivity course HTML SEO injection does not change AI marketing course");
} else fail("AI productivity course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(AI_PRODUCTIVITY_COURSE_SEO.title) === false) {
  pass("AI productivity course HTML SEO injection does not change /Internships");
} else fail("AI productivity course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/8-best-ai-tools-for-productivity/videos") ===
  `<${canonicalUrl(AI_PRODUCTIVITY_COURSE_PATH)}>; rel="canonical"`
) {
  pass("AI productivity course /videos Link header still points at the parent course");
} else fail("AI productivity course /videos Link header is not the parent course");
if (AI_PRODUCTIVITY_COURSE_SEO.productName === "8 Best AI Tools for Productivity") {
  pass("AI productivity productName is unchanged for the videos page title");
} else fail("AI productivity productName changed");

const peCourseTitleHtml = PROMPT_ENGINEERING_COURSE_SEO.title.replace(/&/g, "&amp;");
const peCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  PROMPT_ENGINEERING_COURSE_PATH
);
if (peCourseShell.includes(peCourseTitleHtml)) pass("Initial HTML title for Prompt Engineering course");
else fail("Initial HTML missing Prompt Engineering course title");
if (peCourseShell.includes(PROMPT_ENGINEERING_COURSE_SEO.description)) pass("Initial HTML description for Prompt Engineering course");
else fail("Initial HTML missing Prompt Engineering course description");
if ((peCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Prompt Engineering course initial HTML has exactly one canonical");
else fail("Prompt Engineering course initial HTML canonical count is not 1");
if (peCourseShell.includes(`href="${canonicalUrl(PROMPT_ENGINEERING_COURSE_PATH)}"`)) pass("Prompt Engineering course initial HTML canonical is the course URL");
else fail("Prompt Engineering course initial HTML canonical is not the course URL");
if (peCourseShell.includes('content="index, follow"')) pass("Prompt Engineering course initial HTML robots is index, follow");
else fail("Prompt Engineering course initial HTML missing index, follow");
if (
  documentLinkHeader(PROMPT_ENGINEERING_COURSE_PATH) ===
  `<${canonicalUrl(PROMPT_ENGINEERING_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Prompt Engineering course Link header is self-canonical");
} else fail("Prompt Engineering course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change SMM");
} else fail("Prompt Engineering course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change SEO course");
} else fail("Prompt Engineering course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change SEM course");
} else fail("Prompt Engineering course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change SMO course");
} else fail("Prompt Engineering course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change GSC course");
} else fail("Prompt Engineering course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change AI marketing course");
} else fail("Prompt Engineering course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change AI productivity course");
} else fail("Prompt Engineering course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(PROMPT_ENGINEERING_COURSE_SEO.title) === false) {
  pass("Prompt Engineering course HTML SEO injection does not change /Internships");
} else fail("Prompt Engineering course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/prompt-engineering/videos") ===
  `<${canonicalUrl(PROMPT_ENGINEERING_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Prompt Engineering course /videos Link header still points at the parent course");
} else fail("Prompt Engineering course /videos Link header is not the parent course");
if (PROMPT_ENGINEERING_COURSE_SEO.productName === "Prompt Engineering") {
  pass("Prompt Engineering productName is unchanged for the videos page title");
} else fail("Prompt Engineering productName changed");

const aifCourseTitleHtml = AI_FUNDAMENTALS_COURSE_SEO.title.replace(/&/g, "&amp;");
const aifCourseDescHtml = AI_FUNDAMENTALS_COURSE_SEO.description.replace(/&/g, "&amp;");
const aifOgImageHtml = AI_FUNDAMENTALS_COURSE_SEO.ogImage.replace(/&/g, "&amp;");
const aifCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  AI_FUNDAMENTALS_COURSE_PATH
);
if (aifCourseShell.includes(aifCourseTitleHtml)) pass("Initial HTML title for AI Fundamentals course");
else fail("Initial HTML missing AI Fundamentals course title");
if (aifCourseShell.includes(aifCourseDescHtml)) pass("Initial HTML description for AI Fundamentals course");
else fail("Initial HTML missing AI Fundamentals course description");
if ((aifCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("AI Fundamentals course initial HTML has exactly one canonical");
else fail("AI Fundamentals course initial HTML canonical count is not 1");
if (aifCourseShell.includes(`href="${canonicalUrl(AI_FUNDAMENTALS_COURSE_PATH)}"`)) pass("AI Fundamentals course initial HTML canonical is the course URL");
else fail("AI Fundamentals course initial HTML canonical is not the course URL");
if (aifCourseShell.includes('content="index, follow"')) pass("AI Fundamentals course initial HTML robots is index, follow");
else fail("AI Fundamentals course initial HTML missing index, follow");
if (aifCourseShell.includes('property="og:title"') && aifCourseShell.includes('name="twitter:card"')) {
  pass("AI Fundamentals course initial HTML includes OG and Twitter tags");
} else fail("AI Fundamentals course initial HTML missing OG or Twitter tags");
if (
  aifCourseShell.includes(`property="og:title"`) &&
  aifCourseShell.includes(`content="${aifCourseTitleHtml}"`) &&
  aifCourseShell.includes(`property="og:description"`) &&
  aifCourseShell.includes(`content="${aifCourseDescHtml}"`) &&
  aifCourseShell.includes(`property="og:url"`) &&
  aifCourseShell.includes(`content="${canonicalUrl(AI_FUNDAMENTALS_COURSE_PATH)}"`)
) {
  pass("AI Fundamentals course initial HTML OG title, description, and URL match Helmet");
} else fail("AI Fundamentals course initial HTML missing OG title, description, or URL");
if (
  aifCourseShell.includes(`content="${aifOgImageHtml}"`) &&
  aifCourseShell.includes('content="summary_large_image"')
) {
  pass("AI Fundamentals course initial HTML OG image and Twitter card match");
} else fail("AI Fundamentals course initial HTML missing OG image or Twitter card value");
if (
  aifCourseShell.includes('name="twitter:image"') &&
  (aifCourseShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (aifCourseShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("AI Fundamentals course initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("AI Fundamentals course initial HTML OG/Twitter tags are missing or duplicated");
if ((aifCourseShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("AI Fundamentals course initial HTML uses data-rh on first-byte SEO tags");
} else fail("AI Fundamentals course initial HTML data-rh count is not 12");
if (
  documentLinkHeader(AI_FUNDAMENTALS_COURSE_PATH) ===
  `<${canonicalUrl(AI_FUNDAMENTALS_COURSE_PATH)}>; rel="canonical"`
) {
  pass("AI Fundamentals course Link header is self-canonical");
} else fail("AI Fundamentals course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change SMM");
} else fail("AI Fundamentals course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change SEO course");
} else fail("AI Fundamentals course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change SEM course");
} else fail("AI Fundamentals course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change SMO course");
} else fail("AI Fundamentals course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change GSC course");
} else fail("AI Fundamentals course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change AI marketing course");
} else fail("AI Fundamentals course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change AI productivity course");
} else fail("AI Fundamentals course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change Prompt Engineering");
} else fail("AI Fundamentals course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change /Internships");
} else fail("AI Fundamentals course metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change Python Programming");
} else fail("AI Fundamentals course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change Data Science");
} else fail("AI Fundamentals course metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change MERN Stack Development");
} else fail("AI Fundamentals course metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", JIRA_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change Jira for Project Management");
} else fail("AI Fundamentals course metadata leaked onto Jira for Project Management");
if (applyInitialHtmlSeo("<title>Home</title>", SQL_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change SQL for Data Analysis");
} else fail("AI Fundamentals course metadata leaked onto SQL for Data Analysis");
if (applyInitialHtmlSeo("<title>Home</title>", POWER_BI_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change Power BI Dashboarding");
} else fail("AI Fundamentals course metadata leaked onto Power BI Dashboarding");
if (applyInitialHtmlSeo("<title>Home</title>", TABLEAU_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change Tableau Visualization");
} else fail("AI Fundamentals course metadata leaked onto Tableau Visualization");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_FOR_ANALYTICS_COURSE_PATH).includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change Python for Analytics");
} else fail("AI Fundamentals course metadata leaked onto Python for Analytics");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(AI_FUNDAMENTALS_COURSE_SEO.title) === false) {
  pass("AI Fundamentals course HTML SEO injection does not change the homepage");
} else fail("AI Fundamentals course metadata leaked onto the homepage");
if (
  applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes('property="og:image"') === false
) {
  pass("Prompt Engineering first-byte HTML still omits OG image after AI Fundamentals OG work");
} else fail("Prompt Engineering first-byte HTML gained OG image from AI Fundamentals work");
if (
  applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes('property="og:image"') === false
) {
  pass("AI productivity first-byte HTML still omits OG image after AI Fundamentals OG work");
} else fail("AI productivity first-byte HTML gained OG image from AI Fundamentals work");
if (
  applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes('property="og:image"') === false
) {
  pass("AI marketing first-byte HTML still omits OG image after AI Fundamentals OG work");
} else fail("AI marketing first-byte HTML gained OG image from AI Fundamentals work");
if (
  applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes('property="og:image"') === false
) {
  pass("Python Programming first-byte HTML still omits OG image after AI Fundamentals OG work");
} else fail("Python Programming first-byte HTML gained OG image from AI Fundamentals work");
if (
  documentLinkHeader("/Blog/artificial-intelligence-fundamentals/videos") ===
  `<${canonicalUrl(AI_FUNDAMENTALS_COURSE_PATH)}>; rel="canonical"`
) {
  pass("AI Fundamentals course /videos Link header still points at the parent course");
} else fail("AI Fundamentals course /videos Link header is not the parent course");
if (AI_FUNDAMENTALS_COURSE_SEO.productName === "Artificial Intelligence Fundamentals") {
  pass("AI Fundamentals productName is unchanged for the videos page title");
} else fail("AI Fundamentals productName changed");

const pyCourseTitleHtml = PYTHON_PROGRAMMING_COURSE_SEO.title.replace(/&/g, "&amp;");
const pyCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  PYTHON_PROGRAMMING_COURSE_PATH
);
if (pyCourseShell.includes(pyCourseTitleHtml)) pass("Initial HTML title for Python Programming course");
else fail("Initial HTML missing Python Programming course title");
if (pyCourseShell.includes(PYTHON_PROGRAMMING_COURSE_SEO.description)) pass("Initial HTML description for Python Programming course");
else fail("Initial HTML missing Python Programming course description");
if ((pyCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Python Programming course initial HTML has exactly one canonical");
else fail("Python Programming course initial HTML canonical count is not 1");
if (pyCourseShell.includes(`href="${canonicalUrl(PYTHON_PROGRAMMING_COURSE_PATH)}"`)) pass("Python Programming course initial HTML canonical is the course URL");
else fail("Python Programming course initial HTML canonical is not the course URL");
if (pyCourseShell.includes('content="index, follow"')) pass("Python Programming course initial HTML robots is index, follow");
else fail("Python Programming course initial HTML missing index, follow");
if (
  documentLinkHeader(PYTHON_PROGRAMMING_COURSE_PATH) ===
  `<${canonicalUrl(PYTHON_PROGRAMMING_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Python Programming course Link header is self-canonical");
} else fail("Python Programming course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change SMM");
} else fail("Python Programming course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change SEO course");
} else fail("Python Programming course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change SEM course");
} else fail("Python Programming course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change SMO course");
} else fail("Python Programming course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change GSC course");
} else fail("Python Programming course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change AI marketing course");
} else fail("Python Programming course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change AI productivity course");
} else fail("Python Programming course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change Prompt Engineering");
} else fail("Python Programming course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change AI Fundamentals");
} else fail("Python Programming course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(PYTHON_PROGRAMMING_COURSE_SEO.title) === false) {
  pass("Python Programming course HTML SEO injection does not change /Internships");
} else fail("Python Programming course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/python-programming/videos") ===
  `<${canonicalUrl(PYTHON_PROGRAMMING_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Python Programming course /videos Link header still points at the parent course");
} else fail("Python Programming course /videos Link header is not the parent course");
if (PYTHON_PROGRAMMING_COURSE_SEO.productName === "Python Programming") {
  pass("Python Programming productName is unchanged for the videos page title");
} else fail("Python Programming productName changed");
if (
  PYTHON_PROGRAMMING_COURSE_SEO.description.includes("mentor-led") === false &&
  PYTHON_PROGRAMMING_COURSE_SEO.description.includes("internship course") === false
) {
  pass("Python Programming metadata does not call this retail course a mentor-led internship");
} else fail("Python Programming metadata still uses internship or mentor-led wording");

const dsCourseTitleHtml = DATA_SCIENCE_COURSE_SEO.title.replace(/&/g, "&amp;");
const dsCourseDescHtml = DATA_SCIENCE_COURSE_SEO.description.replace(/&/g, "&amp;");
const dsOgImageHtml = DATA_SCIENCE_COURSE_SEO.ogImage.replace(/&/g, "&amp;");
const dsCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  DATA_SCIENCE_COURSE_PATH
);
if (dsCourseShell.includes(dsCourseTitleHtml)) pass("Initial HTML title for Data Science course");
else fail("Initial HTML missing Data Science course title");
if (dsCourseShell.includes(dsCourseDescHtml)) pass("Initial HTML description for Data Science course");
else fail("Initial HTML missing Data Science course description");
if ((dsCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Data Science course initial HTML has exactly one canonical");
else fail("Data Science course initial HTML canonical count is not 1");
if (dsCourseShell.includes(`href="${canonicalUrl(DATA_SCIENCE_COURSE_PATH)}"`)) pass("Data Science course initial HTML canonical is the course URL");
else fail("Data Science course initial HTML canonical is not the course URL");
if (dsCourseShell.includes('content="index, follow"')) pass("Data Science course initial HTML robots is index, follow");
else fail("Data Science course initial HTML missing index, follow");
if (dsCourseShell.includes('property="og:title"') && dsCourseShell.includes('name="twitter:card"')) {
  pass("Data Science course initial HTML includes OG and Twitter tags");
} else fail("Data Science course initial HTML missing OG or Twitter tags");
if (
  dsCourseShell.includes(`property="og:title"`) &&
  dsCourseShell.includes(`content="${dsCourseTitleHtml}"`) &&
  dsCourseShell.includes(`property="og:description"`) &&
  dsCourseShell.includes(`content="${dsCourseDescHtml}"`) &&
  dsCourseShell.includes(`property="og:url"`) &&
  dsCourseShell.includes(`content="${canonicalUrl(DATA_SCIENCE_COURSE_PATH)}"`)
) {
  pass("Data Science course initial HTML OG title, description, and URL match Helmet");
} else fail("Data Science course initial HTML missing OG title, description, or URL");
if (
  dsCourseShell.includes(`content="${dsOgImageHtml}"`) &&
  dsCourseShell.includes('content="summary_large_image"')
) {
  pass("Data Science course initial HTML OG image and Twitter card match");
} else fail("Data Science course initial HTML missing OG image or Twitter card value");
if (
  dsCourseShell.includes('name="twitter:image"') &&
  (dsCourseShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (dsCourseShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("Data Science course initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("Data Science course initial HTML OG/Twitter tags are missing or duplicated");
if ((dsCourseShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("Data Science course initial HTML uses data-rh on first-byte SEO tags");
} else fail("Data Science course initial HTML data-rh count is not 12");
if (
  documentLinkHeader(DATA_SCIENCE_COURSE_PATH) ===
  `<${canonicalUrl(DATA_SCIENCE_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Data Science course Link header is self-canonical");
} else fail("Data Science course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change SMM");
} else fail("Data Science course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change SEO course");
} else fail("Data Science course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change SEM course");
} else fail("Data Science course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change SMO course");
} else fail("Data Science course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change GSC course");
} else fail("Data Science course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change AI marketing course");
} else fail("Data Science course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change AI productivity course");
} else fail("Data Science course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change Prompt Engineering");
} else fail("Data Science course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change AI Fundamentals");
} else fail("Data Science course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change Python Programming");
} else fail("Data Science course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change /Internships");
} else fail("Data Science course metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change MERN Stack Development");
} else fail("Data Science course metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", JIRA_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change Jira for Project Management");
} else fail("Data Science course metadata leaked onto Jira for Project Management");
if (applyInitialHtmlSeo("<title>Home</title>", SQL_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change SQL for Data Analysis");
} else fail("Data Science course metadata leaked onto SQL for Data Analysis");
if (applyInitialHtmlSeo("<title>Home</title>", POWER_BI_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change Power BI Dashboarding");
} else fail("Data Science course metadata leaked onto Power BI Dashboarding");
if (applyInitialHtmlSeo("<title>Home</title>", TABLEAU_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change Tableau Visualization");
} else fail("Data Science course metadata leaked onto Tableau Visualization");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_FOR_ANALYTICS_COURSE_PATH).includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change Python for Analytics");
} else fail("Data Science course metadata leaked onto Python for Analytics");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(DATA_SCIENCE_COURSE_SEO.title) === false) {
  pass("Data Science course HTML SEO injection does not change the homepage");
} else fail("Data Science course metadata leaked onto the homepage");
if (
  applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes('property="og:image"') === false
) {
  pass("Python Programming first-byte HTML still omits OG image after Data Science OG work");
} else fail("Python Programming first-byte HTML gained OG image from Data Science work");
if (
  documentLinkHeader("/Blog/data-science/videos") ===
  `<${canonicalUrl(DATA_SCIENCE_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Data Science course /videos Link header still points at the parent course");
} else fail("Data Science course /videos Link header is not the parent course");
if (DATA_SCIENCE_COURSE_SEO.productName === "Data Science") {
  pass("Data Science productName is unchanged for the videos page title");
} else fail("Data Science productName changed");
if (
  DATA_SCIENCE_COURSE_SEO.description.includes("mentor-led") === false &&
  DATA_SCIENCE_COURSE_SEO.description.includes("internship course") === false
) {
  pass("Data Science metadata does not call this retail course a mentor-led internship");
} else fail("Data Science metadata still uses internship or mentor-led wording");

const mernCourseTitleHtml = MERN_STACK_COURSE_SEO.title.replace(/&/g, "&amp;");
const mernCourseDescHtml = MERN_STACK_COURSE_SEO.description.replace(/&/g, "&amp;");
const mernCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  MERN_STACK_COURSE_PATH
);
if (mernCourseShell.includes(mernCourseTitleHtml)) pass("Initial HTML title for MERN Stack Development course");
else fail("Initial HTML missing MERN Stack Development course title");
if (mernCourseShell.includes(mernCourseDescHtml)) pass("Initial HTML description for MERN Stack Development course");
else fail("Initial HTML missing MERN Stack Development course description");
if ((mernCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("MERN Stack Development course initial HTML has exactly one canonical");
else fail("MERN Stack Development course initial HTML canonical count is not 1");
if (mernCourseShell.includes(`href="${canonicalUrl(MERN_STACK_COURSE_PATH)}"`)) pass("MERN Stack Development course initial HTML canonical is the course URL");
else fail("MERN Stack Development course initial HTML canonical is not the course URL");
if (mernCourseShell.includes('content="index, follow"')) pass("MERN Stack Development course initial HTML robots is index, follow");
else fail("MERN Stack Development course initial HTML missing index, follow");
if (
  documentLinkHeader(MERN_STACK_COURSE_PATH) ===
  `<${canonicalUrl(MERN_STACK_COURSE_PATH)}>; rel="canonical"`
) {
  pass("MERN Stack Development course Link header is self-canonical");
} else fail("MERN Stack Development course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change SMM");
} else fail("MERN Stack Development course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change SEO course");
} else fail("MERN Stack Development course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change SEM course");
} else fail("MERN Stack Development course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change SMO course");
} else fail("MERN Stack Development course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change GSC course");
} else fail("MERN Stack Development course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change AI marketing course");
} else fail("MERN Stack Development course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change AI productivity course");
} else fail("MERN Stack Development course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change Prompt Engineering");
} else fail("MERN Stack Development course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change AI Fundamentals");
} else fail("MERN Stack Development course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change Python Programming");
} else fail("MERN Stack Development course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change Data Science");
} else fail("MERN Stack Development course metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(MERN_STACK_COURSE_SEO.title) === false) {
  pass("MERN Stack Development course HTML SEO injection does not change /Internships");
} else fail("MERN Stack Development course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/mern-stack-development/videos") ===
  `<${canonicalUrl(MERN_STACK_COURSE_PATH)}>; rel="canonical"`
) {
  pass("MERN Stack Development course /videos Link header still points at the parent course");
} else fail("MERN Stack Development course /videos Link header is not the parent course");
if (MERN_STACK_COURSE_SEO.productName === "MERN Stack Development") {
  pass("MERN Stack Development productName is unchanged for the videos page title");
} else fail("MERN Stack Development productName changed");
if (
  MERN_STACK_COURSE_SEO.description.includes("mentor-led") === false &&
  MERN_STACK_COURSE_SEO.description.includes("internship course") === false
) {
  pass("MERN Stack Development metadata does not call this retail course a mentor-led internship");
} else fail("MERN Stack Development metadata still uses internship or mentor-led wording");

const jiraCourseTitleHtml = JIRA_COURSE_SEO.title.replace(/&/g, "&amp;");
const jiraCourseDescHtml = JIRA_COURSE_SEO.description.replace(/&/g, "&amp;");
const jiraCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  JIRA_COURSE_PATH
);
if (jiraCourseShell.includes(jiraCourseTitleHtml)) pass("Initial HTML title for Jira for Project Management course");
else fail("Initial HTML missing Jira for Project Management course title");
if (jiraCourseShell.includes(jiraCourseDescHtml)) pass("Initial HTML description for Jira for Project Management course");
else fail("Initial HTML missing Jira for Project Management course description");
if ((jiraCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Jira for Project Management course initial HTML has exactly one canonical");
else fail("Jira for Project Management course initial HTML canonical count is not 1");
if (jiraCourseShell.includes(`href="${canonicalUrl(JIRA_COURSE_PATH)}"`)) pass("Jira for Project Management course initial HTML canonical is the course URL");
else fail("Jira for Project Management course initial HTML canonical is not the course URL");
if (jiraCourseShell.includes('content="index, follow"')) pass("Jira for Project Management course initial HTML robots is index, follow");
else fail("Jira for Project Management course initial HTML missing index, follow");
if (jiraCourseShell.includes('property="og:title"') && jiraCourseShell.includes('name="twitter:card"')) {
  pass("Jira for Project Management course initial HTML includes OG and Twitter tags");
} else fail("Jira for Project Management course initial HTML missing OG or Twitter tags");
if (
  documentLinkHeader(JIRA_COURSE_PATH) ===
  `<${canonicalUrl(JIRA_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Jira for Project Management course Link header is self-canonical");
} else fail("Jira for Project Management course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change SMM");
} else fail("Jira for Project Management course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change SEO course");
} else fail("Jira for Project Management course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change SEM course");
} else fail("Jira for Project Management course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change SMO course");
} else fail("Jira for Project Management course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change GSC course");
} else fail("Jira for Project Management course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change AI marketing course");
} else fail("Jira for Project Management course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change AI productivity course");
} else fail("Jira for Project Management course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change Prompt Engineering");
} else fail("Jira for Project Management course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change AI Fundamentals");
} else fail("Jira for Project Management course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change Python Programming");
} else fail("Jira for Project Management course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change Data Science");
} else fail("Jira for Project Management course metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change MERN Stack Development");
} else fail("Jira for Project Management course metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", SQL_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change SQL for Data Analysis");
} else fail("Jira for Project Management course metadata leaked onto SQL for Data Analysis");
if (applyInitialHtmlSeo("<title>Home</title>", POWER_BI_COURSE_PATH).includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change Power BI Dashboarding");
} else fail("Jira for Project Management course metadata leaked onto Power BI Dashboarding");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(JIRA_COURSE_SEO.title) === false) {
  pass("Jira for Project Management course HTML SEO injection does not change /Internships");
} else fail("Jira for Project Management course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/jira-for-project-management/videos") ===
  `<${canonicalUrl(JIRA_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Jira for Project Management course /videos Link header still points at the parent course");
} else fail("Jira for Project Management course /videos Link header is not the parent course");
if (JIRA_COURSE_SEO.productName === "Jira for Project Management") {
  pass("Jira for Project Management productName is unchanged for the videos page title");
} else fail("Jira for Project Management productName changed");
if (
  JIRA_COURSE_SEO.description.includes("mentor-led") === false &&
  JIRA_COURSE_SEO.description.includes("internship course") === false
) {
  pass("Jira for Project Management metadata does not call this retail course a mentor-led internship");
} else fail("Jira for Project Management metadata still uses internship or mentor-led wording");

const sqlCourseTitleHtml = SQL_COURSE_SEO.title.replace(/&/g, "&amp;");
const sqlCourseDescHtml = SQL_COURSE_SEO.description.replace(/&/g, "&amp;");
const sqlCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  SQL_COURSE_PATH
);
if (sqlCourseShell.includes(sqlCourseTitleHtml)) pass("Initial HTML title for SQL for Data Analysis course");
else fail("Initial HTML missing SQL for Data Analysis course title");
if (sqlCourseShell.includes(sqlCourseDescHtml)) pass("Initial HTML description for SQL for Data Analysis course");
else fail("Initial HTML missing SQL for Data Analysis course description");
if ((sqlCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("SQL for Data Analysis course initial HTML has exactly one canonical");
else fail("SQL for Data Analysis course initial HTML canonical count is not 1");
if (sqlCourseShell.includes(`href="${canonicalUrl(SQL_COURSE_PATH)}"`)) pass("SQL for Data Analysis course initial HTML canonical is the course URL");
else fail("SQL for Data Analysis course initial HTML canonical is not the course URL");
if (sqlCourseShell.includes('content="index, follow"')) pass("SQL for Data Analysis course initial HTML robots is index, follow");
else fail("SQL for Data Analysis course initial HTML missing index, follow");
if (sqlCourseShell.includes('property="og:title"') && sqlCourseShell.includes('name="twitter:card"')) {
  pass("SQL for Data Analysis course initial HTML includes OG and Twitter tags");
} else fail("SQL for Data Analysis course initial HTML missing OG or Twitter tags");
if (
  documentLinkHeader(SQL_COURSE_PATH) ===
  `<${canonicalUrl(SQL_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SQL for Data Analysis course Link header is self-canonical");
} else fail("SQL for Data Analysis course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change SMM");
} else fail("SQL for Data Analysis course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change SEO course");
} else fail("SQL for Data Analysis course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change SEM course");
} else fail("SQL for Data Analysis course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change SMO course");
} else fail("SQL for Data Analysis course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change GSC course");
} else fail("SQL for Data Analysis course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change AI marketing course");
} else fail("SQL for Data Analysis course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change AI productivity course");
} else fail("SQL for Data Analysis course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change Prompt Engineering");
} else fail("SQL for Data Analysis course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change AI Fundamentals");
} else fail("SQL for Data Analysis course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change Python Programming");
} else fail("SQL for Data Analysis course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change Data Science");
} else fail("SQL for Data Analysis course metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change MERN Stack Development");
} else fail("SQL for Data Analysis course metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", JIRA_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change Jira for Project Management");
} else fail("SQL for Data Analysis course metadata leaked onto Jira for Project Management");
if (applyInitialHtmlSeo("<title>Home</title>", POWER_BI_COURSE_PATH).includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change Power BI Dashboarding");
} else fail("SQL for Data Analysis course metadata leaked onto Power BI Dashboarding");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(SQL_COURSE_SEO.title) === false) {
  pass("SQL for Data Analysis course HTML SEO injection does not change /Internships");
} else fail("SQL for Data Analysis course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/sql-for-data-analysis/videos") ===
  `<${canonicalUrl(SQL_COURSE_PATH)}>; rel="canonical"`
) {
  pass("SQL for Data Analysis course /videos Link header still points at the parent course");
} else fail("SQL for Data Analysis course /videos Link header is not the parent course");
if (SQL_COURSE_SEO.productName === "SQL for Data Analysis") {
  pass("SQL for Data Analysis productName is unchanged for the videos page title");
} else fail("SQL for Data Analysis productName changed");
if (
  SQL_COURSE_SEO.description.includes("mentor-led") === false &&
  SQL_COURSE_SEO.description.includes("internship course") === false
) {
  pass("SQL for Data Analysis metadata does not call this retail course a mentor-led internship");
} else fail("SQL for Data Analysis metadata still uses internship or mentor-led wording");

const powerBiCourseTitleHtml = POWER_BI_COURSE_SEO.title.replace(/&/g, "&amp;");
const powerBiCourseDescHtml = POWER_BI_COURSE_SEO.description.replace(/&/g, "&amp;");
const powerBiOgImageHtml = POWER_BI_COURSE_SEO.ogImage.replace(/&/g, "&amp;");
const powerBiCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  POWER_BI_COURSE_PATH
);
if (powerBiCourseShell.includes(powerBiCourseTitleHtml)) pass("Initial HTML title for Power BI Dashboarding course");
else fail("Initial HTML missing Power BI Dashboarding course title");
if (powerBiCourseShell.includes(powerBiCourseDescHtml)) pass("Initial HTML description for Power BI Dashboarding course");
else fail("Initial HTML missing Power BI Dashboarding course description");
if ((powerBiCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Power BI Dashboarding course initial HTML has exactly one canonical");
else fail("Power BI Dashboarding course initial HTML canonical count is not 1");
if (powerBiCourseShell.includes(`href="${canonicalUrl(POWER_BI_COURSE_PATH)}"`)) pass("Power BI Dashboarding course initial HTML canonical is the course URL");
else fail("Power BI Dashboarding course initial HTML canonical is not the course URL");
if (powerBiCourseShell.includes('content="index, follow"')) pass("Power BI Dashboarding course initial HTML robots is index, follow");
else fail("Power BI Dashboarding course initial HTML missing index, follow");
if (powerBiCourseShell.includes('property="og:title"') && powerBiCourseShell.includes('name="twitter:card"')) {
  pass("Power BI Dashboarding course initial HTML includes OG and Twitter tags");
} else fail("Power BI Dashboarding course initial HTML missing OG or Twitter tags");
if (
  powerBiCourseShell.includes(`content="${powerBiOgImageHtml}"`) &&
  powerBiCourseShell.includes('content="summary_large_image"')
) {
  pass("Power BI Dashboarding course initial HTML OG image and Twitter card match");
} else fail("Power BI Dashboarding course initial HTML missing OG image or Twitter card value");
if (
  documentLinkHeader(POWER_BI_COURSE_PATH) ===
  `<${canonicalUrl(POWER_BI_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Power BI Dashboarding course Link header is self-canonical");
} else fail("Power BI Dashboarding course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change SMM");
} else fail("Power BI Dashboarding course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change SEO course");
} else fail("Power BI Dashboarding course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change SEM course");
} else fail("Power BI Dashboarding course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change SMO course");
} else fail("Power BI Dashboarding course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change GSC course");
} else fail("Power BI Dashboarding course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change AI marketing course");
} else fail("Power BI Dashboarding course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change AI productivity course");
} else fail("Power BI Dashboarding course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change Prompt Engineering");
} else fail("Power BI Dashboarding course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change AI Fundamentals");
} else fail("Power BI Dashboarding course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change Python Programming");
} else fail("Power BI Dashboarding course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change Data Science");
} else fail("Power BI Dashboarding course metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change MERN Stack Development");
} else fail("Power BI Dashboarding course metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", JIRA_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change Jira for Project Management");
} else fail("Power BI Dashboarding course metadata leaked onto Jira for Project Management");
if (applyInitialHtmlSeo("<title>Home</title>", SQL_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change SQL for Data Analysis");
} else fail("Power BI Dashboarding course metadata leaked onto SQL for Data Analysis");
if (applyInitialHtmlSeo("<title>Home</title>", TABLEAU_COURSE_PATH).includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change Tableau Visualization");
} else fail("Power BI Dashboarding course metadata leaked onto Tableau Visualization");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(POWER_BI_COURSE_SEO.title) === false) {
  pass("Power BI Dashboarding course HTML SEO injection does not change /Internships");
} else fail("Power BI Dashboarding course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/power-bi-dashboarding/videos") ===
  `<${canonicalUrl(POWER_BI_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Power BI Dashboarding course /videos Link header still points at the parent course");
} else fail("Power BI Dashboarding course /videos Link header is not the parent course");
if (POWER_BI_COURSE_SEO.productName === "Power BI Dashboarding") {
  pass("Power BI Dashboarding productName is unchanged for the videos page title");
} else fail("Power BI Dashboarding productName changed");
if (
  POWER_BI_COURSE_SEO.description.includes("mentor-led") === false &&
  POWER_BI_COURSE_SEO.description.includes("internship course") === false
) {
  pass("Power BI Dashboarding metadata does not call this retail course a mentor-led internship");
} else fail("Power BI Dashboarding metadata still uses internship or mentor-led wording");

const tableauCourseTitleHtml = TABLEAU_COURSE_SEO.title.replace(/&/g, "&amp;");
const tableauCourseDescHtml = TABLEAU_COURSE_SEO.description.replace(/&/g, "&amp;");
const tableauOgImageHtml = TABLEAU_COURSE_SEO.ogImage.replace(/&/g, "&amp;");
const tableauCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  TABLEAU_COURSE_PATH
);
if (tableauCourseShell.includes(tableauCourseTitleHtml)) pass("Initial HTML title for Tableau Visualization course");
else fail("Initial HTML missing Tableau Visualization course title");
if (tableauCourseShell.includes(tableauCourseDescHtml)) pass("Initial HTML description for Tableau Visualization course");
else fail("Initial HTML missing Tableau Visualization course description");
if ((tableauCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Tableau Visualization course initial HTML has exactly one canonical");
else fail("Tableau Visualization course initial HTML canonical count is not 1");
if (tableauCourseShell.includes(`href="${canonicalUrl(TABLEAU_COURSE_PATH)}"`)) pass("Tableau Visualization course initial HTML canonical is the course URL");
else fail("Tableau Visualization course initial HTML canonical is not the course URL");
if (tableauCourseShell.includes('content="index, follow"')) pass("Tableau Visualization course initial HTML robots is index, follow");
else fail("Tableau Visualization course initial HTML missing index, follow");
if (tableauCourseShell.includes('property="og:title"') && tableauCourseShell.includes('name="twitter:card"')) {
  pass("Tableau Visualization course initial HTML includes OG and Twitter tags");
} else fail("Tableau Visualization course initial HTML missing OG or Twitter tags");
if (
  tableauCourseShell.includes(`content="${tableauOgImageHtml}"`) &&
  tableauCourseShell.includes('content="summary_large_image"')
) {
  pass("Tableau Visualization course initial HTML OG image and Twitter card match");
} else fail("Tableau Visualization course initial HTML missing OG image or Twitter card value");
if (
  documentLinkHeader(TABLEAU_COURSE_PATH) ===
  `<${canonicalUrl(TABLEAU_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Tableau Visualization course Link header is self-canonical");
} else fail("Tableau Visualization course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change SMM");
} else fail("Tableau Visualization course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change SEO course");
} else fail("Tableau Visualization course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change SEM course");
} else fail("Tableau Visualization course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change SMO course");
} else fail("Tableau Visualization course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change GSC course");
} else fail("Tableau Visualization course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change AI marketing course");
} else fail("Tableau Visualization course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change AI productivity course");
} else fail("Tableau Visualization course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change Prompt Engineering");
} else fail("Tableau Visualization course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change AI Fundamentals");
} else fail("Tableau Visualization course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change Python Programming");
} else fail("Tableau Visualization course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change Data Science");
} else fail("Tableau Visualization course metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change MERN Stack Development");
} else fail("Tableau Visualization course metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", JIRA_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change Jira for Project Management");
} else fail("Tableau Visualization course metadata leaked onto Jira for Project Management");
if (applyInitialHtmlSeo("<title>Home</title>", SQL_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change SQL for Data Analysis");
} else fail("Tableau Visualization course metadata leaked onto SQL for Data Analysis");
if (applyInitialHtmlSeo("<title>Home</title>", POWER_BI_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change Power BI Dashboarding");
} else fail("Tableau Visualization course metadata leaked onto Power BI Dashboarding");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_FOR_ANALYTICS_COURSE_PATH).includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change Python for Analytics");
} else fail("Tableau Visualization course metadata leaked onto Python for Analytics");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(TABLEAU_COURSE_SEO.title) === false) {
  pass("Tableau Visualization course HTML SEO injection does not change /Internships");
} else fail("Tableau Visualization course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/tableau-visualization/videos") ===
  `<${canonicalUrl(TABLEAU_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Tableau Visualization course /videos Link header still points at the parent course");
} else fail("Tableau Visualization course /videos Link header is not the parent course");
if (TABLEAU_COURSE_SEO.productName === "Tableau Visualization") {
  pass("Tableau Visualization productName is unchanged for the videos page title");
} else fail("Tableau Visualization productName changed");
if (
  TABLEAU_COURSE_SEO.description.includes("mentor-led") === false &&
  TABLEAU_COURSE_SEO.description.includes("internship course") === false
) {
  pass("Tableau Visualization metadata does not call this retail course a mentor-led internship");
} else fail("Tableau Visualization metadata still uses internship or mentor-led wording");

const pythonForAnalyticsCourseTitleHtml = PYTHON_FOR_ANALYTICS_COURSE_SEO.title.replace(/&/g, "&amp;");
const pythonForAnalyticsCourseDescHtml = PYTHON_FOR_ANALYTICS_COURSE_SEO.description.replace(/&/g, "&amp;");
const pythonForAnalyticsOgImageHtml = PYTHON_FOR_ANALYTICS_COURSE_SEO.ogImage.replace(/&/g, "&amp;");
const pythonForAnalyticsCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  PYTHON_FOR_ANALYTICS_COURSE_PATH
);
if (pythonForAnalyticsCourseShell.includes(pythonForAnalyticsCourseTitleHtml)) pass("Initial HTML title for Python for Analytics course");
else fail("Initial HTML missing Python for Analytics course title");
if (pythonForAnalyticsCourseShell.includes(pythonForAnalyticsCourseDescHtml)) pass("Initial HTML description for Python for Analytics course");
else fail("Initial HTML missing Python for Analytics course description");
if ((pythonForAnalyticsCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Python for Analytics course initial HTML has exactly one canonical");
else fail("Python for Analytics course initial HTML canonical count is not 1");
if (pythonForAnalyticsCourseShell.includes(`href="${canonicalUrl(PYTHON_FOR_ANALYTICS_COURSE_PATH)}"`)) pass("Python for Analytics course initial HTML canonical is the course URL");
else fail("Python for Analytics course initial HTML canonical is not the course URL");
if (pythonForAnalyticsCourseShell.includes('content="index, follow"')) pass("Python for Analytics course initial HTML robots is index, follow");
else fail("Python for Analytics course initial HTML missing index, follow");
if (pythonForAnalyticsCourseShell.includes('property="og:title"') && pythonForAnalyticsCourseShell.includes('name="twitter:card"')) {
  pass("Python for Analytics course initial HTML includes OG and Twitter tags");
} else fail("Python for Analytics course initial HTML missing OG or Twitter tags");
if (
  pythonForAnalyticsCourseShell.includes(`content="${pythonForAnalyticsOgImageHtml}"`) &&
  pythonForAnalyticsCourseShell.includes('content="summary_large_image"')
) {
  pass("Python for Analytics course initial HTML OG image and Twitter card match");
} else fail("Python for Analytics course initial HTML missing OG image or Twitter card value");
if (
  documentLinkHeader(PYTHON_FOR_ANALYTICS_COURSE_PATH) ===
  `<${canonicalUrl(PYTHON_FOR_ANALYTICS_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Python for Analytics course Link header is self-canonical");
} else fail("Python for Analytics course Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change SMM");
} else fail("Python for Analytics course metadata leaked onto SMM");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change SEO course");
} else fail("Python for Analytics course metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change SEM course");
} else fail("Python for Analytics course metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMO_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change SMO course");
} else fail("Python for Analytics course metadata leaked onto SMO course");
if (applyInitialHtmlSeo("<title>Home</title>", GSC_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change GSC course");
} else fail("Python for Analytics course metadata leaked onto GSC course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_MARKETING_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change AI marketing course");
} else fail("Python for Analytics course metadata leaked onto AI marketing course");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change AI productivity course");
} else fail("Python for Analytics course metadata leaked onto AI productivity course");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change Prompt Engineering");
} else fail("Python for Analytics course metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change AI Fundamentals");
} else fail("Python for Analytics course metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change Python Programming");
} else fail("Python for Analytics course metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change Data Science");
} else fail("Python for Analytics course metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change MERN Stack Development");
} else fail("Python for Analytics course metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", JIRA_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change Jira for Project Management");
} else fail("Python for Analytics course metadata leaked onto Jira for Project Management");
if (applyInitialHtmlSeo("<title>Home</title>", SQL_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change SQL for Data Analysis");
} else fail("Python for Analytics course metadata leaked onto SQL for Data Analysis");
if (applyInitialHtmlSeo("<title>Home</title>", POWER_BI_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change Power BI Dashboarding");
} else fail("Python for Analytics course metadata leaked onto Power BI Dashboarding");
if (applyInitialHtmlSeo("<title>Home</title>", TABLEAU_COURSE_PATH).includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change Tableau Visualization");
} else fail("Python for Analytics course metadata leaked onto Tableau Visualization");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(PYTHON_FOR_ANALYTICS_COURSE_SEO.title) === false) {
  pass("Python for Analytics course HTML SEO injection does not change /Internships");
} else fail("Python for Analytics course metadata leaked onto /Internships");
if (
  documentLinkHeader("/Blog/python-for-analytics/videos") ===
  `<${canonicalUrl(PYTHON_FOR_ANALYTICS_COURSE_PATH)}>; rel="canonical"`
) {
  pass("Python for Analytics course /videos Link header still points at the parent course");
} else fail("Python for Analytics course /videos Link header is not the parent course");
if (PYTHON_FOR_ANALYTICS_COURSE_SEO.productName === "Python for Analytics") {
  pass("Python for Analytics productName is unchanged for the videos page title");
} else fail("Python for Analytics productName changed");
if (
  PYTHON_FOR_ANALYTICS_COURSE_SEO.description.includes("mentor-led") === false &&
  PYTHON_FOR_ANALYTICS_COURSE_SEO.description.includes("internship course") === false
) {
  pass("Python for Analytics metadata does not call this retail course a mentor-led internship");
} else fail("Python for Analytics metadata still uses internship or mentor-led wording");
if (PYTHON_FOR_ANALYTICS_COURSE_SEO.title.includes("Python for Data Analysis") === false) {
  pass("Python for Analytics title uses the catalog course name, not Python for Data Analysis");
} else fail("Python for Analytics title still says Python for Data Analysis");
if (PYTHON_FOR_ANALYTICS_COURSE_SEO.title !== PYTHON_PROGRAMMING_COURSE_SEO.title) {
  pass("Python for Analytics title is isolated from Python Programming");
} else fail("Python for Analytics title collided with Python Programming");
if (PYTHON_FOR_ANALYTICS_COURSE_SEO.description !== PYTHON_PROGRAMMING_COURSE_SEO.description) {
  pass("Python for Analytics description is isolated from Python Programming");
} else fail("Python for Analytics description collided with Python Programming");
if (PYTHON_FOR_ANALYTICS_COURSE_SEO.h1 !== PYTHON_PROGRAMMING_COURSE_SEO.h1) {
  pass("Python for Analytics H1 is isolated from Python Programming");
} else fail("Python for Analytics H1 collided with Python Programming");
if (PYTHON_FOR_ANALYTICS_COURSE_SEO.ogImage !== PYTHON_PROGRAMMING_COURSE_SEO.ogImage) {
  pass("Python for Analytics OG image is isolated from Python Programming");
} else fail("Python for Analytics OG image collided with Python Programming");
if (PYTHON_FOR_ANALYTICS_COURSE_SEO.productName !== PYTHON_PROGRAMMING_COURSE_SEO.productName) {
  pass("Python for Analytics productName is isolated from Python Programming");
} else fail("Python for Analytics productName collided with Python Programming");

const devBundleTitleHtml = DEVELOPMENT_BUNDLE_SEO.title.replace(/&/g, "&amp;");
const devBundleDescHtml = DEVELOPMENT_BUNDLE_SEO.description.replace(/&/g, "&amp;");
const devBundleOgImageHtml = DEVELOPMENT_BUNDLE_SEO.ogImage.replace(/&/g, "&amp;");
const devBundleShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  DEVELOPMENT_BUNDLE_PATH
);
if (devBundleShell.includes(devBundleTitleHtml)) pass("Initial HTML title for Development Bundle");
else fail("Initial HTML missing Development Bundle title");
if (devBundleShell.includes(devBundleDescHtml)) pass("Initial HTML description for Development Bundle");
else fail("Initial HTML missing Development Bundle description");
if ((devBundleShell.match(/rel="canonical"/g) || []).length === 1) pass("Development Bundle initial HTML has exactly one canonical");
else fail("Development Bundle initial HTML canonical count is not 1");
if (devBundleShell.includes(`href="${canonicalUrl(DEVELOPMENT_BUNDLE_PATH)}"`)) pass("Development Bundle initial HTML canonical is the bundle URL");
else fail("Development Bundle initial HTML canonical is not the bundle URL");
if (devBundleShell.includes('content="index, follow"')) pass("Development Bundle initial HTML robots is index, follow");
else fail("Development Bundle initial HTML missing index, follow");
if (devBundleShell.includes('property="og:title"') && devBundleShell.includes('name="twitter:card"')) {
  pass("Development Bundle initial HTML includes OG and Twitter tags");
} else fail("Development Bundle initial HTML missing OG or Twitter tags");
if (
  devBundleShell.includes(`property="og:title"`) &&
  devBundleShell.includes(`content="${devBundleTitleHtml}"`) &&
  devBundleShell.includes(`property="og:description"`) &&
  devBundleShell.includes(`content="${devBundleDescHtml}"`) &&
  devBundleShell.includes(`property="og:url"`) &&
  devBundleShell.includes(`content="${canonicalUrl(DEVELOPMENT_BUNDLE_PATH)}"`)
) {
  pass("Development Bundle initial HTML OG title, description, and URL match Helmet");
} else fail("Development Bundle initial HTML missing OG title, description, or URL");
if (
  devBundleShell.includes(`content="${devBundleOgImageHtml}"`) &&
  devBundleShell.includes('content="summary_large_image"')
) {
  pass("Development Bundle initial HTML OG image and Twitter card match");
} else fail("Development Bundle initial HTML missing OG image or Twitter card value");
if (
  devBundleShell.includes('name="twitter:image"') &&
  (devBundleShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (devBundleShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("Development Bundle initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("Development Bundle initial HTML OG/Twitter tags are missing or duplicated");
if ((devBundleShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("Development Bundle initial HTML uses data-rh on first-byte SEO tags");
} else fail("Development Bundle initial HTML data-rh count is not 12");
if (
  documentLinkHeader(DEVELOPMENT_BUNDLE_PATH) ===
  `<${canonicalUrl(DEVELOPMENT_BUNDLE_PATH)}>; rel="canonical"`
) {
  pass("Development Bundle Link header is self-canonical");
} else fail("Development Bundle Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", "/Bundles/ai").includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change AI bundle");
} else fail("Development Bundle metadata leaked onto AI bundle");
if (applyInitialHtmlSeo("<title>Home</title>", "/Bundles/analytics").includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change Analytics bundle");
} else fail("Development Bundle metadata leaked onto Analytics bundle");
if (applyInitialHtmlSeo("<title>Home</title>", "/Bundles/marketing").includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change Marketing bundle");
} else fail("Development Bundle metadata leaked onto Marketing bundle");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change Python Programming");
} else fail("Development Bundle metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", DATA_SCIENCE_COURSE_PATH).includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change Data Science");
} else fail("Development Bundle metadata leaked onto Data Science");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change MERN Stack Development");
} else fail("Development Bundle metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change the homepage");
} else fail("Development Bundle metadata leaked onto the homepage");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(DEVELOPMENT_BUNDLE_SEO.title) === false) {
  pass("Development Bundle HTML SEO injection does not change /Internships");
} else fail("Development Bundle metadata leaked onto /Internships");
if (devBundleShell.includes(devBundleOgImageHtml) && devBundleShell.includes(AI_BUNDLE_SEO.title) === false) {
  pass("Development Bundle first-byte OG image remains the Development cover after AI bundle work");
} else fail("Development Bundle first-byte OG image changed by AI bundle work");
if (DEVELOPMENT_BUNDLE_SEO.productName === "Development Bundle") {
  pass("Development Bundle productName remains Development Bundle");
} else fail("Development Bundle productName changed");
if (DEVELOPMENT_BUNDLE_SEO.h1 === "Development Bundle – Python, Data Science and MERN Training") {
  pass("Development Bundle H1 is the approved training heading");
} else fail("Development Bundle H1 is not the approved heading");
if (
  DEVELOPMENT_BUNDLE_SEO.ogImage === "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80"
) {
  pass("Development Bundle OG image is the existing Python Programming cover image");
} else fail("Development Bundle OG image is not the verified cover image");

const aiBundleTitleHtml = AI_BUNDLE_SEO.title.replace(/&/g, "&amp;");
const aiBundleDescHtml = AI_BUNDLE_SEO.description.replace(/&/g, "&amp;");
const aiBundleOgImageHtml = AI_BUNDLE_SEO.ogImage.replace(/&/g, "&amp;");
const aiBundleShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  AI_BUNDLE_PATH
);
if (aiBundleShell.includes(aiBundleTitleHtml)) pass("Initial HTML title for AI Bundle");
else fail("Initial HTML missing AI Bundle title");
if (aiBundleShell.includes(aiBundleDescHtml)) pass("Initial HTML description for AI Bundle");
else fail("Initial HTML missing AI Bundle description");
if ((aiBundleShell.match(/rel="canonical"/g) || []).length === 1) pass("AI Bundle initial HTML has exactly one canonical");
else fail("AI Bundle initial HTML canonical count is not 1");
if (aiBundleShell.includes(`href="${canonicalUrl(AI_BUNDLE_PATH)}"`)) pass("AI Bundle initial HTML canonical is the bundle URL");
else fail("AI Bundle initial HTML canonical is not the bundle URL");
if (aiBundleShell.includes('content="index, follow"')) pass("AI Bundle initial HTML robots is index, follow");
else fail("AI Bundle initial HTML missing index, follow");
if (aiBundleShell.includes('property="og:title"') && aiBundleShell.includes('name="twitter:card"')) {
  pass("AI Bundle initial HTML includes OG and Twitter tags");
} else fail("AI Bundle initial HTML missing OG or Twitter tags");
if (
  aiBundleShell.includes(`content="${aiBundleTitleHtml}"`) &&
  aiBundleShell.includes(`content="${aiBundleDescHtml}"`) &&
  aiBundleShell.includes(`content="${canonicalUrl(AI_BUNDLE_PATH)}"`)
) {
  pass("AI Bundle initial HTML OG title, description, and URL match Helmet");
} else fail("AI Bundle initial HTML missing OG title, description, or URL");
if (
  aiBundleShell.includes(`content="${aiBundleOgImageHtml}"`) &&
  aiBundleShell.includes('content="summary_large_image"')
) {
  pass("AI Bundle initial HTML OG image and Twitter card match");
} else fail("AI Bundle initial HTML missing OG image or Twitter card value");
if (
  aiBundleShell.includes('name="twitter:image"') &&
  (aiBundleShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (aiBundleShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("AI Bundle initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("AI Bundle initial HTML OG/Twitter tags are missing or duplicated");
if ((aiBundleShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("AI Bundle initial HTML uses data-rh on first-byte SEO tags");
} else fail("AI Bundle initial HTML data-rh count is not 12");
if (documentLinkHeader(AI_BUNDLE_PATH) === `<${canonicalUrl(AI_BUNDLE_PATH)}>; rel="canonical"`) {
  pass("AI Bundle Link header is self-canonical");
} else fail("AI Bundle Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", DEVELOPMENT_BUNDLE_PATH).includes(AI_BUNDLE_SEO.title) === false) {
  pass("AI Bundle HTML SEO injection does not change Development Bundle");
} else fail("AI Bundle metadata leaked onto Development Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", "/Bundles/analytics").includes(AI_BUNDLE_SEO.title) === false) {
  pass("AI Bundle HTML SEO injection does not change Analytics bundle");
} else fail("AI Bundle metadata leaked onto Analytics bundle");
if (applyInitialHtmlSeo("<title>Home</title>", "/Bundles/marketing").includes(AI_BUNDLE_SEO.title) === false) {
  pass("AI Bundle HTML SEO injection does not change Marketing bundle");
} else fail("AI Bundle metadata leaked onto Marketing bundle");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(AI_BUNDLE_SEO.title) === false) {
  pass("AI Bundle HTML SEO injection does not change AI Fundamentals");
} else fail("AI Bundle metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(AI_BUNDLE_SEO.title) === false) {
  pass("AI Bundle HTML SEO injection does not change Prompt Engineering");
} else fail("AI Bundle metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(AI_BUNDLE_SEO.title) === false) {
  pass("AI Bundle HTML SEO injection does not change the homepage");
} else fail("AI Bundle metadata leaked onto the homepage");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(AI_BUNDLE_SEO.title) === false) {
  pass("AI Bundle HTML SEO injection does not change /Internships");
} else fail("AI Bundle metadata leaked onto /Internships");
if (AI_BUNDLE_SEO.productName === "AI & Prompt Engineering Bundle") {
  pass("AI Bundle productName remains AI & Prompt Engineering Bundle");
} else fail("AI Bundle productName changed");
if (AI_BUNDLE_SEO.h1 === "AI & Prompt Engineering Bundle – AI Fundamentals, Prompts and Tools Training") {
  pass("AI Bundle H1 is the approved training heading");
} else fail("AI Bundle H1 is not the approved heading");
if (AI_BUNDLE_SEO.title === "AI & Prompt Engineering Course Bundle | KYK") {
  pass("AI Bundle title remains the approved Helmet title");
} else fail("AI Bundle title changed");
if (
  AI_BUNDLE_SEO.ogImage === "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" &&
  AI_BUNDLE_SEO.ogImage !== DEVELOPMENT_BUNDLE_SEO.ogImage
) {
  pass("AI Bundle OG image is the existing AI Fundamentals cover image");
} else fail("AI Bundle OG image is not the verified cover image");
if (AI_BUNDLE_SEO.title !== DEVELOPMENT_BUNDLE_SEO.title && AI_BUNDLE_SEO.description !== DEVELOPMENT_BUNDLE_SEO.description) {
  pass("AI Bundle title and description are isolated from Development Bundle");
} else fail("AI Bundle metadata collided with Development Bundle");

const analyticsBundleTitleHtml = ANALYTICS_BUNDLE_SEO.title.replace(/&/g, "&amp;");
const analyticsBundleDescHtml = ANALYTICS_BUNDLE_SEO.description.replace(/&/g, "&amp;");
const analyticsBundleOgImageHtml = ANALYTICS_BUNDLE_SEO.ogImage.replace(/&/g, "&amp;");
const analyticsBundleShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  ANALYTICS_BUNDLE_PATH
);
if (analyticsBundleShell.includes(analyticsBundleTitleHtml)) pass("Initial HTML title for Analytics Bundle");
else fail("Initial HTML missing Analytics Bundle title");
if (analyticsBundleShell.includes(analyticsBundleDescHtml)) pass("Initial HTML description for Analytics Bundle");
else fail("Initial HTML missing Analytics Bundle description");
if ((analyticsBundleShell.match(/rel="canonical"/g) || []).length === 1) pass("Analytics Bundle initial HTML has exactly one canonical");
else fail("Analytics Bundle initial HTML canonical count is not 1");
if (analyticsBundleShell.includes(`href="${canonicalUrl(ANALYTICS_BUNDLE_PATH)}"`)) pass("Analytics Bundle initial HTML canonical is the bundle URL");
else fail("Analytics Bundle initial HTML canonical is not the bundle URL");
if (analyticsBundleShell.includes('content="index, follow"')) pass("Analytics Bundle initial HTML robots is index, follow");
else fail("Analytics Bundle initial HTML missing index, follow");
if (analyticsBundleShell.includes('property="og:title"') && analyticsBundleShell.includes('name="twitter:card"')) {
  pass("Analytics Bundle initial HTML includes OG and Twitter tags");
} else fail("Analytics Bundle initial HTML missing OG or Twitter tags");
if (
  analyticsBundleShell.includes(`content="${analyticsBundleTitleHtml}"`) &&
  analyticsBundleShell.includes(`content="${analyticsBundleDescHtml}"`) &&
  analyticsBundleShell.includes(`content="${canonicalUrl(ANALYTICS_BUNDLE_PATH)}"`)
) {
  pass("Analytics Bundle initial HTML OG title, description, and URL match Helmet");
} else fail("Analytics Bundle initial HTML missing OG title, description, or URL");
if (
  analyticsBundleShell.includes(`content="${analyticsBundleOgImageHtml}"`) &&
  analyticsBundleShell.includes('content="summary_large_image"')
) {
  pass("Analytics Bundle initial HTML OG image and Twitter card match");
} else fail("Analytics Bundle initial HTML missing OG image or Twitter card value");
if (
  analyticsBundleShell.includes('name="twitter:image"') &&
  (analyticsBundleShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (analyticsBundleShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("Analytics Bundle initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("Analytics Bundle initial HTML OG/Twitter tags are missing or duplicated");
if ((analyticsBundleShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("Analytics Bundle initial HTML uses data-rh on first-byte SEO tags");
} else fail("Analytics Bundle initial HTML data-rh count is not 12");
if (documentLinkHeader(ANALYTICS_BUNDLE_PATH) === `<${canonicalUrl(ANALYTICS_BUNDLE_PATH)}>; rel="canonical"`) {
  pass("Analytics Bundle Link header is self-canonical");
} else fail("Analytics Bundle Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", DEVELOPMENT_BUNDLE_PATH).includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change Development Bundle");
} else fail("Analytics Bundle metadata leaked onto Development Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", AI_BUNDLE_PATH).includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change AI Bundle");
} else fail("Analytics Bundle metadata leaked onto AI Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", "/Bundles/marketing").includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change Marketing bundle");
} else fail("Analytics Bundle metadata leaked onto Marketing bundle");
if (applyInitialHtmlSeo("<title>Home</title>", SQL_COURSE_PATH).includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change SQL for Data Analysis");
} else fail("Analytics Bundle metadata leaked onto SQL for Data Analysis");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_FOR_ANALYTICS_COURSE_PATH).includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change Python for Analytics");
} else fail("Analytics Bundle metadata leaked onto Python for Analytics");
if (applyInitialHtmlSeo("<title>Home</title>", POWER_BI_COURSE_PATH).includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change Power BI Dashboarding");
} else fail("Analytics Bundle metadata leaked onto Power BI Dashboarding");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change the homepage");
} else fail("Analytics Bundle metadata leaked onto the homepage");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change /Internships");
} else fail("Analytics Bundle metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships/analytics").includes(ANALYTICS_BUNDLE_SEO.title) === false) {
  pass("Analytics Bundle HTML SEO injection does not change /Internships/analytics");
} else fail("Analytics Bundle metadata leaked onto /Internships/analytics");
if (ANALYTICS_BUNDLE_SEO.productName === "Business Analytics Bundle") {
  pass("Analytics Bundle productName remains Business Analytics Bundle");
} else fail("Analytics Bundle productName changed");
if (ANALYTICS_BUNDLE_SEO.h1 === "Business Analytics Bundle – SQL, Python Analytics, Power BI, Tableau and Jira Training") {
  pass("Analytics Bundle H1 is the approved training heading");
} else fail("Analytics Bundle H1 is not the approved heading");
if (ANALYTICS_BUNDLE_SEO.title === "Business Analytics Course Bundle | SQL, Power BI & Tableau | KYK") {
  pass("Analytics Bundle title remains the approved Helmet title");
} else fail("Analytics Bundle title changed");
if (
  ANALYTICS_BUNDLE_SEO.ogImage === "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80" &&
  ANALYTICS_BUNDLE_SEO.ogImage !== DEVELOPMENT_BUNDLE_SEO.ogImage &&
  ANALYTICS_BUNDLE_SEO.ogImage !== AI_BUNDLE_SEO.ogImage
) {
  pass("Analytics Bundle OG image is the existing SQL for Data Analysis cover image");
} else fail("Analytics Bundle OG image is not the verified cover image");
if (
  ANALYTICS_BUNDLE_SEO.title !== DEVELOPMENT_BUNDLE_SEO.title &&
  ANALYTICS_BUNDLE_SEO.description !== DEVELOPMENT_BUNDLE_SEO.description &&
  ANALYTICS_BUNDLE_SEO.title !== AI_BUNDLE_SEO.title &&
  ANALYTICS_BUNDLE_SEO.description !== AI_BUNDLE_SEO.description
) {
  pass("Analytics Bundle title and description are isolated from Development and AI Bundles");
} else fail("Analytics Bundle metadata collided with Development or AI Bundle");

const marketingBundleTitleHtml = MARKETING_BUNDLE_SEO.title.replace(/&/g, "&amp;");
const marketingBundleDescHtml = MARKETING_BUNDLE_SEO.description.replace(/&/g, "&amp;");
const marketingBundleOgImageHtml = MARKETING_BUNDLE_SEO.ogImage.replace(/&/g, "&amp;");
const marketingBundleShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  MARKETING_BUNDLE_PATH
);
if (marketingBundleShell.includes(marketingBundleTitleHtml)) pass("Initial HTML title for Marketing Bundle");
else fail("Initial HTML missing Marketing Bundle title");
if (marketingBundleShell.includes(marketingBundleDescHtml)) pass("Initial HTML description for Marketing Bundle");
else fail("Initial HTML missing Marketing Bundle description");
if ((marketingBundleShell.match(/rel="canonical"/g) || []).length === 1) pass("Marketing Bundle initial HTML has exactly one canonical");
else fail("Marketing Bundle initial HTML canonical count is not 1");
if (marketingBundleShell.includes(`href="${canonicalUrl(MARKETING_BUNDLE_PATH)}"`)) pass("Marketing Bundle initial HTML canonical is the bundle URL");
else fail("Marketing Bundle initial HTML canonical is not the bundle URL");
if (marketingBundleShell.includes('content="index, follow"')) pass("Marketing Bundle initial HTML robots is index, follow");
else fail("Marketing Bundle initial HTML missing index, follow");
if (marketingBundleShell.includes('property="og:title"') && marketingBundleShell.includes('name="twitter:card"')) {
  pass("Marketing Bundle initial HTML includes OG and Twitter tags");
} else fail("Marketing Bundle initial HTML missing OG or Twitter tags");
if (
  marketingBundleShell.includes(`content="${marketingBundleTitleHtml}"`) &&
  marketingBundleShell.includes(`content="${marketingBundleDescHtml}"`) &&
  marketingBundleShell.includes(`content="${canonicalUrl(MARKETING_BUNDLE_PATH)}"`)
) {
  pass("Marketing Bundle initial HTML OG title, description, and URL match Helmet");
} else fail("Marketing Bundle initial HTML missing OG title, description, or URL");
if (
  marketingBundleShell.includes(`content="${marketingBundleOgImageHtml}"`) &&
  marketingBundleShell.includes('content="summary_large_image"')
) {
  pass("Marketing Bundle initial HTML OG image and Twitter card match");
} else fail("Marketing Bundle initial HTML missing OG image or Twitter card value");
if (
  marketingBundleShell.includes('name="twitter:image"') &&
  (marketingBundleShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (marketingBundleShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("Marketing Bundle initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("Marketing Bundle initial HTML OG/Twitter tags are missing or duplicated");
if ((marketingBundleShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("Marketing Bundle initial HTML uses data-rh on first-byte SEO tags");
} else fail("Marketing Bundle initial HTML data-rh count is not 12");
if (documentLinkHeader(MARKETING_BUNDLE_PATH) === `<${canonicalUrl(MARKETING_BUNDLE_PATH)}>; rel="canonical"`) {
  pass("Marketing Bundle Link header is self-canonical");
} else fail("Marketing Bundle Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", DEVELOPMENT_BUNDLE_PATH).includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change Development Bundle");
} else fail("Marketing Bundle metadata leaked onto Development Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", AI_BUNDLE_PATH).includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change AI Bundle");
} else fail("Marketing Bundle metadata leaked onto AI Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", ANALYTICS_BUNDLE_PATH).includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change Analytics Bundle");
} else fail("Marketing Bundle metadata leaked onto Analytics Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", SEO_COURSE_PATH).includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change SEO course");
} else fail("Marketing Bundle metadata leaked onto SEO course");
if (applyInitialHtmlSeo("<title>Home</title>", SEM_COURSE_PATH).includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change SEM course");
} else fail("Marketing Bundle metadata leaked onto SEM course");
if (applyInitialHtmlSeo("<title>Home</title>", SMM_COURSE_PATH).includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change SMM course");
} else fail("Marketing Bundle metadata leaked onto SMM course");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change the homepage");
} else fail("Marketing Bundle metadata leaked onto the homepage");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change /Internships");
} else fail("Marketing Bundle metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships/marketing").includes(MARKETING_BUNDLE_SEO.title) === false) {
  pass("Marketing Bundle HTML SEO injection does not change /Internships/marketing");
} else fail("Marketing Bundle metadata leaked onto /Internships/marketing");
if (MARKETING_BUNDLE_SEO.productName === "Advanced Digital Marketing Bundle") {
  pass("Marketing Bundle productName remains Advanced Digital Marketing Bundle");
} else fail("Marketing Bundle productName changed");
if (MARKETING_BUNDLE_SEO.h1 === "Advanced Digital Marketing Bundle – SEO, SEM, SMM, SMO, Search Console and AI Marketing Training") {
  pass("Marketing Bundle H1 is the approved training heading");
} else fail("Marketing Bundle H1 is not the approved heading");
if (MARKETING_BUNDLE_SEO.title === "Digital Marketing Course Bundle | SEO, SEM & SMM | KYK") {
  pass("Marketing Bundle title remains the approved Helmet title");
} else fail("Marketing Bundle title changed");
if (
  MARKETING_BUNDLE_SEO.ogImage === "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80" &&
  MARKETING_BUNDLE_SEO.ogImage !== DEVELOPMENT_BUNDLE_SEO.ogImage &&
  MARKETING_BUNDLE_SEO.ogImage !== AI_BUNDLE_SEO.ogImage &&
  MARKETING_BUNDLE_SEO.ogImage !== ANALYTICS_BUNDLE_SEO.ogImage
) {
  pass("Marketing Bundle OG image is the existing SEO course cover image");
} else fail("Marketing Bundle OG image is not the verified cover image");
if (
  MARKETING_BUNDLE_SEO.title !== DEVELOPMENT_BUNDLE_SEO.title &&
  MARKETING_BUNDLE_SEO.description !== DEVELOPMENT_BUNDLE_SEO.description &&
  MARKETING_BUNDLE_SEO.title !== AI_BUNDLE_SEO.title &&
  MARKETING_BUNDLE_SEO.description !== AI_BUNDLE_SEO.description &&
  MARKETING_BUNDLE_SEO.title !== ANALYTICS_BUNDLE_SEO.title &&
  MARKETING_BUNDLE_SEO.description !== ANALYTICS_BUNDLE_SEO.description
) {
  pass("Marketing Bundle title and description are isolated from Development, AI, and Analytics Bundles");
} else fail("Marketing Bundle metadata collided with another bundle");

const developmentInternTitleHtml = DEVELOPMENT_INTERNSHIP_SEO.title.replace(/&/g, "&amp;");
const developmentInternDescHtml = DEVELOPMENT_INTERNSHIP_SEO.description.replace(/&/g, "&amp;");
const developmentInternOgImageHtml = DEVELOPMENT_INTERNSHIP_SEO.ogImage.replace(/&/g, "&amp;");
const developmentInternShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  DEVELOPMENT_INTERNSHIP_PATH
);
if (developmentInternShell.includes(developmentInternTitleHtml)) pass("Initial HTML title for Development Internship");
else fail("Initial HTML missing Development Internship title");
if (developmentInternShell.includes(developmentInternDescHtml)) pass("Initial HTML description for Development Internship");
else fail("Initial HTML missing Development Internship description");
if ((developmentInternShell.match(/rel="canonical"/g) || []).length === 1) pass("Development Internship initial HTML has exactly one canonical");
else fail("Development Internship initial HTML canonical count is not 1");
if (developmentInternShell.includes(`href="${canonicalUrl(DEVELOPMENT_INTERNSHIP_PATH)}"`)) {
  pass("Development Internship initial HTML canonical is the internship URL");
} else fail("Development Internship initial HTML canonical is not the internship URL");
if (developmentInternShell.includes('content="index, follow"')) pass("Development Internship initial HTML robots is index, follow");
else fail("Development Internship initial HTML missing index, follow");
if (developmentInternShell.includes('property="og:title"') && developmentInternShell.includes('name="twitter:card"')) {
  pass("Development Internship initial HTML includes OG and Twitter tags");
} else fail("Development Internship initial HTML missing OG or Twitter tags");
if (
  developmentInternShell.includes(`property="og:title"`) &&
  developmentInternShell.includes(`content="${developmentInternTitleHtml}"`) &&
  developmentInternShell.includes(`property="og:description"`) &&
  developmentInternShell.includes(`content="${developmentInternDescHtml}"`) &&
  developmentInternShell.includes(`property="og:url"`) &&
  developmentInternShell.includes(`content="${canonicalUrl(DEVELOPMENT_INTERNSHIP_PATH)}"`)
) {
  pass("Development Internship initial HTML OG title, description, and URL match Helmet");
} else fail("Development Internship initial HTML missing OG title, description, or URL");
if (
  developmentInternShell.includes(`content="${developmentInternOgImageHtml}"`) &&
  developmentInternShell.includes('content="summary_large_image"')
) {
  pass("Development Internship initial HTML OG image and Twitter card match");
} else fail("Development Internship initial HTML missing OG image or Twitter card value");
if (
  developmentInternShell.includes('name="twitter:image"') &&
  (developmentInternShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (developmentInternShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("Development Internship initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("Development Internship initial HTML OG/Twitter tags are missing or duplicated");
if ((developmentInternShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("Development Internship initial HTML uses data-rh on first-byte SEO tags");
} else fail("Development Internship initial HTML data-rh count is not 12");
if (
  documentLinkHeader(DEVELOPMENT_INTERNSHIP_PATH) ===
  `<${canonicalUrl(DEVELOPMENT_INTERNSHIP_PATH)}>; rel="canonical"`
) {
  pass("Development Internship Link header is self-canonical");
} else fail("Development Internship Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships/ai").includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change /Internships/ai");
} else fail("Development Internship metadata leaked onto /Internships/ai");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships/analytics").includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change /Internships/analytics");
} else fail("Development Internship metadata leaked onto /Internships/analytics");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships/marketing").includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change /Internships/marketing");
} else fail("Development Internship metadata leaked onto /Internships/marketing");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change /Internships");
} else fail("Development Internship metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", DEVELOPMENT_BUNDLE_PATH).includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change Development Bundle");
} else fail("Development Internship metadata leaked onto Development Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", AI_BUNDLE_PATH).includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change AI Bundle");
} else fail("Development Internship metadata leaked onto AI Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", ANALYTICS_BUNDLE_PATH).includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change Analytics Bundle");
} else fail("Development Internship metadata leaked onto Analytics Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", MARKETING_BUNDLE_PATH).includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change Marketing Bundle");
} else fail("Development Internship metadata leaked onto Marketing Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", PYTHON_PROGRAMMING_COURSE_PATH).includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change Python Programming");
} else fail("Development Internship metadata leaked onto Python Programming");
if (applyInitialHtmlSeo("<title>Home</title>", MERN_STACK_COURSE_PATH).includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change MERN Stack Development");
} else fail("Development Internship metadata leaked onto MERN Stack Development");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change the homepage");
} else fail("Development Internship metadata leaked onto the homepage");
if (applyInitialHtmlSeo("<title>Home</title>", "/Blog/python-programming/videos").includes(DEVELOPMENT_INTERNSHIP_SEO.title) === false) {
  pass("Development Internship HTML SEO injection does not change Python /videos");
} else fail("Development Internship metadata leaked onto Python /videos");
if (DEVELOPMENT_INTERNSHIP_SEO.title === "Development Internship Program | Python & MERN | KYK") {
  pass("Development Internship title remains the approved Helmet title");
} else fail("Development Internship title changed");
if (
  DEVELOPMENT_INTERNSHIP_SEO.h1 ===
  "Development Internship – Python, MERN and Full-Stack Project Experience"
) {
  pass("Development Internship H1 is the approved internship heading");
} else fail("Development Internship H1 is not the approved heading");
if (
  DEVELOPMENT_INTERNSHIP_SEO.ogImage ===
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
) {
  pass("Development Internship OG image is the existing listing cover image");
} else fail("Development Internship OG image is not the verified listing cover");
if (
  DEVELOPMENT_INTERNSHIP_SEO.title !== DEVELOPMENT_BUNDLE_SEO.title &&
  DEVELOPMENT_INTERNSHIP_SEO.description !== DEVELOPMENT_BUNDLE_SEO.description &&
  DEVELOPMENT_INTERNSHIP_SEO.title !== MERN_STACK_COURSE_SEO.title &&
  DEVELOPMENT_INTERNSHIP_SEO.description !== MERN_STACK_COURSE_SEO.description &&
  DEVELOPMENT_INTERNSHIP_SEO.title !== PYTHON_PROGRAMMING_COURSE_SEO.title
) {
  pass("Development Internship title and description are isolated from Development Bundle, MERN, and Python");
} else fail("Development Internship metadata collided with a course or bundle");

const aiInternTitleHtml = AI_INTERNSHIP_SEO.title.replace(/&/g, "&amp;");
const aiInternDescHtml = AI_INTERNSHIP_SEO.description.replace(/&/g, "&amp;");
const aiInternOgImageHtml = AI_INTERNSHIP_SEO.ogImage.replace(/&/g, "&amp;");
const aiInternShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  AI_INTERNSHIP_PATH
);
if (aiInternShell.includes(aiInternTitleHtml)) pass("Initial HTML title for AI Internship");
else fail("Initial HTML missing AI Internship title");
if (aiInternShell.includes(aiInternDescHtml)) pass("Initial HTML description for AI Internship");
else fail("Initial HTML missing AI Internship description");
if ((aiInternShell.match(/rel="canonical"/g) || []).length === 1) pass("AI Internship initial HTML has exactly one canonical");
else fail("AI Internship initial HTML canonical count is not 1");
if (aiInternShell.includes(`href="${canonicalUrl(AI_INTERNSHIP_PATH)}"`)) {
  pass("AI Internship initial HTML canonical is the internship URL");
} else fail("AI Internship initial HTML canonical is not the internship URL");
if (aiInternShell.includes('content="index, follow"')) pass("AI Internship initial HTML robots is index, follow");
else fail("AI Internship initial HTML missing index, follow");
if (aiInternShell.includes('property="og:title"') && aiInternShell.includes('name="twitter:card"')) {
  pass("AI Internship initial HTML includes OG and Twitter tags");
} else fail("AI Internship initial HTML missing OG or Twitter tags");
if (
  aiInternShell.includes(`property="og:title"`) &&
  aiInternShell.includes(`content="${aiInternTitleHtml}"`) &&
  aiInternShell.includes(`property="og:description"`) &&
  aiInternShell.includes(`content="${aiInternDescHtml}"`) &&
  aiInternShell.includes(`property="og:url"`) &&
  aiInternShell.includes(`content="${canonicalUrl(AI_INTERNSHIP_PATH)}"`)
) {
  pass("AI Internship initial HTML OG title, description, and URL match Helmet");
} else fail("AI Internship initial HTML missing OG title, description, or URL");
if (
  aiInternShell.includes(`content="${aiInternOgImageHtml}"`) &&
  aiInternShell.includes('content="summary_large_image"')
) {
  pass("AI Internship initial HTML OG image and Twitter card match");
} else fail("AI Internship initial HTML missing OG image or Twitter card value");
if (
  aiInternShell.includes('name="twitter:image"') &&
  (aiInternShell.match(/content="summary_large_image"/g) || []).length === 1 &&
  (aiInternShell.match(/property="og:image"/g) || []).length === 1
) {
  pass("AI Internship initial HTML has one OG image, Twitter card, and Twitter image");
} else fail("AI Internship initial HTML OG/Twitter tags are missing or duplicated");
if ((aiInternShell.match(/data-rh="true"/g) || []).length === 12) {
  pass("AI Internship initial HTML uses data-rh on first-byte SEO tags");
} else fail("AI Internship initial HTML data-rh count is not 12");
if (
  documentLinkHeader(AI_INTERNSHIP_PATH) ===
  `<${canonicalUrl(AI_INTERNSHIP_PATH)}>; rel="canonical"`
) {
  pass("AI Internship Link header is self-canonical");
} else fail("AI Internship Link header incorrect");
if (applyInitialHtmlSeo("<title>Home</title>", DEVELOPMENT_INTERNSHIP_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change /Internships/development");
} else fail("AI Internship metadata leaked onto /Internships/development");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships/analytics").includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change /Internships/analytics");
} else fail("AI Internship metadata leaked onto /Internships/analytics");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships/marketing").includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change /Internships/marketing");
} else fail("AI Internship metadata leaked onto /Internships/marketing");
if (applyInitialHtmlSeo("<title>Home</title>", "/Internships").includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change /Internships");
} else fail("AI Internship metadata leaked onto /Internships");
if (applyInitialHtmlSeo("<title>Home</title>", AI_BUNDLE_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change AI Bundle");
} else fail("AI Internship metadata leaked onto AI Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", DEVELOPMENT_BUNDLE_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change Development Bundle");
} else fail("AI Internship metadata leaked onto Development Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", ANALYTICS_BUNDLE_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change Analytics Bundle");
} else fail("AI Internship metadata leaked onto Analytics Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", MARKETING_BUNDLE_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change Marketing Bundle");
} else fail("AI Internship metadata leaked onto Marketing Bundle");
if (applyInitialHtmlSeo("<title>Home</title>", AI_FUNDAMENTALS_COURSE_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change AI Fundamentals");
} else fail("AI Internship metadata leaked onto AI Fundamentals");
if (applyInitialHtmlSeo("<title>Home</title>", PROMPT_ENGINEERING_COURSE_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change Prompt Engineering");
} else fail("AI Internship metadata leaked onto Prompt Engineering");
if (applyInitialHtmlSeo("<title>Home</title>", AI_PRODUCTIVITY_COURSE_PATH).includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change AI Tools for Productivity");
} else fail("AI Internship metadata leaked onto AI Tools for Productivity");
if (applyInitialHtmlSeo("<title>Home</title>", "/").includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change the homepage");
} else fail("AI Internship metadata leaked onto the homepage");
if (applyInitialHtmlSeo("<title>Home</title>", "/Blog/prompt-engineering/videos").includes(AI_INTERNSHIP_SEO.title) === false) {
  pass("AI Internship HTML SEO injection does not change Prompt Engineering /videos");
} else fail("AI Internship metadata leaked onto Prompt Engineering /videos");
if (AI_INTERNSHIP_SEO.title === "AI & Prompt Engineering Internship | ChatGPT & LLMs | KYK") {
  pass("AI Internship title remains the approved Helmet title");
} else fail("AI Internship title changed");
if (
  AI_INTERNSHIP_SEO.h1 ===
  "AI & Prompt Engineering Internship – ChatGPT, Claude and LLM Workflow Experience"
) {
  pass("AI Internship H1 is the approved internship heading");
} else fail("AI Internship H1 is not the approved heading");
if (
  AI_INTERNSHIP_SEO.ogImage ===
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80"
) {
  pass("AI Internship OG image is the existing listing cover image");
} else fail("AI Internship OG image is not the verified listing cover");
if (
  AI_INTERNSHIP_SEO.title !== DEVELOPMENT_INTERNSHIP_SEO.title &&
  AI_INTERNSHIP_SEO.description !== DEVELOPMENT_INTERNSHIP_SEO.description &&
  AI_INTERNSHIP_SEO.title !== AI_BUNDLE_SEO.title &&
  AI_INTERNSHIP_SEO.description !== AI_BUNDLE_SEO.description &&
  AI_INTERNSHIP_SEO.title !== PROMPT_ENGINEERING_COURSE_SEO.title &&
  AI_INTERNSHIP_SEO.title !== AI_FUNDAMENTALS_COURSE_SEO.title
) {
  pass("AI Internship title and description are isolated from Development Internship, AI Bundle, and AI courses");
} else fail("AI Internship metadata collided with another internship, bundle, or course");
if (applyInitialHtmlSeo("<title>Home</title>", DEVELOPMENT_INTERNSHIP_PATH).includes(developmentInternTitleHtml)) {
  pass("Development Internship first-byte mapping remains after AI Internship work");
} else fail("Development Internship first-byte mapping was broken by AI Internship work");

const smmCopy = fs.readFileSync(path.join(root, "src/data/coursePageCopy.js"), "utf8");
if (smmCopy.includes('q: "Which platforms are named?"') && smmCopy.includes('q: "What do students learn in the Social Media Marketing Course?"')) {
  pass("SMM FAQs retain original questions and add the course-learning FAQ");
} else fail("SMM FAQ set missing original or new question");
if (smmCopy.includes('to: "/Courses"') && smmCopy.includes('to: "/Bundles/marketing"')) {
  pass("SMM copy includes Courses and marketing bundle links");
} else fail("SMM copy missing Courses or bundle link");

const blogPostSrc = fs.readFileSync(path.join(root, "src/pages/BlogPost.jsx"), "utf8");
if (
  blogPostSrc.includes("pageHeading") &&
  blogPostSrc.includes("smm-social-media-marketing") &&
  blogPostSrc.includes("seo-search-engine-optimization") &&
  blogPostSrc.includes("sem-search-engine-marketing") &&
  blogPostSrc.includes("smo-social-media-optimization") &&
  blogPostSrc.includes("google-webmaster-search-console") &&
  blogPostSrc.includes("ai-tools-in-digital-marketing") &&
  blogPostSrc.includes("8-best-ai-tools-for-productivity") &&
  blogPostSrc.includes("prompt-engineering") &&
  blogPostSrc.includes("artificial-intelligence-fundamentals") &&
  blogPostSrc.includes("python-programming") &&
  blogPostSrc.includes("data-science") &&
  blogPostSrc.includes("mern-stack-development") &&
  blogPostSrc.includes("jira-for-project-management") &&
  blogPostSrc.includes("sql-for-data-analysis") &&
  blogPostSrc.includes("power-bi-dashboarding") &&
  blogPostSrc.includes("tableau-visualization") &&
  blogPostSrc.includes("python-for-analytics") &&
  blogPostSrc.includes('titleAs=')
) {
  pass("SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN Stack Development, Jira for Project Management, SQL for Data Analysis, Power BI Dashboarding, Tableau Visualization, and Python for Analytics course pages use SEO H1 and demote the enroll card heading");
} else fail("SMM/SEO/SEM/SMO/GSC/AI marketing/AI productivity/Prompt Engineering/AI Fundamentals/Python Programming/Data Science/MERN/Jira/SQL/Power BI/Tableau/Python for Analytics H1/hero heading wiring missing");
if (
  smmCopy.includes('q: "Is this the same as Google Ads?"') &&
  smmCopy.includes('q: "How long is the SEO course?"') &&
  smmCopy.includes('q: "Does it include Search Console?"') &&
  smmCopy.includes('q: "What tags are listed?"') &&
  smmCopy.includes('a: "30 hrs, Intermediate."') &&
  smmCopy.includes('to: "/Blog/sem-search-engine-marketing"') &&
  smmCopy.includes('to: "/Blog/google-webmaster-search-console"') &&
  smmCopy.includes('to: "/Blog/smo-social-media-optimization"')
) {
  pass("SEO course FAQs retain original answers and add contextual course links");
} else fail("SEO course FAQ set or track links missing");
if (
  smmCopy.includes('q: "Which ad platforms are named?"') &&
  smmCopy.includes('q: "How long is SEM?"') &&
  smmCopy.includes('q: "Is SEO included?"') &&
  smmCopy.includes('q: "Does it cover retargeting?"') &&
  smmCopy.includes('a: "25 hrs, Intermediate."') &&
  smmCopy.includes('a: "SEO is a separate organic course. SEM is paid search: setup, bidding, copy, landing pages, and ROI."') &&
  smmCopy.includes('to: "/Blog/seo-search-engine-optimization"') &&
  smmCopy.includes('to: "/Blog/smo-social-media-optimization"')
) {
  pass("SEM course FAQs retain original answers and add contextual course links");
} else fail("SEM course FAQ set or track links missing");
if (
  smmCopy.includes('q: "How long is SMO?"') &&
  smmCopy.includes('q: "Does this include Instagram ads?"') &&
  smmCopy.includes('q: "Which platforms are named?"') &&
  smmCopy.includes('a: "15 hrs, Beginner."') &&
  smmCopy.includes('a: "Paid social sits in SMM. SMO is organic: profiles, hashtags, engagement, community, and analytics."') &&
  smmCopy.includes('a: "This course page does not name specific networks in the catalog the way SMM names Instagram, LinkedIn, X, and YouTube. Tactics apply to the profiles you already run."') &&
  smmCopy.includes('to: "/Blog/smm-social-media-marketing"')
) {
  pass("SMO course FAQs retain original answers and add contextual course links");
} else fail("SMO course FAQ set or track links missing");
if (
  smmCopy.includes('q: "Is this the full SEO course?"') &&
  smmCopy.includes('q: "How long is it?"') &&
  smmCopy.includes('q: "What tags are listed?"') &&
  smmCopy.includes('q: "Do I need a website?"') &&
  smmCopy.includes('a: "10 hrs, Beginner."') &&
  smmCopy.includes('a: "No. SEO — Search Engine Optimization covers fundamentals, keywords, on-page, technical SEO, and links. This course is Search Console, coverage, Core Web Vitals, sitemaps, and robots."') &&
  smmCopy.includes('a: "Search Console is tied to a property you verify. The course teaches GSC; it does not replace hosting or a CMS."') &&
  smmCopy.includes('to: "/Blog/seo-search-engine-optimization"') &&
  smmCopy.includes('to: "/Blog/sem-search-engine-marketing"')
) {
  pass("GSC course FAQs retain original answers and add contextual course links");
} else fail("GSC course FAQ set or track links missing");
if (
  smmCopy.includes('q: "Which tools are named?"') &&
  smmCopy.includes('q: "How long is the course?"') &&
  smmCopy.includes('q: "Is this the same as 8 Best AI Tools for Productivity?"') &&
  smmCopy.includes('q: "Does it replace the SEO course?"') &&
  smmCopy.includes('a: "18 hrs, Intermediate."') &&
  smmCopy.includes('a: "Jasper, Surfer SEO, Canva AI, and ChatGPT, in both the description and tags."') &&
  smmCopy.includes('a: "No. SEO remains the organic search course. This course adds AI SEO tools as one of five topics."') &&
  smmCopy.includes('to: "/Blog/8-best-ai-tools-for-productivity"') &&
  smmCopy.includes('to: "/Blog/smm-social-media-marketing"')
) {
  pass("AI marketing course FAQs retain original answers and add contextual course links");
} else fail("AI marketing course FAQ set or track links missing");
if (
  smmCopy.includes('q: "Which tools are named on the course?"') &&
  smmCopy.includes('q: "How long is it?"') &&
  smmCopy.includes('q: "Does this replace Prompt Engineering?"') &&
  smmCopy.includes('q: "Is coding required?"') &&
  smmCopy.includes('q: "Can I buy it in a pack?"') &&
  smmCopy.includes('a: "12 hrs, Beginner level."') &&
  smmCopy.includes('a: "The description lists Notion AI, Midjourney, Runway, Perplexity, and more. Tags highlight Midjourney, Runway, Notion AI, and Perplexity. The course does not list a full set of eight brand names in the catalog."') &&
  smmCopy.includes('a: "No. Prompt Engineering teaches prompt techniques for ChatGPT, Claude, and Gemini. This course is about productivity tools across writing, media, coding, and automation."') &&
  smmCopy.includes('to: "/Blog/prompt-engineering"') &&
  smmCopy.includes('to: "/Blog/artificial-intelligence-fundamentals"') &&
  smmCopy.includes('to: "/Blog/ai-tools-in-digital-marketing"') &&
  smmCopy.includes('to: "/Bundles/ai"')
) {
  pass("AI productivity course FAQs retain original answers and add contextual course links");
} else fail("AI productivity course FAQ set or track links missing");
if (
  smmCopy.includes('q: "Which AI products does the course name?"') &&
  smmCopy.includes('q: "How long is Prompt Engineering?"') &&
  smmCopy.includes('q: "Is this the AI Fundamentals course?"') &&
  smmCopy.includes('q: "Do I need to train a model?"') &&
  smmCopy.includes('q: "Is it in a bundle?"') &&
  smmCopy.includes('a: "15 hrs, listed as Beginner."') &&
  smmCopy.includes('a: "ChatGPT, Claude, and Gemini, as listed in the course description and tags."') &&
  smmCopy.includes('a: "No. Fundamentals covers AI, ML, neural networks, and NLP. Prompt Engineering is about prompt design and AI tools."') &&
  smmCopy.includes('to: "/Blog/artificial-intelligence-fundamentals"') &&
  smmCopy.includes('to: "/Blog/8-best-ai-tools-for-productivity"') &&
  smmCopy.includes('to: "/Blog/ai-tools-in-digital-marketing"') &&
  smmCopy.includes('to: "/Bundles/ai"')
) {
  pass("Prompt Engineering course FAQs retain original answers and add contextual course links");
} else fail("Prompt Engineering course FAQ set or track links missing");
if (
  smmCopy.includes('q: "Is this course for beginners?"') &&
  smmCopy.includes('q: "Does it teach ChatGPT prompting?"') &&
  smmCopy.includes('q: "What tags are listed?"') &&
  smmCopy.includes('q: "Can I take it with the other AI courses?"') &&
  smmCopy.includes('q: "Are there videos?"') &&
  smmCopy.includes('a: "Yes. KYK lists Artificial Intelligence Fundamentals as Beginner level, 35 hrs."') &&
  smmCopy.includes('a: "Prompt design for ChatGPT, Claude, and Gemini is a separate course: Prompt Engineering. This course focuses on AI, ML, neural networks, NLP, and use cases."') &&
  smmCopy.includes('a: "The course enrol card lists five topics and twenty videos."') &&
  smmCopy.includes('relatedSlugs: ["prompt-engineering", "8-best-ai-tools-for-productivity", "python-programming"]') &&
  smmCopy.includes('to: "/Blog/prompt-engineering"') &&
  smmCopy.includes('to: "/Blog/8-best-ai-tools-for-productivity"') &&
  smmCopy.includes('to: "/Blog/ai-tools-in-digital-marketing"') &&
  smmCopy.includes('to: "/Bundles/ai"')
) {
  pass("AI Fundamentals course FAQs retain original answers, Python related card, and contextual course links");
} else fail("AI Fundamentals course FAQ set, Python related card, or track links missing");
if (
  smmCopy.includes('q: "Is this Python course suitable for beginners?"') &&
  smmCopy.includes('q: "How long is the Python Programming course?"') &&
  smmCopy.includes('q: "What will I actually practise?"') &&
  smmCopy.includes('q: "Does this include Data Science or MERN?"') &&
  smmCopy.includes('q: "Are there course videos?"') &&
  smmCopy.includes('a: "The course duration listed on KYK is 40 hrs."') &&
  smmCopy.includes('a: "KYK lists five topics and twenty videos for this course. Enrol to unlock playback on the course videos page."') &&
  smmCopy.includes('relatedSlugs: ["data-science", "mern-stack-development", "python-for-analytics"]') &&
  smmCopy.includes('to: "/Blog/data-science"') &&
  smmCopy.includes('to: "/Blog/mern-stack-development"') &&
  smmCopy.includes('to: "/Blog/python-for-analytics"') &&
  smmCopy.includes('to: "/Bundles/development"')
) {
  pass("Python Programming course FAQs retain original answers, Development related cards, and contextual course links");
} else fail("Python Programming course FAQ set, related cards, or track links missing");
if (
  smmCopy.includes('q: "What level is Data Science at KYK?"') &&
  smmCopy.includes('q: "How long is the course?"') &&
  smmCopy.includes('q: "Which tools are included?"') &&
  smmCopy.includes('q: "Is this the same as Python for Analytics?"') &&
  smmCopy.includes('q: "Can I buy it with Python and MERN?"') &&
  smmCopy.includes('a: "The listed duration is 55 hrs."') &&
  smmCopy.includes('a: "The catalog tags Pandas, NumPy, ML, and Matplotlib. The course description also names Python and Scikit-learn."') &&
  smmCopy.includes('relatedSlugs: ["python-programming", "python-for-analytics", "sql-for-data-analysis"]') &&
  smmCopy.includes("Python as a language is") &&
  smmCopy.includes('to: "/Blog/python-programming"') &&
  smmCopy.includes('to: "/Blog/python-for-analytics"') &&
  smmCopy.includes('to: "/Blog/mern-stack-development"') &&
  smmCopy.includes('to: "/Bundles/development"')
) {
  pass("Data Science course FAQs retain original answers, related cards, and contextual course links");
} else fail("Data Science course FAQ set, related cards, or track links missing");
if (
  smmCopy.includes('q: "Is MERN Stack Development a beginner course?"') &&
  smmCopy.includes('q: "Which technologies are used?"') &&
  smmCopy.includes('q: "Does the course include authentication?"') &&
  smmCopy.includes('q: "Do I need the Python course first?"') &&
  smmCopy.includes('q: "Are videos included?"') &&
  smmCopy.includes('a: "No. KYK lists it as Advanced, with 70 hrs covering React, Node & Express, MongoDB CRUD, Auth & JWT, and a full-stack project."') &&
  smmCopy.includes('a: "KYK lists five topics and twenty videos for this course on the enrol card."') &&
  smmCopy.includes('relatedSlugs: ["python-programming", "data-science", "jira-for-project-management"]') &&
  smmCopy.includes("The Python language sits on") &&
  smmCopy.includes('to: "/Blog/python-programming"') &&
  smmCopy.includes('to: "/Blog/data-science"') &&
  smmCopy.includes('to: "/Bundles/development"')
) {
  pass("MERN Stack Development course FAQs retain original answers, related cards, and contextual course links");
} else fail("MERN Stack Development course FAQ set, related cards, or track links missing");
if (
  smmCopy.includes('q: "Which tools are listed?"') &&
  smmCopy.includes('q: "What projects are listed?"') &&
  smmCopy.includes('q: "How long is the course?"') &&
  smmCopy.includes('q: "Is this a coding course?"') &&
  smmCopy.includes('q: "Why is it in the Analytics bundle?"') &&
  smmCopy.includes('a: "Jira and Confluence."') &&
  smmCopy.includes('a: "Sprint Board Setup and Release Tracker."') &&
  smmCopy.includes('a: "10 hrs, Beginner."') &&
  smmCopy.includes('a: "No. The five topics are Jira basics, Scrum & Kanban, backlogs & sprints, reporting, and team workflow."') &&
  smmCopy.includes('relatedSlugs: ["sql-for-data-analysis", "power-bi-dashboarding", "mern-stack-development"]') &&
  smmCopy.includes('to: "/Blog/python-for-analytics"') &&
  smmCopy.includes('to: "/Blog/tableau-visualization"') &&
  smmCopy.includes('to: "/Bundles/analytics"')
) {
  pass("Jira for Project Management course FAQs retain original answers, related cards, and contextual course links");
} else fail("Jira for Project Management course FAQ set, related cards, or track links missing");
if (
  smmCopy.includes('q: "Which databases does the course list?"') &&
  smmCopy.includes('q: "What projects are listed?"') &&
  smmCopy.includes('q: "How long is SQL for Data Analysis?"') &&
  smmCopy.includes('q: "Is this Power BI?"') &&
  smmCopy.includes('q: "Is it in a bundle?"') &&
  smmCopy.includes('a: "MySQL and PostgreSQL, in the course tools list."') &&
  smmCopy.includes('a: "Sales Dashboard and Customer Segmentation."') &&
  smmCopy.includes('a: "25 hrs, Beginner level."') &&
  smmCopy.includes('a: "No. Power BI Dashboarding is a separate Business Analytics course. SQL is the query foundation many dashboards use."') &&
  smmCopy.includes('relatedSlugs: ["python-for-analytics", "power-bi-dashboarding", "tableau-visualization"]') &&
  smmCopy.includes('to: "/Blog/python-for-analytics"') &&
  smmCopy.includes('to: "/Blog/tableau-visualization"') &&
  smmCopy.includes('to: "/Bundles/analytics"')
) {
  pass("SQL for Data Analysis course FAQs retain original answers, related cards, and contextual course links");
} else fail("SQL for Data Analysis course FAQ set, related cards, or track links missing");
if (
  smmCopy.includes('q: "Which tools are listed?"') &&
  smmCopy.includes('q: "What projects are listed?"') &&
  smmCopy.includes('q: "How long is the course?"') &&
  smmCopy.includes('q: "Is Tableau included?"') &&
  smmCopy.includes('q: "Are there videos?"') &&
  smmCopy.includes('a: "Power BI, DAX, and Power Query."') &&
  smmCopy.includes('a: "Sales Report and HR Analytics."') &&
  smmCopy.includes('a: "28 hrs, Intermediate."') &&
  smmCopy.includes('a: "Tableau Visualization is a separate course on the same Business Analytics track. You can take both, or the analytics bundle that includes them."') &&
  smmCopy.includes('a: "The enrol card lists five topics and twenty videos."') &&
  smmCopy.includes('introHeading: "Power BI Training covering DAX, Data Modelling and Live Dashboards"') &&
  smmCopy.includes('relatedSlugs: ["tableau-visualization", "sql-for-data-analysis", "python-for-analytics"]') &&
  smmCopy.includes('to: "/Blog/tableau-visualization"') &&
  smmCopy.includes('to: "/Blog/sql-for-data-analysis"') &&
  smmCopy.includes('to: "/Courses"') &&
  smmCopy.includes('to: "/Bundles/analytics"')
) {
  pass("Power BI Dashboarding course FAQs retain original answers, related cards, and contextual course links");
} else fail("Power BI Dashboarding course FAQ set, related cards, or track links missing");
if (
  smmCopy.includes('q: "Which tools are listed?"') &&
  smmCopy.includes('q: "What projects are listed?"') &&
  smmCopy.includes('q: "What is the level and duration?"') &&
  smmCopy.includes('q: "Should I take Power BI or Tableau?"') &&
  smmCopy.includes('q: "Is SQL required first?"') &&
  smmCopy.includes('a: "Tableau and Tableau Prep."') &&
  smmCopy.includes('a: "Market Trend Map and Financial Dashboard."') &&
  smmCopy.includes('a: "Intermediate, 22 hrs."') &&
  smmCopy.includes('a: "They are separate KYK courses. Many teams use one or the other. The Business Analytics bundle includes both."') &&
  smmCopy.includes('a: "SQL for Data Analysis is a separate beginner course on the same track. It is useful but not listed as a formal prerequisite on this page."') &&
  smmCopy.includes('introHeading: "Tableau Training covering Calculated Fields, Data Blending and Storytelling"') &&
  smmCopy.includes('relatedSlugs: ["power-bi-dashboarding", "sql-for-data-analysis", "python-for-analytics"]') &&
  smmCopy.includes('to: "/Blog/power-bi-dashboarding"') &&
  smmCopy.includes('to: "/Blog/sql-for-data-analysis"') &&
  smmCopy.includes('to: "/Courses"') &&
  smmCopy.includes('to: "/Bundles/analytics"')
) {
  pass("Tableau Visualization course FAQs retain original answers, related cards, and contextual course links");
} else fail("Tableau Visualization course FAQ set, related cards, or track links missing");
if (
  smmCopy.includes('q: "How is this different from Data Science?"') &&
  smmCopy.includes('q: "Which tools are listed?"') &&
  smmCopy.includes('q: "What projects are listed?"') &&
  smmCopy.includes('q: "What is the level and duration?"') &&
  smmCopy.includes('q: "Can I take it with SQL and Power BI?"') &&
  smmCopy.includes('a: "Python for Analytics is on the Business Analytics track (cleaning, visualisation, reporting, business project). Data Science is on the Development track and includes ML models, feature engineering, and deployment."') &&
  smmCopy.includes('a: "Python, Pandas, and Seaborn."') &&
  smmCopy.includes('a: "Revenue Analysis and KPI Dashboard."') &&
  smmCopy.includes('a: "Intermediate, 30 hrs."') &&
  smmCopy.includes('a: "Yes. All three are in the Business Analytics bundle, along with Tableau and Jira."') &&
  smmCopy.includes('introHeading: "Python Analytics Training covering Pandas, Seaborn and Reporting Automation"') &&
  smmCopy.includes('relatedSlugs: ["sql-for-data-analysis", "data-science", "power-bi-dashboarding"]') &&
  smmCopy.includes('to: "/Blog/sql-for-data-analysis"') &&
  smmCopy.includes('to: "/Blog/python-programming"') &&
  smmCopy.includes('to: "/Courses"') &&
  smmCopy.includes('to: "/Bundles/analytics"')
) {
  pass("Python for Analytics course FAQs retain original answers, related cards, and contextual course links");
} else fail("Python for Analytics course FAQ set, related cards, or track links missing");
if (blogPostSrc.includes("payWithCashfree") === false && blogPostSrc.includes("enrollThisCourse") && blogPostSrc.includes("addGuideToCart")) {
  pass("BlogPost enroll and internship cart handlers still present");
} else fail("BlogPost enrollment handlers changed unexpectedly");

const heroSrc = fs.readFileSync(path.join(root, "src/components/blog/BlogCourseHeroCard.jsx"), "utf8");
if (heroSrc.includes("Enroll now") && heroSrc.includes("/videos")) {
  pass("Course hero still has Enroll now and Course videos");
} else fail("Course hero lost enroll or videos CTA");

const jsonLdSrc = fs.readFileSync(path.join(root, "src/config/jsonLd.js"), "utf8");
if (jsonLdSrc.includes("FAQPage") && jsonLdSrc.includes("valueAddedTaxIncluded: false") && !jsonLdSrc.includes("aggregateRating")) {
  pass("Course schema extras add FAQPage and GST-exclusive offer without aggregateRating");
} else fail("JSON-LD extras missing or ratings added");
if (
  jsonLdSrc.includes('instructor === "Emily Ross"') &&
  jsonLdSrc.includes('instructor === "Jasmine Patel"') &&
  jsonLdSrc.includes('instructor === "Paul Martinez"') &&
  jsonLdSrc.includes('instructor === "Kevin Wu"') &&
  jsonLdSrc.includes("google-webmaster-search-console") &&
  jsonLdSrc.includes('instructor === "Lisa Monroe"') &&
  jsonLdSrc.includes('instructor === "Tom Watts"') &&
  jsonLdSrc.includes("prompt-engineering") &&
  jsonLdSrc.includes('instructor === "Dr. Meera Singh"') &&
  jsonLdSrc.includes("artificial-intelligence-fundamentals") &&
  jsonLdSrc.includes('instructor === "Alex Chen"') &&
  jsonLdSrc.includes("python-programming") &&
  jsonLdSrc.includes('instructor === "Sarah Patel"') &&
  jsonLdSrc.includes("data-science") &&
  jsonLdSrc.includes('instructor === "James Rivera"') &&
  jsonLdSrc.includes("mern-stack-development") &&
  jsonLdSrc.includes('instructor === "Chris Taylor"') &&
  jsonLdSrc.includes("jira-for-project-management") &&
  jsonLdSrc.includes('instructor === "Nina Brooks"') &&
  jsonLdSrc.includes("sql-for-data-analysis") &&
  jsonLdSrc.includes('instructor === "Rachel Kim"') &&
  jsonLdSrc.includes("power-bi-dashboarding") &&
  jsonLdSrc.includes('instructor === "David Lee"') &&
  jsonLdSrc.includes("tableau-visualization") &&
  jsonLdSrc.includes("python-for-analytics")
) {
  pass("JSON-LD instructor extras remain catalog-gated for SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN Stack Development, Jira for Project Management, SQL for Data Analysis, Power BI Dashboarding, Tableau Visualization, and Python for Analytics courses");
} else fail("JSON-LD instructor checks missing");
if ((jsonLdSrc.match(/slug === "power-bi-dashboarding"/g) || []).length === 2) {
  pass("Power BI JSON-LD extras and FAQPage are declared once each");
} else fail("Power BI JSON-LD slug handling is duplicated or missing");
if ((jsonLdSrc.match(/slug === "tableau-visualization"/g) || []).length === 2) {
  pass("Tableau JSON-LD extras and FAQPage are declared once each");
} else fail("Tableau JSON-LD slug handling is duplicated or missing");
if ((jsonLdSrc.match(/slug === "python-for-analytics"/g) || []).length === 2) {
  pass("Python for Analytics JSON-LD extras and FAQPage are declared once each");
} else fail("Python for Analytics JSON-LD slug handling is duplicated or missing");
if (
  /if \(slug === "python-for-analytics"\) \{[\s\S]*?extras\.educationalLevel = "Intermediate"[\s\S]*?graph\.push\(courseNode/.test(
    jsonLdSrc
  )
) {
  pass("Python for Analytics Course JSON-LD sets Intermediate educationalLevel on this slug only");
} else fail("Python for Analytics educationalLevel is missing or not slug-gated");
if ((jsonLdSrc.match(/slug === "python-programming"/g) || []).length === 2) {
  pass("Python Programming JSON-LD extras and FAQPage remain declared once each");
} else fail("Python Programming JSON-LD slug handling changed");
if ((jsonLdSrc.match(/slug === "data-science"/g) || []).length === 2) {
  pass("Data Science JSON-LD extras and FAQPage are declared once each");
} else fail("Data Science JSON-LD slug handling is duplicated or missing");
if ((jsonLdSrc.match(/slug === "artificial-intelligence-fundamentals"/g) || []).length === 2) {
  pass("AI Fundamentals JSON-LD extras and FAQPage are declared once each");
} else fail("AI Fundamentals JSON-LD slug handling is duplicated or missing");
if (
  jsonLdSrc.includes("BreadcrumbList") &&
  jsonLdSrc.includes('"@type": "Course"') &&
  jsonLdSrc.includes("FAQPage")
) {
  pass("JSON-LD still emits BreadcrumbList, Course, and FAQPage");
} else fail("JSON-LD lost BreadcrumbList, Course, or FAQPage");
if (
  /if \(slug === "artificial-intelligence-fundamentals"\) \{[\s\S]*?extras\.educationalLevel = "Beginner"[\s\S]*?if \(slug === "python-programming"\)/.test(
    jsonLdSrc
  )
) {
  pass("AI Fundamentals Course JSON-LD sets Beginner educationalLevel on this slug only");
} else fail("AI Fundamentals educationalLevel is missing or not slug-gated");
if (jsonLdSrc.includes('instructor === "Dr. Meera Singh"') === false) {
  fail("AI Fundamentals Dr. Meera Singh instructor gate missing");
} else pass("AI Fundamentals Dr. Meera Singh instructor gate remains catalog-gated");
if (
  /if \(slug === "data-science"\) \{[\s\S]*?extras\.educationalLevel = "Intermediate"[\s\S]*?if \(slug === "mern-stack-development"\)/.test(
    jsonLdSrc
  )
) {
  pass("Data Science Course JSON-LD sets Intermediate educationalLevel on this slug only");
} else fail("Data Science educationalLevel is missing or not slug-gated");
if (jsonLdSrc.includes('instructor === "Sarah Patel"') === false) {
  fail("Data Science Sarah Patel instructor gate missing");
} else pass("Data Science Sarah Patel instructor gate remains catalog-gated");
if (
  /if \(slug === "development" && offer\) \{[\s\S]*?"@type": "Product"[\s\S]*?price: String\(offer\.fee\)[\s\S]*?valueAddedTaxIncluded: false[\s\S]*?faqPageNode\(faqs, path\)/.test(
    jsonLdSrc
  )
) {
  pass("Development Bundle JSON-LD adds Product/Offer and FAQPage on this slug only");
} else fail("Development Bundle Product/Offer or FAQPage is missing or not slug-gated");
if (
  jsonLdSrc.includes('name: "Development Bundle"') &&
  jsonLdSrc.includes("BUNDLE_PAGE_COPY.development")
) {
  pass("Development Bundle Product name stays Development Bundle and FAQs come from bundle copy");
} else fail("Development Bundle Product name or FAQ source changed");
if (
  /if \(slug === "ai" && offer\) \{[\s\S]*?"@type": "Product"[\s\S]*?name: "AI & Prompt Engineering Bundle"[\s\S]*?price: String\(offer\.fee\)[\s\S]*?valueAddedTaxIncluded: false[\s\S]*?faqPageNode\(faqs, path\)/.test(
    jsonLdSrc
  )
) {
  pass("AI Bundle JSON-LD adds Product/Offer and FAQPage on this slug only");
} else fail("AI Bundle Product/Offer or FAQPage is missing or not slug-gated");
if (
  jsonLdSrc.includes('name: "AI & Prompt Engineering Bundle"') &&
  jsonLdSrc.includes("BUNDLE_PAGE_COPY.ai")
) {
  pass("AI Bundle Product name stays AI & Prompt Engineering Bundle and FAQs come from bundle copy");
} else fail("AI Bundle Product name or FAQ source changed");
if (
  /if \(slug === "development" && offer\) \{[\s\S]*?if \(slug === "ai" && offer\) \{/.test(jsonLdSrc)
) {
  pass("Development Bundle JSON-LD Product block remains separate from the AI Bundle block");
} else fail("Development and AI Bundle JSON-LD Product blocks were merged or reordered unsafely");
if (
  /if \(slug === "analytics" && offer\) \{[\s\S]*?"@type": "Product"[\s\S]*?name: "Business Analytics Bundle"[\s\S]*?price: String\(offer\.fee\)[\s\S]*?valueAddedTaxIncluded: false[\s\S]*?faqPageNode\(faqs, path\)/.test(
    jsonLdSrc
  )
) {
  pass("Analytics Bundle JSON-LD adds Product/Offer and FAQPage on this slug only");
} else fail("Analytics Bundle Product/Offer or FAQPage is missing or not slug-gated");
if (
  jsonLdSrc.includes('name: "Business Analytics Bundle"') &&
  jsonLdSrc.includes("BUNDLE_PAGE_COPY.analytics")
) {
  pass("Analytics Bundle Product name stays Business Analytics Bundle and FAQs come from bundle copy");
} else fail("Analytics Bundle Product name or FAQ source changed");
if (
  /slug === "analytics"[\s\S]*?offer\?\.pageTitle \|\| "Business Analytics Bundle"/.test(jsonLdSrc)
) {
  pass("Analytics Bundle breadcrumb and ItemList name stay pinned to Business Analytics Bundle");
} else fail("Analytics Bundle breadcrumb or ItemList name is not pinned to the catalog name");
if (
  /if \(slug === "ai" && offer\) \{[\s\S]*?if \(slug === "analytics" && offer\) \{/.test(jsonLdSrc)
) {
  pass("AI Bundle JSON-LD Product block remains separate from the Analytics Bundle block");
} else fail("AI and Analytics Bundle JSON-LD Product blocks were merged or reordered unsafely");
if (
  jsonLdSrc.includes('url: canonicalUrl(`/Blog/${course.slug}`)') &&
  jsonLdSrc.includes("name: course.title") &&
  jsonLdSrc.includes("numberOfItems: included.length")
) {
  pass("Bundle ItemList still lists included courses by catalog title and canonical course URL");
} else fail("Bundle ItemList course URLs or names changed");
if (!jsonLdSrc.includes("availability") && !jsonLdSrc.includes("AggregateRating") && !jsonLdSrc.includes('"Review"')) {
  pass("Analytics Bundle JSON-LD omits availability, AggregateRating, and Review");
} else fail("Bundle JSON-LD includes unsupported availability, rating, or review fields");
if (
  /if \(slug === "marketing" && offer\) \{[\s\S]*?"@type": "Product"[\s\S]*?name: "Advanced Digital Marketing Bundle"[\s\S]*?price: String\(offer\.fee\)[\s\S]*?valueAddedTaxIncluded: false[\s\S]*?faqPageNode\(faqs, path\)/.test(
    jsonLdSrc
  )
) {
  pass("Marketing Bundle JSON-LD adds Product/Offer and FAQPage on this slug only");
} else fail("Marketing Bundle Product/Offer or FAQPage is missing or not slug-gated");
if (
  jsonLdSrc.includes('name: "Advanced Digital Marketing Bundle"') &&
  jsonLdSrc.includes("BUNDLE_PAGE_COPY.marketing")
) {
  pass("Marketing Bundle Product name stays Advanced Digital Marketing Bundle and FAQs come from bundle copy");
} else fail("Marketing Bundle Product name or FAQ source changed");
if (
  /slug === "marketing"[\s\S]*?offer\?\.pageTitle \|\| "Advanced Digital Marketing Bundle"/.test(jsonLdSrc)
) {
  pass("Marketing Bundle breadcrumb and ItemList name stay pinned to Advanced Digital Marketing Bundle");
} else fail("Marketing Bundle breadcrumb or ItemList name is not pinned to the catalog name");
if (
  /if \(slug === "analytics" && offer\) \{[\s\S]*?if \(slug === "marketing" && offer\) \{/.test(jsonLdSrc)
) {
  pass("Analytics Bundle JSON-LD Product block remains separate from the Marketing Bundle block");
} else fail("Analytics and Marketing Bundle JSON-LD Product blocks were merged or reordered unsafely");
if (
  jsonLdSrc.includes("numberOfItems: included.length") &&
  jsonLdSrc.includes("offer?.titles?.includes(c.title)") &&
  jsonLdSrc.includes("name: course.title")
) {
  pass("Marketing Bundle ItemList still derives included courses from catalog order");
} else fail("Marketing Bundle ItemList course derivation changed");

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
if (pricing.includes("MARKETING_COURSE_FEE = 149")) pass("Marketing course fee still ₹149");
else fail("Marketing course fee changed");
if (pricing.includes("AI_COURSE_FEE = 199")) pass("AI course fee still ₹199");
else fail("AI course fee changed");
if (pricing.includes("DEVELOPMENT_COURSE_FEE = 299")) pass("Development course fee still ₹299");
else fail("Development course fee changed");
if (pricing.includes("GST_RATE = 0.18") || pricing.includes("GST_RATE = .18")) {
  pass("GST remains 18%");
} else fail("GST rate changed");

const developmentFaqQuestions = [
  "Which courses are in the Development bundle?",
  "How is ₹799/- cheaper than buying them one by one?",
  "Can I still buy only Python or only MERN?",
  "Is this the Development internship?",
  "How much course time is in the pack?",
  "Are there videos?",
];
const developmentFaqAnswers = [
  "Python Programming, Data Science, and MERN Stack Development — the three courses on the KYK Development track.",
  "Each of those courses is ₹299/- alone. Three separately is ₹897/-. The pack is ₹799/-, which is ₹98/- less. Prices on this page are the same catalog figures used at checkout.",
  "Yes. Each included course has its own page and an Add course button. The bundle is for people who want all three.",
  "No. This pack is three individual courses. The Development Internship is a separate program with its own fee and page.",
  "The catalog lists 40 hrs (Python), 55 hrs (Data Science), and 70 hrs (MERN) — 165 hrs of listed duration in total.",
  "Each of these courses shows five topics and twenty videos on its own enrol card. Enrolment is per course or via this bundle at checkout.",
];
const bundleCopySrc = fs.readFileSync(path.join(root, "src/data/bundlePageCopy.js"), "utf8");
if (bundleCopySrc.includes('introHeading: "Python, Data Science and MERN Stack in one Development pack"')) {
  pass("Development Bundle intro H2 copy is the approved heading");
} else fail("Development Bundle intro H2 copy is missing or changed");
if (developmentFaqQuestions.every((q) => bundleCopySrc.includes(`q: "${q}"`))) {
  pass("Development Bundle keeps all six original FAQ questions");
} else fail("Development Bundle FAQ questions changed");
if (developmentFaqAnswers.every((a) => bundleCopySrc.includes(`a: "${a}"`))) {
  pass("Development Bundle keeps all six original FAQ answers");
} else fail("Development Bundle FAQ answers changed");
if (
  bundleCopySrc.includes("The AI & Prompt Engineering bundle is KYK") &&
  bundleCopySrc.includes("The Business Analytics bundle is five KYK courses") &&
  bundleCopySrc.includes("The Advanced Digital Marketing bundle")
) {
  pass("AI, Analytics, and Marketing bundle copy remain unchanged");
} else fail("Another bundle's copy was changed by Development Bundle work");

if (bundleCopySrc.includes('introHeading: "AI Fundamentals, Prompt Engineering and productivity tools in one AI pack"')) {
  pass("AI Bundle intro H2 copy is the approved heading");
} else fail("AI Bundle intro H2 copy is missing or changed");
const aiFaqQuestions = [
  "What is inside the AI & Prompt Engineering bundle?",
  "How much do I save versus three separate courses?",
  "Does this teach me to train my own model?",
  "Which AI products are named?",
  "Is this the AI internship program?",
  "How long are the three courses together?",
];
const aiFaqAnswers = [
  "Artificial Intelligence Fundamentals, Prompt Engineering, and 8 Best AI Tools for Productivity.",
  "₹199/- × 3 = ₹597/- if bought alone. The pack is ₹499/-, which is ₹98/- less.",
  "No. Fundamentals explains AI, ML, neural networks, and NLP. Prompt Engineering and the tools course are about using existing products, not training models.",
  "Prompt Engineering names ChatGPT, Claude, and Gemini. The tools course names Notion AI, Midjourney, Runway, and Perplexity. Other brand names are not listed in the catalog.",
  "No. This is a course bundle. The AI & Prompt Engineering Internship is a separate 1–3 month program.",
  "Listed durations are 35 hrs, 15 hrs, and 12 hrs — 62 hrs in total.",
];
if (aiFaqQuestions.every((q) => bundleCopySrc.includes(`q: "${q}"`))) {
  pass("AI Bundle keeps all six original FAQ questions");
} else fail("AI Bundle FAQ questions changed");
if (aiFaqAnswers.every((a) => bundleCopySrc.includes(`a: "${a}"`))) {
  pass("AI Bundle keeps all six original FAQ answers");
} else fail("AI Bundle FAQ answers changed");
if (
  bundleCopySrc.includes('introHeading: "Python, Data Science and MERN Stack in one Development pack"') &&
  bundleCopySrc.includes("The Business Analytics bundle is five KYK courses") &&
  bundleCopySrc.includes("The Advanced Digital Marketing bundle")
) {
  pass("Development, Analytics, and Marketing bundle copy remain unchanged after AI Bundle work");
} else fail("Another bundle's copy was changed by AI Bundle work");
if (bundleCopySrc.includes('introHeading: "SQL, Python for Analytics, Power BI, Tableau and Jira in one Analytics pack"')) {
  pass("Analytics Bundle intro H2 copy is the approved heading");
} else fail("Analytics Bundle intro H2 copy is missing or changed");
const analyticsFaqQuestions = [
  "Which five courses are included?",
  "How does ₹899/- compare with buying them separately?",
  "Why are both Power BI and Tableau in the pack?",
  "What projects are listed on the included courses?",
  "Is this the Business Analytics internship?",
  "How much listed duration is in the pack?",
];
const analyticsFaqAnswers = [
  "SQL for Data Analysis, Python for Analytics, Power BI Dashboarding, Tableau Visualization, and Jira for Project Management.",
  "Each course is ₹199/-. Five separately is ₹995/-. The pack is ₹899/-, which is ₹96/- less.",
  "They are separate KYK courses on the same track. The bundle is for people who want both visualisation tools plus SQL, Python, and Jira.",
  "SQL: Sales Dashboard, Customer Segmentation. Python for Analytics: Revenue Analysis, KPI Dashboard. Power BI: Sales Report, HR Analytics. Tableau: Market Trend Map, Financial Dashboard. Jira: Sprint Board Setup, Release Tracker.",
  "No. This pack is five courses. The Business Analytics Internship is a separate program.",
  "25 + 30 + 28 + 22 + 10 hrs as listed on each course — 115 hrs in total.",
];
if (analyticsFaqQuestions.every((q) => bundleCopySrc.includes(`q: "${q}"`))) {
  pass("Analytics Bundle keeps all six original FAQ questions");
} else fail("Analytics Bundle FAQ questions changed");
if (analyticsFaqAnswers.every((a) => bundleCopySrc.includes(`a: "${a}"`))) {
  pass("Analytics Bundle keeps all six original FAQ answers");
} else fail("Analytics Bundle FAQ answers changed");
if (
  bundleCopySrc.includes("The Development bundle is the three-course KYK path") &&
  bundleCopySrc.includes("The AI & Prompt Engineering bundle is KYK") &&
  bundleCopySrc.includes("The Advanced Digital Marketing bundle")
) {
  pass("Development, AI, and Marketing bundle copy remain unchanged after Analytics Bundle work");
} else fail("Another bundle's copy was changed by Analytics Bundle work");
if (bundleCopySrc.includes('introHeading: "SEO, SEM, SMM, SMO, Search Console and AI marketing tools in one Marketing pack"')) {
  pass("Marketing Bundle intro H2 copy is the approved heading");
} else fail("Marketing Bundle intro H2 copy is missing or changed");
const marketingFaqQuestions = [
  "Which six courses are in the marketing bundle?",
  "How much do I save at ₹799/-?",
  "Is SEO the same as SEM in this pack?",
  "Which social platforms are named?",
  "Is this the Digital Marketing internship?",
  "How much listed duration is included?",
];
const marketingFaqAnswers = [
  "SEO — Search Engine Optimization, SEM — Search Engine Marketing, SMM — Social Media Marketing, SMO — Social Media Optimization, Google Webmaster & Search Console, and AI Tools in Digital Marketing.",
  "Each course is ₹149/-. Six separately is ₹894/-. The pack is ₹799/-, which is ₹95/- less.",
  "No. SEO is organic (keywords, on-page, technical SEO, links). SEM is paid search (Google Ads, Bing Ads, bidding, landing pages, ROI).",
  "SMM names Instagram, LinkedIn, X, and YouTube. SMO is about organic optimisation (profiles, hashtags, engagement) and does not list extra networks in the catalog.",
  "No. This is a six-course bundle. The Advanced Digital Marketing Internship is a separate program.",
  "30 + 25 + 28 + 15 + 10 + 18 hrs as listed on each course — 126 hrs in total.",
];
if (marketingFaqQuestions.every((q) => bundleCopySrc.includes(`q: "${q}"`))) {
  pass("Marketing Bundle keeps all six original FAQ questions");
} else fail("Marketing Bundle FAQ questions changed");
if (marketingFaqAnswers.every((a) => bundleCopySrc.includes(`a: "${a}"`))) {
  pass("Marketing Bundle keeps all six original FAQ answers");
} else fail("Marketing Bundle FAQ answers changed");
if (
  bundleCopySrc.includes("The Development bundle is the three-course KYK path") &&
  bundleCopySrc.includes("The AI & Prompt Engineering bundle is KYK") &&
  bundleCopySrc.includes("The Business Analytics bundle is five KYK courses")
) {
  pass("Development, AI, and Analytics bundle copy remain unchanged after Marketing Bundle work");
} else fail("Another bundle's copy was changed by Marketing Bundle work");

const bundleDetailSrc = fs.readFileSync(path.join(root, "src/pages/BundleDetail.jsx"), "utf8");
if (bundleDetailSrc.includes('slug === "development"') && bundleDetailSrc.includes("BUNDLE_SEO.development.h1")) {
  pass("Development Bundle page uses the approved H1 on this slug only");
} else fail("Development Bundle H1 is not slug-gated");
if (bundleDetailSrc.includes('slug === "ai"') && bundleDetailSrc.includes("BUNDLE_SEO.ai.h1")) {
  pass("AI Bundle page uses the approved H1 on this slug only");
} else fail("AI Bundle H1 is not slug-gated");
if (bundleDetailSrc.includes('slug === "analytics"') && bundleDetailSrc.includes("BUNDLE_SEO.analytics.h1")) {
  pass("Analytics Bundle page uses the approved H1 on this slug only");
} else fail("Analytics Bundle H1 is not slug-gated");
if (bundleDetailSrc.includes('slug === "marketing"') && bundleDetailSrc.includes("BUNDLE_SEO.marketing.h1")) {
  pass("Marketing Bundle page uses the approved H1 on this slug only");
} else fail("Marketing Bundle H1 is not slug-gated");
if (bundleDetailSrc.includes("copy?.introHeading") && bundleDetailSrc.includes("<h2")) {
  pass("Bundle detail renders the introductory H2 from copy when present");
} else fail("Bundle detail missing introductory H2");
if (
  bundleDetailSrc.includes('slug === "development"') &&
  bundleDetailSrc.includes("<strong") &&
  bundleDetailSrc.includes("{faq.q}") &&
  bundleDetailSrc.includes("{faq.a}") &&
  !bundleDetailSrc.includes("<h3")
) {
  pass("Development Bundle FAQ questions use phrasing content inside summary without rewriting copy");
} else fail("Development Bundle FAQ summary markup is invalid or copy rewritten");
if ((bundleDetailSrc.match(/<details/g) || []).length === 1 && bundleCopySrc.includes("faqs: [")) {
  pass("Bundle detail still uses one details/summary map over catalog FAQs");
} else fail("Bundle detail FAQ disclosure structure changed");
if (bundleDetailSrc.includes("addBundle") && bundleDetailSrc.includes("addCourse") && bundleDetailSrc.includes("formatInr(offer.fee)")) {
  pass("Bundle detail still uses catalog pricing and cart CTAs");
} else fail("Bundle detail lost pricing or cart CTAs");
if (
  AI_BUNDLE_SEO.title === "AI & Prompt Engineering Course Bundle | KYK" &&
  ANALYTICS_BUNDLE_SEO.title === "Business Analytics Course Bundle | SQL, Power BI & Tableau | KYK" &&
  MARKETING_BUNDLE_SEO.title === "Digital Marketing Course Bundle | SEO, SEM & SMM | KYK"
) {
  pass("AI Bundle title is preserved and Analytics/Marketing Helmet titles remain unchanged");
} else fail("AI, Analytics, or Marketing bundle Helmet title changed unexpectedly");

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
if (
  internDetail.includes('slug === "development"') &&
  internDetail.includes("INTERNSHIP_SEO.development.h1") &&
  internDetail.includes("copy?.introHeading")
) {
  pass("Development Internship page uses the approved H1 and intro H2 on this slug only");
} else fail("Development Internship H1 or intro H2 is not slug-gated");
if (
  internDetail.includes('slug === "ai"') &&
  internDetail.includes("INTERNSHIP_SEO.ai.h1") &&
  internDetail.includes("copy?.introHeading")
) {
  pass("AI Internship page uses the approved H1 and intro H2 on this slug only");
} else fail("AI Internship H1 or intro H2 is not slug-gated");
if (
  internDetail.includes("the internship programme you want to apply for") &&
  internDetail.includes("the internship course you want to enroll in")
) {
  pass("Development Internship Apply Now description is copy-corrected without changing other internships");
} else fail("Development Internship Apply Now copy correction is missing or leaked to other internships");
if (
  internDetail.includes('source: "internship-apply"') &&
  internDetail.includes("internshipInterest: item.title") &&
  internDetail.includes("addInternshipToCart")
) {
  pass("Internship apply source, interest prefill, and cart handler remain unchanged");
} else fail("Internship apply or cart behaviour changed");
if (
  internDetail.includes("{faq.q}") &&
  internDetail.includes("{faq.a}") &&
  internDetail.includes("<details") &&
  internDetail.includes("<summary") &&
  !internDetail.includes("<h3")
) {
  pass("Internship FAQ questions use phrasing content inside summary without heading tags");
} else fail("Internship FAQ summary markup is invalid or copy rewritten");

const internCopySrc = fs.readFileSync(path.join(root, "src/data/internshipPageCopy.js"), "utf8");
if (internCopySrc.includes('introHeading: "A paid 1–3 month Remote/Hybrid Development internship with Python and MERN"')) {
  pass("Development Internship intro H2 copy is the approved heading");
} else fail("Development Internship intro H2 copy is missing or changed");
if (internCopySrc.includes('introHeading: "A paid 1–3 month Remote AI internship with prompt engineering and LLM tools"')) {
  pass("AI Internship intro H2 copy is the approved heading");
} else fail("AI Internship intro H2 copy is missing or changed");
const developmentInternFaqQuestions = [
  "What is the Development internship?",
  "Do I get a stipend?",
  "How is this different from the Development bundle?",
  "How do I apply?",
  "What skills does the listing name?",
  "Are there live classes?",
];
const developmentInternFaqAnswers = [
  "A 1–3 month Remote / Hybrid KYK programme listed as building with Python, MERN, and modern web stacks, shipping features with mentors, and growing toward a full-stack developer role.",
  "No stipend is listed. You pay a programme fee of ₹3,999/- plus 18% GST at checkout. That amount is not paid out to you.",
  "The bundle is three individual courses (Python, Data Science, MERN) at the bundle price. This page is the internship programme with its own fee. You can open either product; they are not the same checkout item.",
  "Apply Now opens a form for your name, phone, mail ID, and internship interest. KYK saves it and contacts you. Add to cart sends you to login (if needed) and checkout for this programme.",
  "Python, React, Node.js, MongoDB, and Git. Related course pages go deeper on Python, data/ML tools, and the MERN stack.",
  "Yes — KYK’s Live Classes page can show Development-track sessions. Class types include lecture, doubt session, workshop, webinar, and mock interview when an admin schedules them.",
];
if (developmentInternFaqQuestions.every((q) => internCopySrc.includes(`q: "${q}"`))) {
  pass("Development Internship keeps all six original FAQ questions");
} else fail("Development Internship FAQ questions changed");
if (developmentInternFaqAnswers.every((a) => internCopySrc.includes(`a: "${a}"`))) {
  pass("Development Internship keeps all six original FAQ answers");
} else fail("Development Internship FAQ answers changed");
if (
  internCopySrc.includes("The AI & Prompt Engineering internship is Knock Your Knowledge") &&
  internCopySrc.includes("The Business Analytics internship is Knock Your Knowledge") &&
  internCopySrc.includes("The Advanced Digital Marketing internship is Knock Your Knowledge")
) {
  pass("AI, Analytics, and Marketing internship copy remain unchanged");
} else fail("Another internship's copy was changed by Development Internship work");
const aiInternFaqQuestions = [
  "What does the AI internship cover?",
  "Is ₹3,999/- a stipend?",
  "Is this the same as the AI course bundle?",
  "Which AI products are named on the internship listing?",
  "How do I apply?",
  "Will I train my own model?",
];
const aiInternFaqAnswers = [
  "The listing: design prompts, work with LLMs, and build AI-assisted workflows across ChatGPT, Claude, and productivity tools. Duration is 1–3 months, Remote.",
  "No. It is the programme fee. Checkout adds 18% GST. Nothing on this listing says KYK pays you.",
  "No. The bundle is three courses at ₹499/- versus buying them separately. This internship is a different product at ₹3,999/- plus GST.",
  "ChatGPT, Claude, and productivity tools. Gemini, Notion AI, Midjourney, Runway, and Perplexity appear on the related course pages, not on this internship record.",
  "Apply Now (name, phone, mail ID, internship interest — KYK contacts you) or Add to cart (login if needed, then checkout).",
  "The internship listing does not say that. Related Fundamentals covers AI, ML, neural networks, and NLP; Prompt Engineering and the tools course are about using existing products.",
];
if (aiInternFaqQuestions.every((q) => internCopySrc.includes(`q: "${q}"`))) {
  pass("AI Internship keeps all six original FAQ questions");
} else fail("AI Internship FAQ questions changed");
if (aiInternFaqAnswers.every((a) => internCopySrc.includes(`a: "${a}"`))) {
  pass("AI Internship keeps all six original FAQ answers");
} else fail("AI Internship FAQ answers changed");
if (
  internCopySrc.includes("The Development internship is Knock Your Knowledge") &&
  internCopySrc.includes("The Business Analytics internship is Knock Your Knowledge") &&
  internCopySrc.includes("The Advanced Digital Marketing internship is Knock Your Knowledge")
) {
  pass("Development, Analytics, and Marketing internship copy remain unchanged after AI Internship work");
} else fail("Another internship's copy was changed by AI Internship work");

const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
for (const route of ["/Checkout", "/Dashboard", "/login", "/Blog/:slug/videos", "/Blog/:slug", "/Bundles/:slug", "/Internships/:slug", "/CourseLearning"]) {
  if (app.includes(`path="${route}"`) || app.includes(`path={\`${route}\``) || app.includes(route)) pass(`App still routes ${route}`);
  else fail(`App missing route ${route}`);
}

const jsonLd = fs.readFileSync(path.join(root, "src/config/jsonLd.js"), "utf8");
for (const t of ["EducationalOrganization", "WebSite", "BreadcrumbList", "Course", "ItemList", "CourseInstance", "Offer", "FAQPage", "Product"]) {
  if (jsonLd.includes(`"${t}"`) || jsonLd.includes(`@type": "${t}"`) || jsonLd.includes(`"@type": "${t}"`)) {
    pass(`JSON-LD builder includes ${t}`);
  } else fail(`JSON-LD builder missing ${t}`);
}
if (!jsonLd.includes("aggregateRating") && !jsonLd.includes("Review")) pass("JSON-LD omits unverified ratings/reviews");
else warn("JSON-LD includes rating/review fields");
if (
  /if \(slug === "development"\) \{[\s\S]*?"@type": "EducationalOccupationalProgram"[\s\S]*?name: "Development Internship"[\s\S]*?price: String\(INTERNSHIP_FEE_AMOUNT\)[\s\S]*?valueAddedTaxIncluded: false[\s\S]*?faqPageNode\(faqs, path\)/.test(
    jsonLd
  )
) {
  pass("Development Internship JSON-LD adds EducationalOccupationalProgram, Offer, and FAQPage on this slug only");
} else fail("Development Internship programme, Offer, or FAQPage is missing or not slug-gated");
if (jsonLd.includes('slug === "development" ? "Development Internship"')) {
  pass("Development Internship breadcrumb name stays pinned to Development Internship");
} else fail("Development Internship breadcrumb name is not pinned to the catalog name");
if (jsonLd.includes("INTERNSHIP_PAGE_COPY.development") && jsonLd.includes("faqPageNode(faqs, path)")) {
  pass("Development Internship FAQPage uses the existing internship copy FAQs");
} else fail("Development Internship FAQPage is not sourced from internship copy");
if (
  jsonLd.includes("18% GST is charged separately at checkout") &&
  jsonLd.includes("not a stipend or salary") &&
  jsonLd.includes("valueAddedTaxIncluded: false")
) {
  pass("Development Internship Offer states ₹3,999 INR with GST separate and VAT false");
} else fail("Development Internship Offer GST or fee wording is missing");
if (
  !jsonLd.includes("JobPosting") &&
  !jsonLd.includes("baseSalary") &&
  !jsonLd.includes("248") &&
  !jsonLd.includes("2026-12-31")
) {
  pass("Development Internship JSON-LD omits JobPosting, salary, and demo applicant/deadline values");
} else fail("Development Internship JSON-LD includes unsupported job, salary, or demo inventory fields");
if (!jsonLd.includes("timeToComplete")) {
  pass("Development Internship JSON-LD omits timeToComplete rather than inventing a single duration");
} else fail("Development Internship JSON-LD invented an exact timeToComplete");
if (
  /if \(slug === "ai"\) \{[\s\S]*?"@type": "EducationalOccupationalProgram"[\s\S]*?name: "AI & Prompt Engineering Internship"[\s\S]*?price: String\(INTERNSHIP_FEE_AMOUNT\)[\s\S]*?valueAddedTaxIncluded: false[\s\S]*?faqPageNode\(faqs, path\)/.test(
    jsonLd
  )
) {
  pass("AI Internship JSON-LD adds EducationalOccupationalProgram, Offer, and FAQPage on this slug only");
} else fail("AI Internship programme, Offer, or FAQPage is missing or not slug-gated");
if (jsonLd.includes('slug === "ai"') && jsonLd.includes('"AI & Prompt Engineering Internship"')) {
  pass("AI Internship breadcrumb name stays pinned to AI & Prompt Engineering Internship");
} else fail("AI Internship breadcrumb name is not pinned to the catalog name");
if (jsonLd.includes("INTERNSHIP_PAGE_COPY.ai") && jsonLd.includes('educationalProgramMode: "Remote"')) {
  pass("AI Internship programme uses internship copy and Remote mode");
} else fail("AI Internship programme description or Remote mode is missing");
if (
  jsonLd.includes('"Prompt Engineering"') &&
  jsonLd.includes('"ChatGPT"') &&
  jsonLd.includes('"Claude"') &&
  jsonLd.includes('"AI Tools"') &&
  jsonLd.includes('"NLP"')
) {
  pass("AI Internship JSON-LD teaches the verified listing skills only");
} else fail("AI Internship JSON-LD skills are missing or incorrect");
if (
  !jsonLd.includes("JobPosting") &&
  !jsonLd.includes("baseSalary") &&
  !jsonLd.includes("312") &&
  !jsonLd.includes("2026-12-31")
) {
  pass("AI Internship JSON-LD omits JobPosting, salary, and demo applicant/deadline values");
} else fail("AI Internship JSON-LD includes unsupported job, salary, or demo inventory fields");
if (
  /if \(slug === "development"\) \{[\s\S]*?if \(slug === "ai"\) \{/.test(jsonLd)
) {
  pass("Development Internship JSON-LD programme block remains separate from the AI Internship block");
} else fail("Development and AI Internship JSON-LD programme blocks were merged or reordered unsafely");

const spaShell = fs.readFileSync(path.join(root, "index.html"), "utf8");
const injectionServer = http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://127.0.0.1").pathname;
  if (videoParentPath(pathname)) res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const link = documentLinkHeader(pathname);
  if (link) res.setHeader("Link", link);
  res.statusCode = statusForFrontendPath(pathname);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(applyInitialHtmlSeo(spaShell, pathname));
});
await new Promise((resolve) => injectionServer.listen(0, "127.0.0.1", resolve));
const injOrigin = `http://127.0.0.1:${injectionServer.address().port}`;
try {
  const smmRes = await fetch(`${injOrigin}${SMM_COURSE_PATH}`);
  const smmHtml = await smmRes.text();
  const smmLink = smmRes.headers.get("link");
  if (smmRes.status === 200) pass("Express-like /Blog/smm-social-media-marketing returns HTTP 200");
  else fail(`SMM course HTTP ${smmRes.status}`);
  if (smmHtml.includes(smmTitleHtml) && smmHtml.includes(SMM_COURSE_SEO.description)) {
    pass("SMM initial HTML has the new title and description");
  } else fail("SMM initial HTML missing title or description");
  if ((smmHtml.match(/rel="canonical"/g) || []).length === 1) pass("SMM initial HTML has one canonical");
  else fail("SMM initial HTML canonical count is not 1");
  if (smmLink === `<${canonicalUrl(SMM_COURSE_PATH)}>; rel="canonical"`) pass("SMM response Link header is self-canonical");
  else fail(`SMM Link header was ${smmLink}`);
  if (smmHtml.includes('content="index, follow"') && !smmHtml.includes("noindex")) pass("SMM initial HTML is index, follow");
  else fail("SMM initial HTML not indexable");

  const internRes = await fetch(`${injOrigin}/Internships`);
  const internHtml = await internRes.text();
  if (
    internHtml.includes(INTERNSHIPS_LISTING_SEO.title) &&
    !internHtml.includes(SMM_COURSE_SEO.title) &&
    !internHtml.includes(seoCourseTitleHtml) &&
    !internHtml.includes(semCourseTitleHtml) &&
    !internHtml.includes(smoCourseTitleHtml) &&
    !internHtml.includes(gscCourseTitleHtml) &&
    !internHtml.includes(aimCourseTitleHtml) &&
    !internHtml.includes(aipCourseTitleHtml) &&
    !internHtml.includes(peCourseTitleHtml) &&
    !internHtml.includes(aifCourseTitleHtml) &&
    !internHtml.includes(pyCourseTitleHtml)
  ) {
    pass("/Internships first-byte SEO unchanged");
  } else fail("/Internships first-byte SEO changed");

  const seoCourseRes = await fetch(`${injOrigin}${SEO_COURSE_PATH}`);
  const seoCourseHtml = await seoCourseRes.text();
  if (seoCourseRes.status === 200) pass("Express-like /Blog/seo-search-engine-optimization returns HTTP 200");
  else fail(`SEO course HTTP ${seoCourseRes.status}`);
  if (seoCourseHtml.includes(seoCourseTitleHtml) && seoCourseHtml.includes(SEO_COURSE_SEO.description)) {
    pass("SEO course initial HTML has the new title and description");
  } else fail("SEO course initial HTML missing title or description");
  if ((seoCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("SEO course initial HTML has one canonical");
  else fail("SEO course initial HTML canonical count is not 1");
  if (seoCourseRes.headers.get("link") === `<${canonicalUrl(SEO_COURSE_PATH)}>; rel="canonical"`) {
    pass("SEO course response Link header is self-canonical");
  } else fail("SEO course Link header was incorrect");
  if (seoCourseHtml.includes('content="index, follow"') && !seoCourseHtml.includes("noindex")) {
    pass("SEO course initial HTML is index, follow");
  } else fail("SEO course initial HTML not indexable");
  if (!seoCourseHtml.includes(SMM_COURSE_SEO.title) && !seoCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)) {
    pass("SEO course first-byte HTML does not reuse SMM or Internships metadata");
  } else fail("SEO course first-byte HTML mixed another route's metadata");

  const smmAfter = await fetch(`${injOrigin}${SMM_COURSE_PATH}`);
  const smmAfterHtml = await smmAfter.text();
  if (
    smmAfterHtml.includes(smmTitleHtml) &&
    !smmAfterHtml.includes(seoCourseTitleHtml) &&
    !smmAfterHtml.includes(semCourseTitleHtml) &&
    !smmAfterHtml.includes(smoCourseTitleHtml) &&
    !smmAfterHtml.includes(gscCourseTitleHtml) &&
    !smmAfterHtml.includes(aimCourseTitleHtml) &&
    !smmAfterHtml.includes(aipCourseTitleHtml) &&
    !smmAfterHtml.includes(peCourseTitleHtml) &&
    !smmAfterHtml.includes(aifCourseTitleHtml) &&
    !smmAfterHtml.includes(pyCourseTitleHtml)
  ) {
    pass("SMM first-byte SEO remains unchanged");
  } else fail("SMM first-byte SEO changed by later course work");

  const semCourseRes = await fetch(`${injOrigin}${SEM_COURSE_PATH}`);
  const semCourseHtml = await semCourseRes.text();
  if (semCourseRes.status === 200) pass("Express-like /Blog/sem-search-engine-marketing returns HTTP 200");
  else fail(`SEM course HTTP ${semCourseRes.status}`);
  if (semCourseHtml.includes(semCourseTitleHtml) && semCourseHtml.includes(SEM_COURSE_SEO.description)) {
    pass("SEM course initial HTML has the new title and description");
  } else fail("SEM course initial HTML missing title or description");
  if ((semCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("SEM course initial HTML has one canonical");
  else fail("SEM course initial HTML canonical count is not 1");
  if (semCourseRes.headers.get("link") === `<${canonicalUrl(SEM_COURSE_PATH)}>; rel="canonical"`) {
    pass("SEM course response Link header is self-canonical");
  } else fail("SEM course Link header was incorrect");
  if (semCourseHtml.includes('content="index, follow"') && !semCourseHtml.includes("noindex")) {
    pass("SEM course initial HTML is index, follow");
  } else fail("SEM course initial HTML not indexable");
  if (
    !semCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !semCourseHtml.includes(seoCourseTitleHtml) &&
    !semCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("SEM course first-byte HTML does not reuse SMM, SEO, or Internships metadata");
  } else fail("SEM course first-byte HTML mixed another route's metadata");

  const seoAfter = await fetch(`${injOrigin}${SEO_COURSE_PATH}`);
  const seoAfterHtml = await seoAfter.text();
  if (
    seoAfterHtml.includes(seoCourseTitleHtml) &&
    !seoAfterHtml.includes(semCourseTitleHtml) &&
    !seoAfterHtml.includes(smoCourseTitleHtml) &&
    !seoAfterHtml.includes(gscCourseTitleHtml) &&
    !seoAfterHtml.includes(aimCourseTitleHtml) &&
    !seoAfterHtml.includes(aipCourseTitleHtml) &&
    !seoAfterHtml.includes(peCourseTitleHtml)
  ) {
    pass("SEO course first-byte SEO remains unchanged");
  } else fail("SEO course first-byte SEO changed by later course work");

  const smoCourseRes = await fetch(`${injOrigin}${SMO_COURSE_PATH}`);
  const smoCourseHtml = await smoCourseRes.text();
  if (smoCourseRes.status === 200) pass("Express-like /Blog/smo-social-media-optimization returns HTTP 200");
  else fail(`SMO course HTTP ${smoCourseRes.status}`);
  if (smoCourseHtml.includes(smoCourseTitleHtml) && smoCourseHtml.includes(SMO_COURSE_SEO.description)) {
    pass("SMO course initial HTML has the new title and description");
  } else fail("SMO course initial HTML missing title or description");
  if ((smoCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("SMO course initial HTML has one canonical");
  else fail("SMO course initial HTML canonical count is not 1");
  if (smoCourseRes.headers.get("link") === `<${canonicalUrl(SMO_COURSE_PATH)}>; rel="canonical"`) {
    pass("SMO course response Link header is self-canonical");
  } else fail("SMO course Link header was incorrect");
  if (smoCourseHtml.includes('content="index, follow"') && !smoCourseHtml.includes("noindex")) {
    pass("SMO course initial HTML is index, follow");
  } else fail("SMO course initial HTML not indexable");
  if (
    !smoCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !smoCourseHtml.includes(seoCourseTitleHtml) &&
    !smoCourseHtml.includes(semCourseTitleHtml) &&
    !smoCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("SMO course first-byte HTML does not reuse SMM, SEO, SEM, or Internships metadata");
  } else fail("SMO course first-byte HTML mixed another route's metadata");

  const semAfter = await fetch(`${injOrigin}${SEM_COURSE_PATH}`);
  const semAfterHtml = await semAfter.text();
  if (
    semAfterHtml.includes(semCourseTitleHtml) &&
    !semAfterHtml.includes(smoCourseTitleHtml) &&
    !semAfterHtml.includes(gscCourseTitleHtml) &&
    !semAfterHtml.includes(aimCourseTitleHtml) &&
    !semAfterHtml.includes(aipCourseTitleHtml) &&
    !semAfterHtml.includes(peCourseTitleHtml)
  ) {
    pass("SEM course first-byte SEO remains unchanged");
  } else fail("SEM course first-byte SEO changed by later course work");

  const gscCourseRes = await fetch(`${injOrigin}${GSC_COURSE_PATH}`);
  const gscCourseHtml = await gscCourseRes.text();
  if (gscCourseRes.status === 200) pass("Express-like /Blog/google-webmaster-search-console returns HTTP 200");
  else fail(`GSC course HTTP ${gscCourseRes.status}`);
  if (gscCourseHtml.includes(gscCourseTitleHtml) && gscCourseHtml.includes(GSC_COURSE_SEO.description)) {
    pass("GSC course initial HTML has the new title and description");
  } else fail("GSC course initial HTML missing title or description");
  if ((gscCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("GSC course initial HTML has one canonical");
  else fail("GSC course initial HTML canonical count is not 1");
  if (gscCourseRes.headers.get("link") === `<${canonicalUrl(GSC_COURSE_PATH)}>; rel="canonical"`) {
    pass("GSC course response Link header is self-canonical");
  } else fail("GSC course Link header was incorrect");
  if (gscCourseHtml.includes('content="index, follow"') && !gscCourseHtml.includes("noindex")) {
    pass("GSC course initial HTML is index, follow");
  } else fail("GSC course initial HTML not indexable");
  if (
    !gscCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !gscCourseHtml.includes(seoCourseTitleHtml) &&
    !gscCourseHtml.includes(semCourseTitleHtml) &&
    !gscCourseHtml.includes(smoCourseTitleHtml) &&
    !gscCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("GSC course first-byte HTML does not reuse SMM, SEO, SEM, SMO, or Internships metadata");
  } else fail("GSC course first-byte HTML mixed another route's metadata");

  const smoAfter = await fetch(`${injOrigin}${SMO_COURSE_PATH}`);
  const smoAfterHtml = await smoAfter.text();
  if (
    smoAfterHtml.includes(smoCourseTitleHtml) &&
    !smoAfterHtml.includes(gscCourseTitleHtml) &&
    !smoAfterHtml.includes(aimCourseTitleHtml) &&
    !smoAfterHtml.includes(aipCourseTitleHtml) &&
    !smoAfterHtml.includes(peCourseTitleHtml)
  ) {
    pass("SMO course first-byte SEO remains unchanged");
  } else fail("SMO course first-byte SEO changed by later course work");

  const aimCourseRes = await fetch(`${injOrigin}${AI_MARKETING_COURSE_PATH}`);
  const aimCourseHtml = await aimCourseRes.text();
  if (aimCourseRes.status === 200) pass("Express-like /Blog/ai-tools-in-digital-marketing returns HTTP 200");
  else fail(`AI marketing course HTTP ${aimCourseRes.status}`);
  if (aimCourseHtml.includes(aimCourseTitleHtml) && aimCourseHtml.includes(AI_MARKETING_COURSE_SEO.description)) {
    pass("AI marketing course initial HTML has the new title and description");
  } else fail("AI marketing course initial HTML missing title or description");
  if ((aimCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("AI marketing course initial HTML has one canonical");
  else fail("AI marketing course initial HTML canonical count is not 1");
  if (aimCourseRes.headers.get("link") === `<${canonicalUrl(AI_MARKETING_COURSE_PATH)}>; rel="canonical"`) {
    pass("AI marketing course response Link header is self-canonical");
  } else fail("AI marketing course Link header was incorrect");
  if (aimCourseHtml.includes('content="index, follow"') && !aimCourseHtml.includes("noindex")) {
    pass("AI marketing course initial HTML is index, follow");
  } else fail("AI marketing course initial HTML not indexable");
  if (
    !aimCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !aimCourseHtml.includes(seoCourseTitleHtml) &&
    !aimCourseHtml.includes(semCourseTitleHtml) &&
    !aimCourseHtml.includes(smoCourseTitleHtml) &&
    !aimCourseHtml.includes(gscCourseTitleHtml) &&
    !aimCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("AI marketing course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, or Internships metadata");
  } else fail("AI marketing course first-byte HTML mixed another route's metadata");

  const gscAfter = await fetch(`${injOrigin}${GSC_COURSE_PATH}`);
  const gscAfterHtml = await gscAfter.text();
  if (
    gscAfterHtml.includes(gscCourseTitleHtml) &&
    !gscAfterHtml.includes(aimCourseTitleHtml) &&
    !gscAfterHtml.includes(aipCourseTitleHtml) &&
    !gscAfterHtml.includes(peCourseTitleHtml)
  ) {
    pass("GSC course first-byte SEO remains unchanged");
  } else fail("GSC course first-byte SEO changed by later course work");

  const coursesRes = await fetch(`${injOrigin}/Courses`);
  const coursesHtml = await coursesRes.text();
  if (
    !coursesHtml.includes(SMM_COURSE_SEO.title) &&
    !coursesHtml.includes(INTERNSHIPS_LISTING_SEO.title) &&
    !coursesHtml.includes(seoCourseTitleHtml) &&
    !coursesHtml.includes(semCourseTitleHtml) &&
    !coursesHtml.includes(smoCourseTitleHtml) &&
    !coursesHtml.includes(gscCourseTitleHtml) &&
    !coursesHtml.includes(aimCourseTitleHtml) &&
    !coursesHtml.includes(aipCourseTitleHtml) &&
    !coursesHtml.includes(peCourseTitleHtml)
  ) {
    pass("/Courses first-byte HTML is still the shared shell");
  } else fail("/Courses first-byte HTML was injected");

  const homeRes = await fetch(`${injOrigin}/`);
  const homeHtml = await homeRes.text();
  const bundlesRes = await fetch(`${injOrigin}/Bundles`);
  const bundlesHtml = await bundlesRes.text();
  const semRes = await fetch(`${injOrigin}/Blog/sem-search-engine-marketing`);
  const semHtml = await semRes.text();
  if (
    !homeHtml.includes(seoCourseTitleHtml) &&
    !bundlesHtml.includes(seoCourseTitleHtml) &&
    !semHtml.includes(seoCourseTitleHtml) &&
    !homeHtml.includes(semCourseTitleHtml) &&
    !bundlesHtml.includes(semCourseTitleHtml) &&
    !homeHtml.includes(smoCourseTitleHtml) &&
    !bundlesHtml.includes(smoCourseTitleHtml) &&
    !homeHtml.includes(gscCourseTitleHtml) &&
    !bundlesHtml.includes(gscCourseTitleHtml) &&
    !homeHtml.includes(aimCourseTitleHtml) &&
    !bundlesHtml.includes(aimCourseTitleHtml) &&
    !homeHtml.includes(aipCourseTitleHtml) &&
    !bundlesHtml.includes(aipCourseTitleHtml) &&
    !homeHtml.includes(peCourseTitleHtml) &&
    !bundlesHtml.includes(peCourseTitleHtml) &&
    !homeHtml.includes(aifCourseTitleHtml) &&
    !bundlesHtml.includes(aifCourseTitleHtml) &&
    !homeHtml.includes(pyCourseTitleHtml) &&
    !bundlesHtml.includes(pyCourseTitleHtml) &&
    !homeHtml.includes(dsCourseTitleHtml) &&
    !bundlesHtml.includes(dsCourseTitleHtml) &&
    !homeHtml.includes(mernCourseTitleHtml) &&
    !bundlesHtml.includes(mernCourseTitleHtml) &&
    !homeHtml.includes(jiraCourseTitleHtml) &&
    !bundlesHtml.includes(jiraCourseTitleHtml) &&
    !homeHtml.includes(sqlCourseTitleHtml) &&
    !bundlesHtml.includes(sqlCourseTitleHtml) &&
    !homeHtml.includes(powerBiCourseTitleHtml) &&
    !bundlesHtml.includes(powerBiCourseTitleHtml) &&
    !homeHtml.includes(tableauCourseTitleHtml) &&
    !bundlesHtml.includes(tableauCourseTitleHtml)
  ) {
    pass("Homepage and Bundles first-byte HTML were not given SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN, Jira, SQL, Power BI, or Tableau course metadata");
  } else fail("SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN, Jira, SQL, Power BI, or Tableau course metadata leaked onto homepage or Bundles");
  if (semHtml.includes(semCourseTitleHtml) && semHtml.includes(SEM_COURSE_SEO.description)) {
    pass("SEM course first-byte HTML uses SEM metadata, not the homepage shell");
  } else fail("SEM course first-byte HTML missing SEM metadata");

  const seoVid = await fetch(`${injOrigin}/Blog/seo-search-engine-optimization/videos`);
  const seoVidHtml = await seoVid.text();
  if (seoVid.status === 200 && seoVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("SEO course /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("SEO course /videos headers changed");
  if (seoVid.headers.get("link") === `<${canonicalUrl(SEO_COURSE_PATH)}>; rel="canonical"`) {
    pass("SEO course /videos Link header still parent-canonical");
  } else fail("SEO course /videos Link header changed");
  if (!seoVidHtml.includes(seoCourseTitleHtml)) pass("SEO course /videos HTML was not given course listing metadata");
  else fail("SEO course /videos HTML contains listing title");

  const semVid = await fetch(`${injOrigin}/Blog/sem-search-engine-marketing/videos`);
  const semVidHtml = await semVid.text();
  if (semVid.status === 200 && semVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("SEM /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("SEM /videos headers changed");
  if (
    semVid.headers.get("link") ===
    "<https://knockyourknowledge.com/Blog/sem-search-engine-marketing>; rel=\"canonical\""
  ) {
    pass("SEM /videos Link header still parent-canonical");
  } else fail("SEM /videos Link header changed");
  if (!semVidHtml.includes(SMM_COURSE_SEO.title) && !semVidHtml.includes(semCourseTitleHtml)) {
    pass("SEM /videos HTML was not given SMM or SEM listing metadata");
  } else fail("SEM /videos HTML contains listing metadata");

  const smoVid = await fetch(`${injOrigin}/Blog/smo-social-media-optimization/videos`);
  const smoVidHtml = await smoVid.text();
  if (smoVid.status === 200 && smoVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("SMO /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("SMO /videos headers changed");
  if (smoVid.headers.get("link") === `<${canonicalUrl(SMO_COURSE_PATH)}>; rel="canonical"`) {
    pass("SMO /videos Link header still parent-canonical");
  } else fail("SMO /videos Link header changed");
  if (!smoVidHtml.includes(smoCourseTitleHtml) && !smoVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("SMO /videos HTML was not given SMO listing or SMM metadata");
  } else fail("SMO /videos HTML contains listing metadata");

  const gscVid = await fetch(`${injOrigin}/Blog/google-webmaster-search-console/videos`);
  const gscVidHtml = await gscVid.text();
  if (gscVid.status === 200 && gscVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("GSC /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("GSC /videos headers changed");
  if (gscVid.headers.get("link") === `<${canonicalUrl(GSC_COURSE_PATH)}>; rel="canonical"`) {
    pass("GSC /videos Link header still parent-canonical");
  } else fail("GSC /videos Link header changed");
  if (!gscVidHtml.includes(gscCourseTitleHtml) && !gscVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("GSC /videos HTML was not given GSC listing or SMM metadata");
  } else fail("GSC /videos HTML contains listing metadata");

  const aimVid = await fetch(`${injOrigin}/Blog/ai-tools-in-digital-marketing/videos`);
  const aimVidHtml = await aimVid.text();
  if (aimVid.status === 200 && aimVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("AI marketing /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("AI marketing /videos headers changed");
  if (aimVid.headers.get("link") === `<${canonicalUrl(AI_MARKETING_COURSE_PATH)}>; rel="canonical"`) {
    pass("AI marketing /videos Link header still parent-canonical");
  } else fail("AI marketing /videos Link header changed");
  if (!aimVidHtml.includes(aimCourseTitleHtml) && !aimVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("AI marketing /videos HTML was not given AI marketing listing or SMM metadata");
  } else fail("AI marketing /videos HTML contains listing metadata");

  const aipCourseRes = await fetch(`${injOrigin}${AI_PRODUCTIVITY_COURSE_PATH}`);
  const aipCourseHtml = await aipCourseRes.text();
  if (aipCourseRes.status === 200) pass("Express-like /Blog/8-best-ai-tools-for-productivity returns HTTP 200");
  else fail(`AI productivity course HTTP ${aipCourseRes.status}`);
  if (aipCourseHtml.includes(aipCourseTitleHtml) && aipCourseHtml.includes(AI_PRODUCTIVITY_COURSE_SEO.description)) {
    pass("AI productivity course initial HTML has the new title and description");
  } else fail("AI productivity course initial HTML missing title or description");
  if ((aipCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("AI productivity course initial HTML has one canonical");
  else fail("AI productivity course initial HTML canonical count is not 1");
  if (aipCourseRes.headers.get("link") === `<${canonicalUrl(AI_PRODUCTIVITY_COURSE_PATH)}>; rel="canonical"`) {
    pass("AI productivity course response Link header is self-canonical");
  } else fail("AI productivity course Link header was incorrect");
  if (aipCourseHtml.includes('content="index, follow"') && !aipCourseHtml.includes("noindex")) {
    pass("AI productivity course initial HTML is index, follow");
  } else fail("AI productivity course initial HTML not indexable");
  if (
    !aipCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !aipCourseHtml.includes(seoCourseTitleHtml) &&
    !aipCourseHtml.includes(semCourseTitleHtml) &&
    !aipCourseHtml.includes(smoCourseTitleHtml) &&
    !aipCourseHtml.includes(gscCourseTitleHtml) &&
    !aipCourseHtml.includes(aimCourseTitleHtml) &&
    !aipCourseHtml.includes(peCourseTitleHtml) &&
    !aipCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("AI productivity course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, Prompt Engineering, or Internships metadata");
  } else fail("AI productivity course first-byte HTML mixed another route's metadata");

  const aimAfter = await fetch(`${injOrigin}${AI_MARKETING_COURSE_PATH}`);
  const aimAfterHtml = await aimAfter.text();
  if (
    aimAfterHtml.includes(aimCourseTitleHtml) &&
    !aimAfterHtml.includes(aipCourseTitleHtml) &&
    !aimAfterHtml.includes(peCourseTitleHtml)
  ) {
    pass("AI marketing course first-byte SEO remains unchanged");
  } else fail("AI marketing course first-byte SEO changed by later course work");

  const aipVid = await fetch(`${injOrigin}/Blog/8-best-ai-tools-for-productivity/videos`);
  const aipVidHtml = await aipVid.text();
  if (aipVid.status === 200 && aipVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("AI productivity /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("AI productivity /videos headers changed");
  if (aipVid.headers.get("link") === `<${canonicalUrl(AI_PRODUCTIVITY_COURSE_PATH)}>; rel="canonical"`) {
    pass("AI productivity /videos Link header still parent-canonical");
  } else fail("AI productivity /videos Link header changed");
  if (!aipVidHtml.includes(aipCourseTitleHtml) && !aipVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("AI productivity /videos HTML was not given AI productivity listing or SMM metadata");
  } else fail("AI productivity /videos HTML contains listing metadata");

  const peCourseRes = await fetch(`${injOrigin}${PROMPT_ENGINEERING_COURSE_PATH}`);
  const peCourseHtml = await peCourseRes.text();
  if (peCourseRes.status === 200) pass("Express-like /Blog/prompt-engineering returns HTTP 200");
  else fail(`Prompt Engineering course HTTP ${peCourseRes.status}`);
  if (peCourseHtml.includes(peCourseTitleHtml) && peCourseHtml.includes(PROMPT_ENGINEERING_COURSE_SEO.description)) {
    pass("Prompt Engineering course initial HTML has the new title and description");
  } else fail("Prompt Engineering course initial HTML missing title or description");
  if ((peCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("Prompt Engineering course initial HTML has one canonical");
  else fail("Prompt Engineering course initial HTML canonical count is not 1");
  if (peCourseRes.headers.get("link") === `<${canonicalUrl(PROMPT_ENGINEERING_COURSE_PATH)}>; rel="canonical"`) {
    pass("Prompt Engineering course response Link header is self-canonical");
  } else fail("Prompt Engineering course Link header was incorrect");
  if (peCourseHtml.includes('content="index, follow"') && !peCourseHtml.includes("noindex")) {
    pass("Prompt Engineering course initial HTML is index, follow");
  } else fail("Prompt Engineering course initial HTML not indexable");
  if (
    !peCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !peCourseHtml.includes(seoCourseTitleHtml) &&
    !peCourseHtml.includes(semCourseTitleHtml) &&
    !peCourseHtml.includes(smoCourseTitleHtml) &&
    !peCourseHtml.includes(gscCourseTitleHtml) &&
    !peCourseHtml.includes(aimCourseTitleHtml) &&
    !peCourseHtml.includes(aipCourseTitleHtml) &&
    !peCourseHtml.includes(aifCourseTitleHtml) &&
    !peCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Prompt Engineering course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, AI Fundamentals, or Internships metadata");
  } else fail("Prompt Engineering course first-byte HTML mixed another route's metadata");

  const aipAfter = await fetch(`${injOrigin}${AI_PRODUCTIVITY_COURSE_PATH}`);
  const aipAfterHtml = await aipAfter.text();
  if (aipAfterHtml.includes(aipCourseTitleHtml) && !aipAfterHtml.includes(peCourseTitleHtml)) {
    pass("AI productivity course first-byte SEO remains unchanged");
  } else fail("AI productivity course first-byte SEO changed by Prompt Engineering work");

  const peVid = await fetch(`${injOrigin}/Blog/prompt-engineering/videos`);
  const peVidHtml = await peVid.text();
  if (peVid.status === 200 && peVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Prompt Engineering /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("Prompt Engineering /videos headers changed");
  if (peVid.headers.get("link") === `<${canonicalUrl(PROMPT_ENGINEERING_COURSE_PATH)}>; rel="canonical"`) {
    pass("Prompt Engineering /videos Link header still parent-canonical");
  } else fail("Prompt Engineering /videos Link header changed");
  if (!peVidHtml.includes(peCourseTitleHtml) && !peVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("Prompt Engineering /videos HTML was not given Prompt Engineering listing or SMM metadata");
  } else fail("Prompt Engineering /videos HTML contains listing metadata");

  const aifCourseRes = await fetch(`${injOrigin}${AI_FUNDAMENTALS_COURSE_PATH}`);
  const aifCourseHtml = await aifCourseRes.text();
  if (aifCourseRes.status === 200) pass("Express-like /Blog/artificial-intelligence-fundamentals returns HTTP 200");
  else fail(`AI Fundamentals course HTTP ${aifCourseRes.status}`);
  if (aifCourseHtml.includes(aifCourseTitleHtml) && aifCourseHtml.includes(aifCourseDescHtml)) {
    pass("AI Fundamentals course initial HTML has the new title and description");
  } else fail("AI Fundamentals course initial HTML missing title or description");
  if ((aifCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("AI Fundamentals course initial HTML has one canonical");
  else fail("AI Fundamentals course initial HTML canonical count is not 1");
  if (aifCourseRes.headers.get("link") === `<${canonicalUrl(AI_FUNDAMENTALS_COURSE_PATH)}>; rel="canonical"`) {
    pass("AI Fundamentals course response Link header is self-canonical");
  } else fail("AI Fundamentals course Link header was incorrect");
  if (aifCourseHtml.includes('content="index, follow"') && !aifCourseHtml.includes("noindex")) {
    pass("AI Fundamentals course initial HTML is index, follow");
  } else fail("AI Fundamentals course initial HTML not indexable");
  if (
    aifCourseHtml.includes('property="og:title"') &&
    aifCourseHtml.includes('property="og:description"') &&
    aifCourseHtml.includes('property="og:url"') &&
    aifCourseHtml.includes('property="og:image"') &&
    aifCourseHtml.includes('name="twitter:card"') &&
    aifCourseHtml.includes("summary_large_image") &&
    aifCourseHtml.includes(aifOgImageHtml) &&
    aifCourseHtml.includes('name="twitter:image"')
  ) {
    pass("AI Fundamentals course initial HTML has OG and Twitter metadata");
  } else fail("AI Fundamentals course initial HTML missing OG or Twitter metadata");
  if (
    !aifCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !aifCourseHtml.includes(seoCourseTitleHtml) &&
    !aifCourseHtml.includes(semCourseTitleHtml) &&
    !aifCourseHtml.includes(smoCourseTitleHtml) &&
    !aifCourseHtml.includes(gscCourseTitleHtml) &&
    !aifCourseHtml.includes(aimCourseTitleHtml) &&
    !aifCourseHtml.includes(aipCourseTitleHtml) &&
    !aifCourseHtml.includes(peCourseTitleHtml) &&
    !aifCourseHtml.includes(pyCourseTitleHtml) &&
    !aifCourseHtml.includes(dsCourseTitleHtml) &&
    !aifCourseHtml.includes(pythonForAnalyticsCourseTitleHtml) &&
    !aifCourseHtml.includes(mernCourseTitleHtml) &&
    !aifCourseHtml.includes(jiraCourseTitleHtml) &&
    !aifCourseHtml.includes(sqlCourseTitleHtml) &&
    !aifCourseHtml.includes(powerBiCourseTitleHtml) &&
    !aifCourseHtml.includes(tableauCourseTitleHtml) &&
    !aifCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("AI Fundamentals course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, Python Programming, Data Science, Python for Analytics, MERN, Jira, SQL, Power BI, Tableau, or Internships metadata");
  } else fail("AI Fundamentals course first-byte HTML mixed another route's metadata");

  const peAfter = await fetch(`${injOrigin}${PROMPT_ENGINEERING_COURSE_PATH}`);
  const peAfterHtml = await peAfter.text();
  if (peAfterHtml.includes(peCourseTitleHtml) && !peAfterHtml.includes(aifCourseTitleHtml)) {
    pass("Prompt Engineering course first-byte SEO remains unchanged");
  } else fail("Prompt Engineering course first-byte SEO changed by AI Fundamentals work");
  if (peAfterHtml.includes('property="og:image"') === false) {
    pass("Prompt Engineering first-byte HTML still omits OG image after AI Fundamentals OG work");
  } else fail("Prompt Engineering first-byte HTML gained OG image from AI Fundamentals work");

  const aifVid = await fetch(`${injOrigin}/Blog/artificial-intelligence-fundamentals/videos`);
  const aifVidHtml = await aifVid.text();
  if (aifVid.status === 200 && aifVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("AI Fundamentals /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("AI Fundamentals /videos headers changed");
  if (aifVid.headers.get("link") === `<${canonicalUrl(AI_FUNDAMENTALS_COURSE_PATH)}>; rel="canonical"`) {
    pass("AI Fundamentals /videos Link header still parent-canonical");
  } else fail("AI Fundamentals /videos Link header changed");
  if (!aifVidHtml.includes(aifCourseTitleHtml) && !aifVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("AI Fundamentals /videos HTML was not given AI Fundamentals listing or SMM metadata");
  } else fail("AI Fundamentals /videos HTML contains listing metadata");

  const pyCourseRes = await fetch(`${injOrigin}${PYTHON_PROGRAMMING_COURSE_PATH}`);
  const pyCourseHtml = await pyCourseRes.text();
  if (pyCourseRes.status === 200) pass("Express-like /Blog/python-programming returns HTTP 200");
  else fail(`Python Programming course HTTP ${pyCourseRes.status}`);
  if (pyCourseHtml.includes(pyCourseTitleHtml) && pyCourseHtml.includes(PYTHON_PROGRAMMING_COURSE_SEO.description)) {
    pass("Python Programming course initial HTML has the new title and description");
  } else fail("Python Programming course initial HTML missing title or description");
  if ((pyCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("Python Programming course initial HTML has one canonical");
  else fail("Python Programming course initial HTML canonical count is not 1");
  if (pyCourseRes.headers.get("link") === `<${canonicalUrl(PYTHON_PROGRAMMING_COURSE_PATH)}>; rel="canonical"`) {
    pass("Python Programming course response Link header is self-canonical");
  } else fail("Python Programming course Link header was incorrect");
  if (pyCourseHtml.includes('content="index, follow"') && !pyCourseHtml.includes("noindex")) {
    pass("Python Programming course initial HTML is index, follow");
  } else fail("Python Programming course initial HTML not indexable");
  if (
    !pyCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !pyCourseHtml.includes(seoCourseTitleHtml) &&
    !pyCourseHtml.includes(semCourseTitleHtml) &&
    !pyCourseHtml.includes(smoCourseTitleHtml) &&
    !pyCourseHtml.includes(gscCourseTitleHtml) &&
    !pyCourseHtml.includes(aimCourseTitleHtml) &&
    !pyCourseHtml.includes(aipCourseTitleHtml) &&
    !pyCourseHtml.includes(peCourseTitleHtml) &&
    !pyCourseHtml.includes(aifCourseTitleHtml) &&
    !pyCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Python Programming course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, or Internships metadata");
  } else fail("Python Programming course first-byte HTML mixed another route's metadata");

  const aifAfter = await fetch(`${injOrigin}${AI_FUNDAMENTALS_COURSE_PATH}`);
  const aifAfterHtml = await aifAfter.text();
  if (aifAfterHtml.includes(aifCourseTitleHtml) && !aifAfterHtml.includes(pyCourseTitleHtml)) {
    pass("AI Fundamentals course first-byte SEO remains unchanged");
  } else fail("AI Fundamentals course first-byte SEO changed by Python Programming work");

  const pyVid = await fetch(`${injOrigin}/Blog/python-programming/videos`);
  const pyVidHtml = await pyVid.text();
  if (pyVid.status === 200 && pyVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Python Programming /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("Python Programming /videos headers changed");
  if (pyVid.headers.get("link") === `<${canonicalUrl(PYTHON_PROGRAMMING_COURSE_PATH)}>; rel="canonical"`) {
    pass("Python Programming /videos Link header still parent-canonical");
  } else fail("Python Programming /videos Link header changed");
  if (!pyVidHtml.includes(pyCourseTitleHtml) && !pyVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("Python Programming /videos HTML was not given Python Programming listing or SMM metadata");
  } else fail("Python Programming /videos HTML contains listing metadata");

  const dsCourseRes = await fetch(`${injOrigin}${DATA_SCIENCE_COURSE_PATH}`);
  const dsCourseHtml = await dsCourseRes.text();
  if (dsCourseRes.status === 200) pass("Express-like /Blog/data-science returns HTTP 200");
  else fail(`Data Science course HTTP ${dsCourseRes.status}`);
  if (dsCourseHtml.includes(dsCourseTitleHtml) && dsCourseHtml.includes(dsCourseDescHtml)) {
    pass("Data Science course initial HTML has the new title and description");
  } else fail("Data Science course initial HTML missing title or description");
  if ((dsCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("Data Science course initial HTML has one canonical");
  else fail("Data Science course initial HTML canonical count is not 1");
  if (dsCourseRes.headers.get("link") === `<${canonicalUrl(DATA_SCIENCE_COURSE_PATH)}>; rel="canonical"`) {
    pass("Data Science course response Link header is self-canonical");
  } else fail("Data Science course Link header was incorrect");
  if (dsCourseHtml.includes('content="index, follow"') && !dsCourseHtml.includes("noindex")) {
    pass("Data Science course initial HTML is index, follow");
  } else fail("Data Science course initial HTML not indexable");
  if (
    dsCourseHtml.includes('property="og:title"') &&
    dsCourseHtml.includes('property="og:description"') &&
    dsCourseHtml.includes('property="og:url"') &&
    dsCourseHtml.includes('property="og:image"') &&
    dsCourseHtml.includes('name="twitter:card"') &&
    dsCourseHtml.includes("summary_large_image") &&
    dsCourseHtml.includes(dsOgImageHtml) &&
    dsCourseHtml.includes('name="twitter:image"')
  ) {
    pass("Data Science course initial HTML has OG and Twitter metadata");
  } else fail("Data Science course initial HTML missing OG or Twitter metadata");
  if (
    !dsCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !dsCourseHtml.includes(pyCourseTitleHtml) &&
    !dsCourseHtml.includes(pythonForAnalyticsCourseTitleHtml) &&
    !dsCourseHtml.includes(sqlCourseTitleHtml) &&
    !dsCourseHtml.includes(powerBiCourseTitleHtml) &&
    !dsCourseHtml.includes(tableauCourseTitleHtml) &&
    !dsCourseHtml.includes(jiraCourseTitleHtml) &&
    !dsCourseHtml.includes(mernCourseTitleHtml) &&
    !dsCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Data Science course first-byte HTML does not reuse Python Programming, Python for Analytics, SQL, Power BI, Tableau, Jira, MERN, SMM, or Internships metadata");
  } else fail("Data Science course first-byte HTML mixed another route's metadata");

  const dsVid = await fetch(`${injOrigin}/Blog/data-science/videos`);
  const dsVidHtml = await dsVid.text();
  if (dsVid.status === 200 && dsVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Data Science /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("Data Science /videos headers changed");
  if (dsVid.headers.get("link") === `<${canonicalUrl(DATA_SCIENCE_COURSE_PATH)}>; rel="canonical"`) {
    pass("Data Science /videos Link header still parent-canonical");
  } else fail("Data Science /videos Link header changed");
  if (!dsVidHtml.includes(dsCourseTitleHtml) && !dsVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("Data Science /videos HTML was not given Data Science listing or SMM metadata");
  } else fail("Data Science /videos HTML contains listing metadata");

  const mernCourseRes = await fetch(`${injOrigin}${MERN_STACK_COURSE_PATH}`);
  const mernCourseHtml = await mernCourseRes.text();
  if (mernCourseRes.status === 200) pass("Express-like /Blog/mern-stack-development returns HTTP 200");
  else fail(`MERN Stack Development course HTTP ${mernCourseRes.status}`);
  if (mernCourseHtml.includes(mernCourseTitleHtml) && mernCourseHtml.includes(mernCourseDescHtml)) {
    pass("MERN Stack Development course initial HTML has the new title and description");
  } else fail("MERN Stack Development course initial HTML missing title or description");
  if ((mernCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("MERN Stack Development course initial HTML has one canonical");
  else fail("MERN Stack Development course initial HTML canonical count is not 1");
  if (mernCourseRes.headers.get("link") === `<${canonicalUrl(MERN_STACK_COURSE_PATH)}>; rel="canonical"`) {
    pass("MERN Stack Development course response Link header is self-canonical");
  } else fail("MERN Stack Development course Link header was incorrect");
  if (mernCourseHtml.includes('content="index, follow"') && !mernCourseHtml.includes("noindex")) {
    pass("MERN Stack Development course initial HTML is index, follow");
  } else fail("MERN Stack Development course initial HTML not indexable");
  if (
    !mernCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !mernCourseHtml.includes(seoCourseTitleHtml) &&
    !mernCourseHtml.includes(semCourseTitleHtml) &&
    !mernCourseHtml.includes(smoCourseTitleHtml) &&
    !mernCourseHtml.includes(gscCourseTitleHtml) &&
    !mernCourseHtml.includes(aimCourseTitleHtml) &&
    !mernCourseHtml.includes(aipCourseTitleHtml) &&
    !mernCourseHtml.includes(peCourseTitleHtml) &&
    !mernCourseHtml.includes(aifCourseTitleHtml) &&
    !mernCourseHtml.includes(pyCourseTitleHtml) &&
    !mernCourseHtml.includes(dsCourseTitleHtml) &&
    !mernCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("MERN Stack Development course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, or Internships metadata");
  } else fail("MERN Stack Development course first-byte HTML mixed another route's metadata");

  const pyAfter = await fetch(`${injOrigin}${PYTHON_PROGRAMMING_COURSE_PATH}`);
  const pyAfterHtml = await pyAfter.text();
  if (pyAfterHtml.includes(pyCourseTitleHtml) && !pyAfterHtml.includes(mernCourseTitleHtml)) {
    pass("Python Programming course first-byte SEO remains unchanged");
  } else fail("Python Programming course first-byte SEO changed by MERN Stack Development work");

  const dsAfter = await fetch(`${injOrigin}${DATA_SCIENCE_COURSE_PATH}`);
  const dsAfterHtml = await dsAfter.text();
  if (dsAfterHtml.includes(dsCourseTitleHtml) && !dsAfterHtml.includes(mernCourseTitleHtml)) {
    pass("Data Science course first-byte SEO remains unchanged");
  } else fail("Data Science course first-byte SEO changed by MERN Stack Development work");

  const mernVid = await fetch(`${injOrigin}/Blog/mern-stack-development/videos`);
  const mernVidHtml = await mernVid.text();
  if (mernVid.status === 200 && mernVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("MERN Stack Development /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("MERN Stack Development /videos headers changed");
  if (mernVid.headers.get("link") === `<${canonicalUrl(MERN_STACK_COURSE_PATH)}>; rel="canonical"`) {
    pass("MERN Stack Development /videos Link header still parent-canonical");
  } else fail("MERN Stack Development /videos Link header changed");
  if (!mernVidHtml.includes(mernCourseTitleHtml) && !mernVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("MERN Stack Development /videos HTML was not given MERN listing or SMM metadata");
  } else fail("MERN Stack Development /videos HTML contains listing metadata");

  const jiraCourseRes = await fetch(`${injOrigin}${JIRA_COURSE_PATH}`);
  const jiraCourseHtml = await jiraCourseRes.text();
  if (jiraCourseRes.status === 200) pass("Express-like /Blog/jira-for-project-management returns HTTP 200");
  else fail(`Jira for Project Management course HTTP ${jiraCourseRes.status}`);
  if (jiraCourseHtml.includes(jiraCourseTitleHtml) && jiraCourseHtml.includes(jiraCourseDescHtml)) {
    pass("Jira for Project Management course initial HTML has the new title and description");
  } else fail("Jira for Project Management course initial HTML missing title or description");
  if ((jiraCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("Jira for Project Management course initial HTML has one canonical");
  else fail("Jira for Project Management course initial HTML canonical count is not 1");
  if (jiraCourseRes.headers.get("link") === `<${canonicalUrl(JIRA_COURSE_PATH)}>; rel="canonical"`) {
    pass("Jira for Project Management course response Link header is self-canonical");
  } else fail("Jira for Project Management course Link header was incorrect");
  if (jiraCourseHtml.includes('content="index, follow"') && !jiraCourseHtml.includes("noindex")) {
    pass("Jira for Project Management course initial HTML is index, follow");
  } else fail("Jira for Project Management course initial HTML not indexable");
  if (
    jiraCourseHtml.includes('property="og:title"') &&
    jiraCourseHtml.includes('property="og:image"') &&
    jiraCourseHtml.includes('name="twitter:card"') &&
    jiraCourseHtml.includes("summary_large_image")
  ) {
    pass("Jira for Project Management course initial HTML has OG and Twitter metadata");
  } else fail("Jira for Project Management course initial HTML missing OG or Twitter metadata");
  if (
    !jiraCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !jiraCourseHtml.includes(seoCourseTitleHtml) &&
    !jiraCourseHtml.includes(semCourseTitleHtml) &&
    !jiraCourseHtml.includes(smoCourseTitleHtml) &&
    !jiraCourseHtml.includes(gscCourseTitleHtml) &&
    !jiraCourseHtml.includes(aimCourseTitleHtml) &&
    !jiraCourseHtml.includes(aipCourseTitleHtml) &&
    !jiraCourseHtml.includes(peCourseTitleHtml) &&
    !jiraCourseHtml.includes(aifCourseTitleHtml) &&
    !jiraCourseHtml.includes(pyCourseTitleHtml) &&
    !jiraCourseHtml.includes(dsCourseTitleHtml) &&
    !jiraCourseHtml.includes(mernCourseTitleHtml) &&
    !jiraCourseHtml.includes(sqlCourseTitleHtml) &&
    !jiraCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Jira for Project Management course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN, SQL, or Internships metadata");
  } else fail("Jira for Project Management course first-byte HTML mixed another route's metadata");

  const mernAfter = await fetch(`${injOrigin}${MERN_STACK_COURSE_PATH}`);
  const mernAfterHtml = await mernAfter.text();
  if (mernAfterHtml.includes(mernCourseTitleHtml) && !mernAfterHtml.includes(jiraCourseTitleHtml) && !mernAfterHtml.includes(sqlCourseTitleHtml)) {
    pass("MERN Stack Development course first-byte SEO remains unchanged");
  } else fail("MERN Stack Development course first-byte SEO changed by Jira or SQL work");

  const jiraVid = await fetch(`${injOrigin}/Blog/jira-for-project-management/videos`);
  const jiraVidHtml = await jiraVid.text();
  if (jiraVid.status === 200 && jiraVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Jira for Project Management /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("Jira for Project Management /videos headers changed");
  if (jiraVid.headers.get("link") === `<${canonicalUrl(JIRA_COURSE_PATH)}>; rel="canonical"`) {
    pass("Jira for Project Management /videos Link header still parent-canonical");
  } else fail("Jira for Project Management /videos Link header changed");
  if (!jiraVidHtml.includes(jiraCourseTitleHtml) && !jiraVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("Jira for Project Management /videos HTML was not given Jira listing or SMM metadata");
  } else fail("Jira for Project Management /videos HTML contains listing metadata");

  const sqlCourseRes = await fetch(`${injOrigin}${SQL_COURSE_PATH}`);
  const sqlCourseHtml = await sqlCourseRes.text();
  if (sqlCourseRes.status === 200) pass("Express-like /Blog/sql-for-data-analysis returns HTTP 200");
  else fail(`SQL for Data Analysis course HTTP ${sqlCourseRes.status}`);
  if (sqlCourseHtml.includes(sqlCourseTitleHtml) && sqlCourseHtml.includes(sqlCourseDescHtml)) {
    pass("SQL for Data Analysis course initial HTML has the new title and description");
  } else fail("SQL for Data Analysis course initial HTML missing title or description");
  if ((sqlCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("SQL for Data Analysis course initial HTML has one canonical");
  else fail("SQL for Data Analysis course initial HTML canonical count is not 1");
  if (sqlCourseRes.headers.get("link") === `<${canonicalUrl(SQL_COURSE_PATH)}>; rel="canonical"`) {
    pass("SQL for Data Analysis course response Link header is self-canonical");
  } else fail("SQL for Data Analysis course Link header was incorrect");
  if (sqlCourseHtml.includes('content="index, follow"') && !sqlCourseHtml.includes("noindex")) {
    pass("SQL for Data Analysis course initial HTML is index, follow");
  } else fail("SQL for Data Analysis course initial HTML not indexable");
  if (
    sqlCourseHtml.includes('property="og:title"') &&
    sqlCourseHtml.includes('property="og:image"') &&
    sqlCourseHtml.includes('name="twitter:card"') &&
    sqlCourseHtml.includes("summary_large_image")
  ) {
    pass("SQL for Data Analysis course initial HTML has OG and Twitter metadata");
  } else fail("SQL for Data Analysis course initial HTML missing OG or Twitter metadata");
  if (
    !sqlCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !sqlCourseHtml.includes(seoCourseTitleHtml) &&
    !sqlCourseHtml.includes(semCourseTitleHtml) &&
    !sqlCourseHtml.includes(smoCourseTitleHtml) &&
    !sqlCourseHtml.includes(gscCourseTitleHtml) &&
    !sqlCourseHtml.includes(aimCourseTitleHtml) &&
    !sqlCourseHtml.includes(aipCourseTitleHtml) &&
    !sqlCourseHtml.includes(peCourseTitleHtml) &&
    !sqlCourseHtml.includes(aifCourseTitleHtml) &&
    !sqlCourseHtml.includes(pyCourseTitleHtml) &&
    !sqlCourseHtml.includes(dsCourseTitleHtml) &&
    !sqlCourseHtml.includes(mernCourseTitleHtml) &&
    !sqlCourseHtml.includes(jiraCourseTitleHtml) &&
    !sqlCourseHtml.includes(powerBiCourseTitleHtml) &&
    !sqlCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("SQL for Data Analysis course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN, Jira, Power BI, or Internships metadata");
  } else fail("SQL for Data Analysis course first-byte HTML mixed another route's metadata");

  const mernAfterSql = await fetch(`${injOrigin}${MERN_STACK_COURSE_PATH}`);
  const mernAfterSqlHtml = await mernAfterSql.text();
  if (mernAfterSqlHtml.includes(mernCourseTitleHtml) && !mernAfterSqlHtml.includes(sqlCourseTitleHtml)) {
    pass("MERN Stack Development course first-byte SEO remains unchanged after SQL work");
  } else fail("MERN Stack Development course first-byte SEO changed by SQL for Data Analysis work");

  const jiraAfterSql = await fetch(`${injOrigin}${JIRA_COURSE_PATH}`);
  const jiraAfterSqlHtml = await jiraAfterSql.text();
  if (jiraAfterSqlHtml.includes(jiraCourseTitleHtml) && !jiraAfterSqlHtml.includes(sqlCourseTitleHtml)) {
    pass("Jira for Project Management course first-byte SEO remains unchanged after SQL work");
  } else fail("Jira for Project Management course first-byte SEO changed by SQL for Data Analysis work");

  const sqlVid = await fetch(`${injOrigin}/Blog/sql-for-data-analysis/videos`);
  const sqlVidHtml = await sqlVid.text();
  if (sqlVid.status === 200 && sqlVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("SQL for Data Analysis /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("SQL for Data Analysis /videos headers changed");
  if (sqlVid.headers.get("link") === `<${canonicalUrl(SQL_COURSE_PATH)}>; rel="canonical"`) {
    pass("SQL for Data Analysis /videos Link header still parent-canonical");
  } else fail("SQL for Data Analysis /videos Link header changed");
  if (!sqlVidHtml.includes(sqlCourseTitleHtml) && !sqlVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("SQL for Data Analysis /videos HTML was not given SQL listing or SMM metadata");
  } else fail("SQL for Data Analysis /videos HTML contains listing metadata");

  const powerBiCourseRes = await fetch(`${injOrigin}${POWER_BI_COURSE_PATH}`);
  const powerBiCourseHtml = await powerBiCourseRes.text();
  if (powerBiCourseRes.status === 200) pass("Express-like /Blog/power-bi-dashboarding returns HTTP 200");
  else fail(`Power BI Dashboarding course HTTP ${powerBiCourseRes.status}`);
  if (powerBiCourseHtml.includes(powerBiCourseTitleHtml) && powerBiCourseHtml.includes(powerBiCourseDescHtml)) {
    pass("Power BI Dashboarding course initial HTML has the new title and description");
  } else fail("Power BI Dashboarding course initial HTML missing title or description");
  if ((powerBiCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("Power BI Dashboarding course initial HTML has one canonical");
  else fail("Power BI Dashboarding course initial HTML canonical count is not 1");
  if (powerBiCourseRes.headers.get("link") === `<${canonicalUrl(POWER_BI_COURSE_PATH)}>; rel="canonical"`) {
    pass("Power BI Dashboarding course response Link header is self-canonical");
  } else fail("Power BI Dashboarding course Link header was incorrect");
  if (powerBiCourseHtml.includes('content="index, follow"') && !powerBiCourseHtml.includes("noindex")) {
    pass("Power BI Dashboarding course initial HTML is index, follow");
  } else fail("Power BI Dashboarding course initial HTML not indexable");
  if (
    powerBiCourseHtml.includes('property="og:title"') &&
    powerBiCourseHtml.includes('property="og:image"') &&
    powerBiCourseHtml.includes('name="twitter:card"') &&
    powerBiCourseHtml.includes("summary_large_image") &&
    powerBiCourseHtml.includes(powerBiOgImageHtml)
  ) {
    pass("Power BI Dashboarding course initial HTML has OG and Twitter metadata");
  } else fail("Power BI Dashboarding course initial HTML missing OG or Twitter metadata");
  if (
    !powerBiCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !powerBiCourseHtml.includes(seoCourseTitleHtml) &&
    !powerBiCourseHtml.includes(semCourseTitleHtml) &&
    !powerBiCourseHtml.includes(smoCourseTitleHtml) &&
    !powerBiCourseHtml.includes(gscCourseTitleHtml) &&
    !powerBiCourseHtml.includes(aimCourseTitleHtml) &&
    !powerBiCourseHtml.includes(aipCourseTitleHtml) &&
    !powerBiCourseHtml.includes(peCourseTitleHtml) &&
    !powerBiCourseHtml.includes(aifCourseTitleHtml) &&
    !powerBiCourseHtml.includes(pyCourseTitleHtml) &&
    !powerBiCourseHtml.includes(dsCourseTitleHtml) &&
    !powerBiCourseHtml.includes(mernCourseTitleHtml) &&
    !powerBiCourseHtml.includes(jiraCourseTitleHtml) &&
    !powerBiCourseHtml.includes(sqlCourseTitleHtml) &&
    !powerBiCourseHtml.includes(tableauCourseTitleHtml) &&
    !powerBiCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Power BI Dashboarding course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN, Jira, SQL, Tableau, or Internships metadata");
  } else fail("Power BI Dashboarding course first-byte HTML mixed another route's metadata");

  const mernAfterPowerBi = await fetch(`${injOrigin}${MERN_STACK_COURSE_PATH}`);
  const mernAfterPowerBiHtml = await mernAfterPowerBi.text();
  if (mernAfterPowerBiHtml.includes(mernCourseTitleHtml) && !mernAfterPowerBiHtml.includes(powerBiCourseTitleHtml)) {
    pass("MERN Stack Development course first-byte SEO remains unchanged after Power BI work");
  } else fail("MERN Stack Development course first-byte SEO changed by Power BI Dashboarding work");

  const jiraAfterPowerBi = await fetch(`${injOrigin}${JIRA_COURSE_PATH}`);
  const jiraAfterPowerBiHtml = await jiraAfterPowerBi.text();
  if (jiraAfterPowerBiHtml.includes(jiraCourseTitleHtml) && !jiraAfterPowerBiHtml.includes(powerBiCourseTitleHtml)) {
    pass("Jira for Project Management course first-byte SEO remains unchanged after Power BI work");
  } else fail("Jira for Project Management course first-byte SEO changed by Power BI Dashboarding work");

  const sqlAfterPowerBi = await fetch(`${injOrigin}${SQL_COURSE_PATH}`);
  const sqlAfterPowerBiHtml = await sqlAfterPowerBi.text();
  if (sqlAfterPowerBiHtml.includes(sqlCourseTitleHtml) && !sqlAfterPowerBiHtml.includes(powerBiCourseTitleHtml)) {
    pass("SQL for Data Analysis course first-byte SEO remains unchanged after Power BI work");
  } else fail("SQL for Data Analysis course first-byte SEO changed by Power BI Dashboarding work");

  const powerBiVid = await fetch(`${injOrigin}/Blog/power-bi-dashboarding/videos`);
  const powerBiVidHtml = await powerBiVid.text();
  if (powerBiVid.status === 200 && powerBiVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Power BI Dashboarding /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("Power BI Dashboarding /videos headers changed");
  if (powerBiVid.headers.get("link") === `<${canonicalUrl(POWER_BI_COURSE_PATH)}>; rel="canonical"`) {
    pass("Power BI Dashboarding /videos Link header still parent-canonical");
  } else fail("Power BI Dashboarding /videos Link header changed");
  if (!powerBiVidHtml.includes(powerBiCourseTitleHtml) && !powerBiVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("Power BI Dashboarding /videos HTML was not given Power BI listing or SMM metadata");
  } else fail("Power BI Dashboarding /videos HTML contains listing metadata");

  const tableauCourseRes = await fetch(`${injOrigin}${TABLEAU_COURSE_PATH}`);
  const tableauCourseHtml = await tableauCourseRes.text();
  if (tableauCourseRes.status === 200) pass("Express-like /Blog/tableau-visualization returns HTTP 200");
  else fail(`Tableau Visualization course HTTP ${tableauCourseRes.status}`);
  if (tableauCourseHtml.includes(tableauCourseTitleHtml) && tableauCourseHtml.includes(tableauCourseDescHtml)) {
    pass("Tableau Visualization course initial HTML has the new title and description");
  } else fail("Tableau Visualization course initial HTML missing title or description");
  if ((tableauCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("Tableau Visualization course initial HTML has one canonical");
  else fail("Tableau Visualization course initial HTML canonical count is not 1");
  if (tableauCourseRes.headers.get("link") === `<${canonicalUrl(TABLEAU_COURSE_PATH)}>; rel="canonical"`) {
    pass("Tableau Visualization course response Link header is self-canonical");
  } else fail("Tableau Visualization course Link header was incorrect");
  if (tableauCourseHtml.includes('content="index, follow"') && !tableauCourseHtml.includes("noindex")) {
    pass("Tableau Visualization course initial HTML is index, follow");
  } else fail("Tableau Visualization course initial HTML not indexable");
  if (
    tableauCourseHtml.includes('property="og:title"') &&
    tableauCourseHtml.includes('property="og:image"') &&
    tableauCourseHtml.includes('name="twitter:card"') &&
    tableauCourseHtml.includes("summary_large_image") &&
    tableauCourseHtml.includes(tableauOgImageHtml)
  ) {
    pass("Tableau Visualization course initial HTML has OG and Twitter metadata");
  } else fail("Tableau Visualization course initial HTML missing OG or Twitter metadata");
  if (
    !tableauCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !tableauCourseHtml.includes(seoCourseTitleHtml) &&
    !tableauCourseHtml.includes(semCourseTitleHtml) &&
    !tableauCourseHtml.includes(smoCourseTitleHtml) &&
    !tableauCourseHtml.includes(gscCourseTitleHtml) &&
    !tableauCourseHtml.includes(aimCourseTitleHtml) &&
    !tableauCourseHtml.includes(aipCourseTitleHtml) &&
    !tableauCourseHtml.includes(peCourseTitleHtml) &&
    !tableauCourseHtml.includes(aifCourseTitleHtml) &&
    !tableauCourseHtml.includes(pyCourseTitleHtml) &&
    !tableauCourseHtml.includes(dsCourseTitleHtml) &&
    !tableauCourseHtml.includes(mernCourseTitleHtml) &&
    !tableauCourseHtml.includes(jiraCourseTitleHtml) &&
    !tableauCourseHtml.includes(sqlCourseTitleHtml) &&
    !tableauCourseHtml.includes(powerBiCourseTitleHtml) &&
    !tableauCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Tableau Visualization course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN, Jira, SQL, Power BI, or Internships metadata");
  } else fail("Tableau Visualization course first-byte HTML mixed another route's metadata");

  const mernAfterTableau = await fetch(`${injOrigin}${MERN_STACK_COURSE_PATH}`);
  const mernAfterTableauHtml = await mernAfterTableau.text();
  if (mernAfterTableauHtml.includes(mernCourseTitleHtml) && !mernAfterTableauHtml.includes(tableauCourseTitleHtml)) {
    pass("MERN Stack Development course first-byte SEO remains unchanged after Tableau work");
  } else fail("MERN Stack Development course first-byte SEO changed by Tableau Visualization work");

  const jiraAfterTableau = await fetch(`${injOrigin}${JIRA_COURSE_PATH}`);
  const jiraAfterTableauHtml = await jiraAfterTableau.text();
  if (jiraAfterTableauHtml.includes(jiraCourseTitleHtml) && !jiraAfterTableauHtml.includes(tableauCourseTitleHtml)) {
    pass("Jira for Project Management course first-byte SEO remains unchanged after Tableau work");
  } else fail("Jira for Project Management course first-byte SEO changed by Tableau Visualization work");

  const sqlAfterTableau = await fetch(`${injOrigin}${SQL_COURSE_PATH}`);
  const sqlAfterTableauHtml = await sqlAfterTableau.text();
  if (sqlAfterTableauHtml.includes(sqlCourseTitleHtml) && !sqlAfterTableauHtml.includes(tableauCourseTitleHtml)) {
    pass("SQL for Data Analysis course first-byte SEO remains unchanged after Tableau work");
  } else fail("SQL for Data Analysis course first-byte SEO changed by Tableau Visualization work");

  const powerBiAfterTableau = await fetch(`${injOrigin}${POWER_BI_COURSE_PATH}`);
  const powerBiAfterTableauHtml = await powerBiAfterTableau.text();
  if (powerBiAfterTableauHtml.includes(powerBiCourseTitleHtml) && !powerBiAfterTableauHtml.includes(tableauCourseTitleHtml)) {
    pass("Power BI Dashboarding course first-byte SEO remains unchanged after Tableau work");
  } else fail("Power BI Dashboarding course first-byte SEO changed by Tableau Visualization work");

  const tableauVid = await fetch(`${injOrigin}/Blog/tableau-visualization/videos`);
  const tableauVidHtml = await tableauVid.text();
  if (tableauVid.status === 200 && tableauVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Tableau Visualization /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("Tableau Visualization /videos headers changed");
  if (tableauVid.headers.get("link") === `<${canonicalUrl(TABLEAU_COURSE_PATH)}>; rel="canonical"`) {
    pass("Tableau Visualization /videos Link header still parent-canonical");
  } else fail("Tableau Visualization /videos Link header changed");
  if (!tableauVidHtml.includes(tableauCourseTitleHtml) && !tableauVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("Tableau Visualization /videos HTML was not given Tableau listing or SMM metadata");
  } else fail("Tableau Visualization /videos HTML contains listing metadata");

  const pythonForAnalyticsCourseRes = await fetch(`${injOrigin}${PYTHON_FOR_ANALYTICS_COURSE_PATH}`);
  const pythonForAnalyticsCourseHtml = await pythonForAnalyticsCourseRes.text();
  if (pythonForAnalyticsCourseRes.status === 200) pass("Express-like /Blog/python-for-analytics returns HTTP 200");
  else fail(`Python for Analytics course HTTP ${pythonForAnalyticsCourseRes.status}`);
  if (pythonForAnalyticsCourseHtml.includes(pythonForAnalyticsCourseTitleHtml) && pythonForAnalyticsCourseHtml.includes(pythonForAnalyticsCourseDescHtml)) {
    pass("Python for Analytics course initial HTML has the new title and description");
  } else fail("Python for Analytics course initial HTML missing title or description");
  if ((pythonForAnalyticsCourseHtml.match(/rel="canonical"/g) || []).length === 1) pass("Python for Analytics course initial HTML has one canonical");
  else fail("Python for Analytics course initial HTML canonical count is not 1");
  if (pythonForAnalyticsCourseRes.headers.get("link") === `<${canonicalUrl(PYTHON_FOR_ANALYTICS_COURSE_PATH)}>; rel="canonical"`) {
    pass("Python for Analytics course response Link header is self-canonical");
  } else fail("Python for Analytics course Link header was incorrect");
  if (pythonForAnalyticsCourseHtml.includes('content="index, follow"') && !pythonForAnalyticsCourseHtml.includes("noindex")) {
    pass("Python for Analytics course initial HTML is index, follow");
  } else fail("Python for Analytics course initial HTML not indexable");
  if (
    pythonForAnalyticsCourseHtml.includes('property="og:title"') &&
    pythonForAnalyticsCourseHtml.includes('property="og:image"') &&
    pythonForAnalyticsCourseHtml.includes('name="twitter:card"') &&
    pythonForAnalyticsCourseHtml.includes("summary_large_image") &&
    pythonForAnalyticsCourseHtml.includes(pythonForAnalyticsOgImageHtml)
  ) {
    pass("Python for Analytics course initial HTML has OG and Twitter metadata");
  } else fail("Python for Analytics course initial HTML missing OG or Twitter metadata");
  if (
    !pythonForAnalyticsCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !pythonForAnalyticsCourseHtml.includes(seoCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(semCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(smoCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(gscCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(aimCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(aipCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(peCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(aifCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(pyCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(dsCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(mernCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(jiraCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(sqlCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(powerBiCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(tableauCourseTitleHtml) &&
    !pythonForAnalyticsCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Python for Analytics course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN, Jira, SQL, Power BI, Tableau, or Internships metadata");
  } else fail("Python for Analytics course first-byte HTML mixed another route's metadata");

  const pythonProgrammingAfterPfa = await fetch(`${injOrigin}${PYTHON_PROGRAMMING_COURSE_PATH}`);
  const pythonProgrammingAfterPfaHtml = await pythonProgrammingAfterPfa.text();
  if (pythonProgrammingAfterPfaHtml.includes(pyCourseTitleHtml) && !pythonProgrammingAfterPfaHtml.includes(pythonForAnalyticsCourseTitleHtml)) {
    pass("Python Programming course first-byte SEO remains unchanged after Python for Analytics work");
  } else fail("Python Programming course first-byte SEO changed by Python for Analytics work");

  const mernAfterPfa = await fetch(`${injOrigin}${MERN_STACK_COURSE_PATH}`);
  const mernAfterPfaHtml = await mernAfterPfa.text();
  if (mernAfterPfaHtml.includes(mernCourseTitleHtml) && !mernAfterPfaHtml.includes(pythonForAnalyticsCourseTitleHtml)) {
    pass("MERN Stack Development course first-byte SEO remains unchanged after Python for Analytics work");
  } else fail("MERN Stack Development course first-byte SEO changed by Python for Analytics work");

  const jiraAfterPfa = await fetch(`${injOrigin}${JIRA_COURSE_PATH}`);
  const jiraAfterPfaHtml = await jiraAfterPfa.text();
  if (jiraAfterPfaHtml.includes(jiraCourseTitleHtml) && !jiraAfterPfaHtml.includes(pythonForAnalyticsCourseTitleHtml)) {
    pass("Jira for Project Management course first-byte SEO remains unchanged after Python for Analytics work");
  } else fail("Jira for Project Management course first-byte SEO changed by Python for Analytics work");

  const sqlAfterPfa = await fetch(`${injOrigin}${SQL_COURSE_PATH}`);
  const sqlAfterPfaHtml = await sqlAfterPfa.text();
  if (sqlAfterPfaHtml.includes(sqlCourseTitleHtml) && !sqlAfterPfaHtml.includes(pythonForAnalyticsCourseTitleHtml)) {
    pass("SQL for Data Analysis course first-byte SEO remains unchanged after Python for Analytics work");
  } else fail("SQL for Data Analysis course first-byte SEO changed by Python for Analytics work");

  const powerBiAfterPfa = await fetch(`${injOrigin}${POWER_BI_COURSE_PATH}`);
  const powerBiAfterPfaHtml = await powerBiAfterPfa.text();
  if (powerBiAfterPfaHtml.includes(powerBiCourseTitleHtml) && !powerBiAfterPfaHtml.includes(pythonForAnalyticsCourseTitleHtml)) {
    pass("Power BI Dashboarding course first-byte SEO remains unchanged after Python for Analytics work");
  } else fail("Power BI Dashboarding course first-byte SEO changed by Python for Analytics work");

  const tableauAfterPfa = await fetch(`${injOrigin}${TABLEAU_COURSE_PATH}`);
  const tableauAfterPfaHtml = await tableauAfterPfa.text();
  if (tableauAfterPfaHtml.includes(tableauCourseTitleHtml) && !tableauAfterPfaHtml.includes(pythonForAnalyticsCourseTitleHtml)) {
    pass("Tableau Visualization course first-byte SEO remains unchanged after Python for Analytics work");
  } else fail("Tableau Visualization course first-byte SEO changed by Python for Analytics work");

  const pythonForAnalyticsVid = await fetch(`${injOrigin}/Blog/python-for-analytics/videos`);
  const pythonForAnalyticsVidHtml = await pythonForAnalyticsVid.text();
  if (pythonForAnalyticsVid.status === 200 && pythonForAnalyticsVid.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Python for Analytics /videos still 200 with X-Robots-Tag noindex, nofollow");
  } else fail("Python for Analytics /videos headers changed");
  if (pythonForAnalyticsVid.headers.get("link") === `<${canonicalUrl(PYTHON_FOR_ANALYTICS_COURSE_PATH)}>; rel="canonical"`) {
    pass("Python for Analytics /videos Link header still parent-canonical");
  } else fail("Python for Analytics /videos Link header changed");
  if (!pythonForAnalyticsVidHtml.includes(pythonForAnalyticsCourseTitleHtml) && !pythonForAnalyticsVidHtml.includes(SMM_COURSE_SEO.title)) {
    pass("Python for Analytics /videos HTML was not given Python for Analytics listing or SMM metadata");
  } else fail("Python for Analytics /videos HTML contains listing metadata");

  const developmentBundleRes = await fetch(`${injOrigin}${DEVELOPMENT_BUNDLE_PATH}`);
  const developmentBundleHtml = await developmentBundleRes.text();
  if (developmentBundleRes.status === 200) pass("Express-like /Bundles/development returns HTTP 200");
  else fail(`Development Bundle HTTP ${developmentBundleRes.status}`);
  if (developmentBundleHtml.includes(devBundleTitleHtml) && developmentBundleHtml.includes(devBundleDescHtml)) {
    pass("Development Bundle initial HTML has the approved title and description");
  } else fail("Development Bundle initial HTML missing title or description");
  if ((developmentBundleHtml.match(/rel="canonical"/g) || []).length === 1) pass("Development Bundle initial HTML has one canonical");
  else fail("Development Bundle initial HTML canonical count is not 1");
  if (developmentBundleRes.headers.get("link") === `<${canonicalUrl(DEVELOPMENT_BUNDLE_PATH)}>; rel="canonical"`) {
    pass("Development Bundle response Link header is self-canonical");
  } else fail("Development Bundle Link header was incorrect");
  if (developmentBundleHtml.includes('content="index, follow"') && !developmentBundleHtml.includes("noindex")) {
    pass("Development Bundle initial HTML is index, follow");
  } else fail("Development Bundle initial HTML not indexable");
  if (
    developmentBundleHtml.includes('property="og:title"') &&
    developmentBundleHtml.includes('property="og:image"') &&
    developmentBundleHtml.includes('name="twitter:card"') &&
    developmentBundleHtml.includes("summary_large_image") &&
    developmentBundleHtml.includes(devBundleOgImageHtml) &&
    (developmentBundleHtml.match(/data-rh="true"/g) || []).length === 12
  ) {
    pass("Development Bundle initial HTML has OG, Twitter, and data-rh metadata");
  } else fail("Development Bundle initial HTML missing OG, Twitter, or data-rh metadata");
  if (
    !developmentBundleHtml.includes(SMM_COURSE_SEO.title) &&
    !developmentBundleHtml.includes(pythonForAnalyticsCourseTitleHtml) &&
    !developmentBundleHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Development Bundle first-byte HTML does not reuse course or internships metadata");
  } else fail("Development Bundle first-byte HTML mixed another route's metadata");

  const aiBundleAfterDev = await fetch(`${injOrigin}/Bundles/ai`);
  const aiBundleAfterDevHtml = await aiBundleAfterDev.text();
  if (!aiBundleAfterDevHtml.includes(devBundleTitleHtml) && !aiBundleAfterDevHtml.includes(devBundleDescHtml)) {
    pass("AI bundle first-byte HTML remains unchanged after Development Bundle work");
  } else fail("AI bundle first-byte HTML picked up Development Bundle metadata");

  const analyticsBundleAfterDev = await fetch(`${injOrigin}/Bundles/analytics`);
  const analyticsBundleAfterDevHtml = await analyticsBundleAfterDev.text();
  if (!analyticsBundleAfterDevHtml.includes(devBundleTitleHtml)) {
    pass("Analytics bundle first-byte HTML remains unchanged after Development Bundle work");
  } else fail("Analytics bundle first-byte HTML picked up Development Bundle metadata");

  const marketingBundleAfterDev = await fetch(`${injOrigin}/Bundles/marketing`);
  const marketingBundleAfterDevHtml = await marketingBundleAfterDev.text();
  if (!marketingBundleAfterDevHtml.includes(devBundleTitleHtml)) {
    pass("Marketing bundle first-byte HTML remains unchanged after Development Bundle work");
  } else fail("Marketing bundle first-byte HTML picked up Development Bundle metadata");

  const pythonAfterDevBundle = await fetch(`${injOrigin}${PYTHON_PROGRAMMING_COURSE_PATH}`);
  const pythonAfterDevBundleHtml = await pythonAfterDevBundle.text();
  if (pythonAfterDevBundleHtml.includes(pyCourseTitleHtml) && !pythonAfterDevBundleHtml.includes(devBundleTitleHtml)) {
    pass("Python Programming course first-byte SEO remains unchanged after Development Bundle work");
  } else fail("Python Programming course first-byte SEO changed by Development Bundle work");

  const homeAfterDevBundle = await fetch(`${injOrigin}/`);
  const homeAfterDevBundleHtml = await homeAfterDevBundle.text();
  if (!homeAfterDevBundleHtml.includes(devBundleTitleHtml) && !homeAfterDevBundleHtml.includes(devBundleDescHtml)) {
    pass("Homepage first-byte HTML remains unchanged after Development Bundle work");
  } else fail("Homepage first-byte HTML picked up Development Bundle metadata");

  const videosAfterDevBundle = await fetch(`${injOrigin}/Blog/python-programming/videos`);
  const videosAfterDevBundleHtml = await videosAfterDevBundle.text();
  if (videosAfterDevBundle.status === 200 && videosAfterDevBundle.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Generic /videos route still 200 with X-Robots-Tag noindex, nofollow after Development Bundle work");
  } else fail("Generic /videos headers changed by Development Bundle work");
  if (!videosAfterDevBundleHtml.includes(devBundleTitleHtml)) {
    pass("Generic /videos HTML was not given Development Bundle metadata");
  } else fail("Generic /videos HTML contains Development Bundle metadata");

  const aiBundleRes = await fetch(`${injOrigin}${AI_BUNDLE_PATH}`);
  const aiBundleHtml = await aiBundleRes.text();
  if (aiBundleRes.status === 200) pass("Express-like /Bundles/ai returns HTTP 200");
  else fail(`AI Bundle HTTP ${aiBundleRes.status}`);
  if (aiBundleHtml.includes(aiBundleTitleHtml) && aiBundleHtml.includes(aiBundleDescHtml)) {
    pass("AI Bundle initial HTML has the approved title and description");
  } else fail("AI Bundle initial HTML missing title or description");
  if ((aiBundleHtml.match(/rel="canonical"/g) || []).length === 1) pass("AI Bundle initial HTML has one canonical");
  else fail("AI Bundle initial HTML canonical count is not 1");
  if (aiBundleRes.headers.get("link") === `<${canonicalUrl(AI_BUNDLE_PATH)}>; rel="canonical"`) {
    pass("AI Bundle response Link header is self-canonical");
  } else fail("AI Bundle Link header was incorrect");
  if (aiBundleHtml.includes('content="index, follow"') && !aiBundleHtml.includes("noindex")) {
    pass("AI Bundle initial HTML is index, follow");
  } else fail("AI Bundle initial HTML not indexable");
  if (
    aiBundleHtml.includes('property="og:title"') &&
    aiBundleHtml.includes('property="og:image"') &&
    aiBundleHtml.includes('name="twitter:card"') &&
    aiBundleHtml.includes("summary_large_image") &&
    aiBundleHtml.includes(aiBundleOgImageHtml) &&
    (aiBundleHtml.match(/data-rh="true"/g) || []).length === 12
  ) {
    pass("AI Bundle initial HTML has OG, Twitter, and data-rh metadata");
  } else fail("AI Bundle initial HTML missing OG, Twitter, or data-rh metadata");
  if (!aiBundleHtml.includes(devBundleTitleHtml) && !aiBundleHtml.includes(SMM_COURSE_SEO.title) && !aiBundleHtml.includes(INTERNSHIPS_LISTING_SEO.title)) {
    pass("AI Bundle first-byte HTML does not reuse Development, course, or internships metadata");
  } else fail("AI Bundle first-byte HTML mixed another route's metadata");

  const developmentAfterAi = await fetch(`${injOrigin}${DEVELOPMENT_BUNDLE_PATH}`);
  const developmentAfterAiHtml = await developmentAfterAi.text();
  if (developmentAfterAiHtml.includes(devBundleTitleHtml) && !developmentAfterAiHtml.includes(aiBundleTitleHtml)) {
    pass("Development Bundle first-byte SEO remains unchanged after AI Bundle work");
  } else fail("Development Bundle first-byte SEO changed by AI Bundle work");

  const analyticsAfterAi = await fetch(`${injOrigin}/Bundles/analytics`);
  const analyticsAfterAiHtml = await analyticsAfterAi.text();
  if (!analyticsAfterAiHtml.includes(aiBundleTitleHtml) && !analyticsAfterAiHtml.includes(aiBundleDescHtml)) {
    pass("Analytics bundle first-byte HTML remains unchanged after AI Bundle work");
  } else fail("Analytics bundle first-byte HTML picked up AI Bundle metadata");

  const marketingAfterAi = await fetch(`${injOrigin}/Bundles/marketing`);
  const marketingAfterAiHtml = await marketingAfterAi.text();
  if (!marketingAfterAiHtml.includes(aiBundleTitleHtml)) {
    pass("Marketing bundle first-byte HTML remains unchanged after AI Bundle work");
  } else fail("Marketing bundle first-byte HTML picked up AI Bundle metadata");

  const pythonAfterAiBundle = await fetch(`${injOrigin}${PYTHON_PROGRAMMING_COURSE_PATH}`);
  const pythonAfterAiBundleHtml = await pythonAfterAiBundle.text();
  if (pythonAfterAiBundleHtml.includes(pyCourseTitleHtml) && !pythonAfterAiBundleHtml.includes(aiBundleTitleHtml)) {
    pass("Python Programming course first-byte SEO remains unchanged after AI Bundle work");
  } else fail("Python Programming course first-byte SEO changed by AI Bundle work");

  const aifAfterAiBundle = await fetch(`${injOrigin}${AI_FUNDAMENTALS_COURSE_PATH}`);
  const aifAfterAiBundleHtml = await aifAfterAiBundle.text();
  if (aifAfterAiBundleHtml.includes(aifCourseTitleHtml) && !aifAfterAiBundleHtml.includes(aiBundleTitleHtml)) {
    pass("AI Fundamentals course first-byte SEO remains unchanged after AI Bundle work");
  } else fail("AI Fundamentals course first-byte SEO changed by AI Bundle work");

  const homeAfterAiBundle = await fetch(`${injOrigin}/`);
  const homeAfterAiBundleHtml = await homeAfterAiBundle.text();
  if (!homeAfterAiBundleHtml.includes(aiBundleTitleHtml) && !homeAfterAiBundleHtml.includes(aiBundleDescHtml)) {
    pass("Homepage first-byte HTML remains unchanged after AI Bundle work");
  } else fail("Homepage first-byte HTML picked up AI Bundle metadata");

  const videosAfterAiBundle = await fetch(`${injOrigin}/Blog/python-programming/videos`);
  const videosAfterAiBundleHtml = await videosAfterAiBundle.text();
  if (videosAfterAiBundle.status === 200 && videosAfterAiBundle.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Generic /videos route still 200 with X-Robots-Tag noindex, nofollow after AI Bundle work");
  } else fail("Generic /videos headers changed by AI Bundle work");
  if (!videosAfterAiBundleHtml.includes(aiBundleTitleHtml) && !videosAfterAiBundleHtml.includes(devBundleTitleHtml)) {
    pass("Generic /videos HTML was not given AI or Development Bundle metadata");
  } else fail("Generic /videos HTML contains bundle metadata");

  const analyticsBundleRes = await fetch(`${injOrigin}${ANALYTICS_BUNDLE_PATH}`);
  const analyticsBundleHtml = await analyticsBundleRes.text();
  if (analyticsBundleRes.status === 200) pass("Express-like /Bundles/analytics returns HTTP 200");
  else fail(`Analytics Bundle HTTP ${analyticsBundleRes.status}`);
  if (analyticsBundleHtml.includes(analyticsBundleTitleHtml) && analyticsBundleHtml.includes(analyticsBundleDescHtml)) {
    pass("Analytics Bundle initial HTML has the approved title and description");
  } else fail("Analytics Bundle initial HTML missing title or description");
  if ((analyticsBundleHtml.match(/rel="canonical"/g) || []).length === 1) pass("Analytics Bundle initial HTML has one canonical");
  else fail("Analytics Bundle initial HTML canonical count is not 1");
  if (analyticsBundleRes.headers.get("link") === `<${canonicalUrl(ANALYTICS_BUNDLE_PATH)}>; rel="canonical"`) {
    pass("Analytics Bundle response Link header is self-canonical");
  } else fail("Analytics Bundle Link header was incorrect");
  if (analyticsBundleHtml.includes('content="index, follow"') && !analyticsBundleHtml.includes("noindex")) {
    pass("Analytics Bundle initial HTML is index, follow");
  } else fail("Analytics Bundle initial HTML not indexable");
  if (
    analyticsBundleHtml.includes('property="og:title"') &&
    analyticsBundleHtml.includes('property="og:image"') &&
    analyticsBundleHtml.includes('name="twitter:card"') &&
    analyticsBundleHtml.includes("summary_large_image") &&
    analyticsBundleHtml.includes(analyticsBundleOgImageHtml) &&
    (analyticsBundleHtml.match(/data-rh="true"/g) || []).length === 12
  ) {
    pass("Analytics Bundle initial HTML has OG, Twitter, and data-rh metadata");
  } else fail("Analytics Bundle initial HTML missing OG, Twitter, or data-rh metadata");
  if (
    !analyticsBundleHtml.includes(devBundleTitleHtml) &&
    !analyticsBundleHtml.includes(aiBundleTitleHtml) &&
    !analyticsBundleHtml.includes(SMM_COURSE_SEO.title) &&
    !analyticsBundleHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Analytics Bundle first-byte HTML does not reuse Development, AI, course, or internships metadata");
  } else fail("Analytics Bundle first-byte HTML mixed another route's metadata");

  const developmentAfterAnalytics = await fetch(`${injOrigin}${DEVELOPMENT_BUNDLE_PATH}`);
  const developmentAfterAnalyticsHtml = await developmentAfterAnalytics.text();
  if (developmentAfterAnalyticsHtml.includes(devBundleTitleHtml) && !developmentAfterAnalyticsHtml.includes(analyticsBundleTitleHtml)) {
    pass("Development Bundle first-byte SEO remains unchanged after Analytics Bundle work");
  } else fail("Development Bundle first-byte SEO changed by Analytics Bundle work");

  const aiAfterAnalytics = await fetch(`${injOrigin}${AI_BUNDLE_PATH}`);
  const aiAfterAnalyticsHtml = await aiAfterAnalytics.text();
  if (aiAfterAnalyticsHtml.includes(aiBundleTitleHtml) && !aiAfterAnalyticsHtml.includes(analyticsBundleTitleHtml)) {
    pass("AI Bundle first-byte SEO remains unchanged after Analytics Bundle work");
  } else fail("AI Bundle first-byte SEO changed by Analytics Bundle work");

  const marketingAfterAnalytics = await fetch(`${injOrigin}/Bundles/marketing`);
  const marketingAfterAnalyticsHtml = await marketingAfterAnalytics.text();
  if (!marketingAfterAnalyticsHtml.includes(analyticsBundleTitleHtml) && !marketingAfterAnalyticsHtml.includes(analyticsBundleDescHtml)) {
    pass("Marketing bundle first-byte HTML remains unchanged after Analytics Bundle work");
  } else fail("Marketing bundle first-byte HTML picked up Analytics Bundle metadata");

  const sqlAfterAnalytics = await fetch(`${injOrigin}${SQL_COURSE_PATH}`);
  const sqlAfterAnalyticsHtml = await sqlAfterAnalytics.text();
  if (sqlAfterAnalyticsHtml.includes(sqlCourseTitleHtml) && !sqlAfterAnalyticsHtml.includes(analyticsBundleTitleHtml)) {
    pass("SQL for Data Analysis course first-byte SEO remains unchanged after Analytics Bundle work");
  } else fail("SQL for Data Analysis course first-byte SEO changed by Analytics Bundle work");

  const pythonAfterAnalyticsBundle = await fetch(`${injOrigin}${PYTHON_PROGRAMMING_COURSE_PATH}`);
  const pythonAfterAnalyticsBundleHtml = await pythonAfterAnalyticsBundle.text();
  if (pythonAfterAnalyticsBundleHtml.includes(pyCourseTitleHtml) && !pythonAfterAnalyticsBundleHtml.includes(analyticsBundleTitleHtml)) {
    pass("Python Programming course first-byte SEO remains unchanged after Analytics Bundle work");
  } else fail("Python Programming course first-byte SEO changed by Analytics Bundle work");

  const internshipsAfterAnalytics = await fetch(`${injOrigin}/Internships`);
  const internshipsAfterAnalyticsHtml = await internshipsAfterAnalytics.text();
  if (internshipsAfterAnalyticsHtml.includes(INTERNSHIPS_LISTING_SEO.title) && !internshipsAfterAnalyticsHtml.includes(analyticsBundleTitleHtml)) {
    pass("Internships listing first-byte SEO remains unchanged after Analytics Bundle work");
  } else fail("Internships listing first-byte SEO changed by Analytics Bundle work");

  const internshipAnalyticsAfterBundle = await fetch(`${injOrigin}/Internships/analytics`);
  const internshipAnalyticsAfterBundleHtml = await internshipAnalyticsAfterBundle.text();
  if (!internshipAnalyticsAfterBundleHtml.includes(analyticsBundleTitleHtml) && !internshipAnalyticsAfterBundleHtml.includes(analyticsBundleDescHtml)) {
    pass("/Internships/analytics first-byte HTML does not inherit Analytics Bundle metadata");
  } else fail("/Internships/analytics first-byte HTML picked up Analytics Bundle metadata");

  const homeAfterAnalyticsBundle = await fetch(`${injOrigin}/`);
  const homeAfterAnalyticsBundleHtml = await homeAfterAnalyticsBundle.text();
  if (!homeAfterAnalyticsBundleHtml.includes(analyticsBundleTitleHtml) && !homeAfterAnalyticsBundleHtml.includes(analyticsBundleDescHtml)) {
    pass("Homepage first-byte HTML remains unchanged after Analytics Bundle work");
  } else fail("Homepage first-byte HTML picked up Analytics Bundle metadata");

  const videosAfterAnalyticsBundle = await fetch(`${injOrigin}/Blog/sql-for-data-analysis/videos`);
  const videosAfterAnalyticsBundleHtml = await videosAfterAnalyticsBundle.text();
  if (videosAfterAnalyticsBundle.status === 200 && videosAfterAnalyticsBundle.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("SQL /videos route still 200 with X-Robots-Tag noindex, nofollow after Analytics Bundle work");
  } else fail("SQL /videos headers changed by Analytics Bundle work");
  if (!videosAfterAnalyticsBundleHtml.includes(analyticsBundleTitleHtml) && !videosAfterAnalyticsBundleHtml.includes(devBundleTitleHtml) && !videosAfterAnalyticsBundleHtml.includes(aiBundleTitleHtml)) {
    pass("SQL /videos HTML was not given Analytics, AI, or Development Bundle metadata");
  } else fail("SQL /videos HTML contains bundle metadata");

  const marketingBundleRes = await fetch(`${injOrigin}${MARKETING_BUNDLE_PATH}`);
  const marketingBundleHtml = await marketingBundleRes.text();
  if (marketingBundleRes.status === 200) pass("Express-like /Bundles/marketing returns HTTP 200");
  else fail(`Marketing Bundle HTTP ${marketingBundleRes.status}`);
  if (marketingBundleHtml.includes(marketingBundleTitleHtml) && marketingBundleHtml.includes(marketingBundleDescHtml)) {
    pass("Marketing Bundle initial HTML has the approved title and description");
  } else fail("Marketing Bundle initial HTML missing title or description");
  if ((marketingBundleHtml.match(/rel="canonical"/g) || []).length === 1) pass("Marketing Bundle initial HTML has one canonical");
  else fail("Marketing Bundle initial HTML canonical count is not 1");
  if (marketingBundleRes.headers.get("link") === `<${canonicalUrl(MARKETING_BUNDLE_PATH)}>; rel="canonical"`) {
    pass("Marketing Bundle response Link header is self-canonical");
  } else fail("Marketing Bundle Link header was incorrect");
  if (marketingBundleHtml.includes('content="index, follow"') && !marketingBundleHtml.includes("noindex")) {
    pass("Marketing Bundle initial HTML is index, follow");
  } else fail("Marketing Bundle initial HTML not indexable");
  if (
    marketingBundleHtml.includes('property="og:title"') &&
    marketingBundleHtml.includes('property="og:image"') &&
    marketingBundleHtml.includes('name="twitter:card"') &&
    marketingBundleHtml.includes("summary_large_image") &&
    marketingBundleHtml.includes(marketingBundleOgImageHtml) &&
    (marketingBundleHtml.match(/data-rh="true"/g) || []).length === 12
  ) {
    pass("Marketing Bundle initial HTML has OG, Twitter, and data-rh metadata");
  } else fail("Marketing Bundle initial HTML missing OG, Twitter, or data-rh metadata");
  if (
    !marketingBundleHtml.includes(devBundleTitleHtml) &&
    !marketingBundleHtml.includes(aiBundleTitleHtml) &&
    !marketingBundleHtml.includes(analyticsBundleTitleHtml) &&
    !marketingBundleHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("Marketing Bundle first-byte HTML does not reuse Development, AI, Analytics, or internships metadata");
  } else fail("Marketing Bundle first-byte HTML mixed another route's metadata");

  const developmentAfterMarketing = await fetch(`${injOrigin}${DEVELOPMENT_BUNDLE_PATH}`);
  const developmentAfterMarketingHtml = await developmentAfterMarketing.text();
  if (developmentAfterMarketingHtml.includes(devBundleTitleHtml) && !developmentAfterMarketingHtml.includes(marketingBundleTitleHtml)) {
    pass("Development Bundle first-byte SEO remains unchanged after Marketing Bundle work");
  } else fail("Development Bundle first-byte SEO changed by Marketing Bundle work");

  const aiAfterMarketing = await fetch(`${injOrigin}${AI_BUNDLE_PATH}`);
  const aiAfterMarketingHtml = await aiAfterMarketing.text();
  if (aiAfterMarketingHtml.includes(aiBundleTitleHtml) && !aiAfterMarketingHtml.includes(marketingBundleTitleHtml)) {
    pass("AI Bundle first-byte SEO remains unchanged after Marketing Bundle work");
  } else fail("AI Bundle first-byte SEO changed by Marketing Bundle work");

  const analyticsAfterMarketing = await fetch(`${injOrigin}${ANALYTICS_BUNDLE_PATH}`);
  const analyticsAfterMarketingHtml = await analyticsAfterMarketing.text();
  if (analyticsAfterMarketingHtml.includes(analyticsBundleTitleHtml) && !analyticsAfterMarketingHtml.includes(marketingBundleTitleHtml)) {
    pass("Analytics Bundle first-byte SEO remains unchanged after Marketing Bundle work");
  } else fail("Analytics Bundle first-byte SEO changed by Marketing Bundle work");

  const seoAfterMarketing = await fetch(`${injOrigin}${SEO_COURSE_PATH}`);
  const seoAfterMarketingHtml = await seoAfterMarketing.text();
  if (seoAfterMarketingHtml.includes(seoCourseTitleHtml) && !seoAfterMarketingHtml.includes(marketingBundleTitleHtml)) {
    pass("SEO course first-byte SEO remains unchanged after Marketing Bundle work");
  } else fail("SEO course first-byte SEO changed by Marketing Bundle work");

  const smmAfterMarketing = await fetch(`${injOrigin}${SMM_COURSE_PATH}`);
  const smmAfterMarketingHtml = await smmAfterMarketing.text();
  if (smmAfterMarketingHtml.includes(smmTitleHtml) && !smmAfterMarketingHtml.includes(marketingBundleTitleHtml)) {
    pass("SMM course first-byte SEO remains unchanged after Marketing Bundle work");
  } else fail("SMM course first-byte SEO changed by Marketing Bundle work");

  const internshipsAfterMarketing = await fetch(`${injOrigin}/Internships`);
  const internshipsAfterMarketingHtml = await internshipsAfterMarketing.text();
  if (internshipsAfterMarketingHtml.includes(INTERNSHIPS_LISTING_SEO.title) && !internshipsAfterMarketingHtml.includes(marketingBundleTitleHtml)) {
    pass("Internships listing first-byte SEO remains unchanged after Marketing Bundle work");
  } else fail("Internships listing first-byte SEO changed by Marketing Bundle work");

  const internshipMarketingAfterBundle = await fetch(`${injOrigin}/Internships/marketing`);
  const internshipMarketingAfterBundleHtml = await internshipMarketingAfterBundle.text();
  if (!internshipMarketingAfterBundleHtml.includes(marketingBundleTitleHtml) && !internshipMarketingAfterBundleHtml.includes(marketingBundleDescHtml)) {
    pass("/Internships/marketing first-byte HTML does not inherit Marketing Bundle metadata");
  } else fail("/Internships/marketing first-byte HTML picked up Marketing Bundle metadata");

  const homeAfterMarketingBundle = await fetch(`${injOrigin}/`);
  const homeAfterMarketingBundleHtml = await homeAfterMarketingBundle.text();
  if (!homeAfterMarketingBundleHtml.includes(marketingBundleTitleHtml) && !homeAfterMarketingBundleHtml.includes(marketingBundleDescHtml)) {
    pass("Homepage first-byte HTML remains unchanged after Marketing Bundle work");
  } else fail("Homepage first-byte HTML picked up Marketing Bundle metadata");

  const videosAfterMarketingBundle = await fetch(`${injOrigin}/Blog/seo-search-engine-optimization/videos`);
  const videosAfterMarketingBundleHtml = await videosAfterMarketingBundle.text();
  if (videosAfterMarketingBundle.status === 200 && videosAfterMarketingBundle.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("SEO /videos route still 200 with X-Robots-Tag noindex, nofollow after Marketing Bundle work");
  } else fail("SEO /videos headers changed by Marketing Bundle work");
  if (
    !videosAfterMarketingBundleHtml.includes(marketingBundleTitleHtml) &&
    !videosAfterMarketingBundleHtml.includes(devBundleTitleHtml) &&
    !videosAfterMarketingBundleHtml.includes(aiBundleTitleHtml) &&
    !videosAfterMarketingBundleHtml.includes(analyticsBundleTitleHtml)
  ) {
    pass("SEO /videos HTML was not given Marketing, Analytics, AI, or Development Bundle metadata");
  } else fail("SEO /videos HTML contains bundle metadata");

  const developmentInternRes = await fetch(`${injOrigin}${DEVELOPMENT_INTERNSHIP_PATH}`);
  const developmentInternHtml = await developmentInternRes.text();
  if (developmentInternRes.status === 200) pass("Express-like /Internships/development returns HTTP 200");
  else fail(`Development Internship HTTP ${developmentInternRes.status}`);
  if (developmentInternHtml.includes(developmentInternTitleHtml) && developmentInternHtml.includes(developmentInternDescHtml)) {
    pass("Development Internship initial HTML has the approved title and description");
  } else fail("Development Internship initial HTML missing title or description");
  if ((developmentInternHtml.match(/rel="canonical"/g) || []).length === 1) pass("Development Internship injected HTML has one canonical");
  else fail("Development Internship injected HTML canonical count is not 1");
  if (developmentInternRes.headers.get("link") === `<${canonicalUrl(DEVELOPMENT_INTERNSHIP_PATH)}>; rel="canonical"`) {
    pass("Development Internship response Link header is self-canonical");
  } else fail("Development Internship Link header was incorrect");
  if (developmentInternHtml.includes('content="index, follow"') && !developmentInternHtml.includes("noindex")) {
    pass("Development Internship initial HTML is index, follow");
  } else fail("Development Internship initial HTML not indexable");
  if (
    developmentInternHtml.includes('property="og:title"') &&
    developmentInternHtml.includes('property="og:image"') &&
    developmentInternHtml.includes('name="twitter:card"') &&
    developmentInternHtml.includes("summary_large_image") &&
    developmentInternHtml.includes(developmentInternOgImageHtml) &&
    (developmentInternHtml.match(/data-rh="true"/g) || []).length === 12
  ) {
    pass("Development Internship initial HTML has OG, Twitter, and data-rh metadata");
  } else fail("Development Internship initial HTML missing OG, Twitter, or data-rh metadata");
  if (
    !developmentInternHtml.includes(devBundleTitleHtml) &&
    !developmentInternHtml.includes(aiBundleTitleHtml) &&
    !developmentInternHtml.includes(analyticsBundleTitleHtml) &&
    !developmentInternHtml.includes(marketingBundleTitleHtml) &&
    !developmentInternHtml.includes(INTERNSHIPS_LISTING_SEO.title) &&
    !developmentInternHtml.includes(pyCourseTitleHtml) &&
    !developmentInternHtml.includes(mernCourseTitleHtml)
  ) {
    pass("Development Internship first-byte HTML does not reuse bundle, listing, Python, or MERN metadata");
  } else fail("Development Internship first-byte HTML mixed another route's metadata");

  const internshipsAfterDevelopmentIntern = await fetch(`${injOrigin}/Internships`);
  const internshipsAfterDevelopmentInternHtml = await internshipsAfterDevelopmentIntern.text();
  if (
    internshipsAfterDevelopmentInternHtml.includes(INTERNSHIPS_LISTING_SEO.title) &&
    !internshipsAfterDevelopmentInternHtml.includes(developmentInternTitleHtml)
  ) {
    pass("Internships listing first-byte SEO remains unchanged after Development Internship work");
  } else fail("Internships listing first-byte SEO changed by Development Internship work");

  const internshipAiAfterDevelopment = await fetch(`${injOrigin}/Internships/ai`);
  const internshipAiAfterDevelopmentHtml = await internshipAiAfterDevelopment.text();
  if (!internshipAiAfterDevelopmentHtml.includes(developmentInternTitleHtml) && !internshipAiAfterDevelopmentHtml.includes(developmentInternDescHtml)) {
    pass("/Internships/ai first-byte HTML does not inherit Development Internship metadata");
  } else fail("/Internships/ai first-byte HTML picked up Development Internship metadata");

  const internshipAnalyticsAfterDevelopment = await fetch(`${injOrigin}/Internships/analytics`);
  const internshipAnalyticsAfterDevelopmentHtml = await internshipAnalyticsAfterDevelopment.text();
  if (
    !internshipAnalyticsAfterDevelopmentHtml.includes(developmentInternTitleHtml) &&
    !internshipAnalyticsAfterDevelopmentHtml.includes(developmentInternDescHtml)
  ) {
    pass("/Internships/analytics first-byte HTML does not inherit Development Internship metadata");
  } else fail("/Internships/analytics first-byte HTML picked up Development Internship metadata");

  const internshipMarketingAfterDevelopment = await fetch(`${injOrigin}/Internships/marketing`);
  const internshipMarketingAfterDevelopmentHtml = await internshipMarketingAfterDevelopment.text();
  if (
    !internshipMarketingAfterDevelopmentHtml.includes(developmentInternTitleHtml) &&
    !internshipMarketingAfterDevelopmentHtml.includes(developmentInternDescHtml)
  ) {
    pass("/Internships/marketing first-byte HTML does not inherit Development Internship metadata");
  } else fail("/Internships/marketing first-byte HTML picked up Development Internship metadata");

  const developmentBundleAfterIntern = await fetch(`${injOrigin}${DEVELOPMENT_BUNDLE_PATH}`);
  const developmentBundleAfterInternHtml = await developmentBundleAfterIntern.text();
  if (developmentBundleAfterInternHtml.includes(devBundleTitleHtml) && !developmentBundleAfterInternHtml.includes(developmentInternTitleHtml)) {
    pass("Development Bundle first-byte SEO remains unchanged after Development Internship work");
  } else fail("Development Bundle first-byte SEO changed by Development Internship work");

  const aiBundleAfterIntern = await fetch(`${injOrigin}${AI_BUNDLE_PATH}`);
  const aiBundleAfterInternHtml = await aiBundleAfterIntern.text();
  if (aiBundleAfterInternHtml.includes(aiBundleTitleHtml) && !aiBundleAfterInternHtml.includes(developmentInternTitleHtml)) {
    pass("AI Bundle first-byte SEO remains unchanged after Development Internship work");
  } else fail("AI Bundle first-byte SEO changed by Development Internship work");

  const analyticsBundleAfterIntern = await fetch(`${injOrigin}${ANALYTICS_BUNDLE_PATH}`);
  const analyticsBundleAfterInternHtml = await analyticsBundleAfterIntern.text();
  if (analyticsBundleAfterInternHtml.includes(analyticsBundleTitleHtml) && !analyticsBundleAfterInternHtml.includes(developmentInternTitleHtml)) {
    pass("Analytics Bundle first-byte SEO remains unchanged after Development Internship work");
  } else fail("Analytics Bundle first-byte SEO changed by Development Internship work");

  const marketingBundleAfterIntern = await fetch(`${injOrigin}${MARKETING_BUNDLE_PATH}`);
  const marketingBundleAfterInternHtml = await marketingBundleAfterIntern.text();
  if (marketingBundleAfterInternHtml.includes(marketingBundleTitleHtml) && !marketingBundleAfterInternHtml.includes(developmentInternTitleHtml)) {
    pass("Marketing Bundle first-byte SEO remains unchanged after Development Internship work");
  } else fail("Marketing Bundle first-byte SEO changed by Development Internship work");

  const pythonAfterIntern = await fetch(`${injOrigin}${PYTHON_PROGRAMMING_COURSE_PATH}`);
  const pythonAfterInternHtml = await pythonAfterIntern.text();
  if (pythonAfterInternHtml.includes(pyCourseTitleHtml) && !pythonAfterInternHtml.includes(developmentInternTitleHtml)) {
    pass("Python Programming first-byte SEO remains unchanged after Development Internship work");
  } else fail("Python Programming first-byte SEO changed by Development Internship work");

  const mernAfterIntern = await fetch(`${injOrigin}${MERN_STACK_COURSE_PATH}`);
  const mernAfterInternHtml = await mernAfterIntern.text();
  if (mernAfterInternHtml.includes(mernCourseTitleHtml) && !mernAfterInternHtml.includes(developmentInternTitleHtml)) {
    pass("MERN Stack Development first-byte SEO remains unchanged after Development Internship work");
  } else fail("MERN Stack Development first-byte SEO changed by Development Internship work");

  const homeAfterDevelopmentIntern = await fetch(`${injOrigin}/`);
  const homeAfterDevelopmentInternHtml = await homeAfterDevelopmentIntern.text();
  if (!homeAfterDevelopmentInternHtml.includes(developmentInternTitleHtml) && !homeAfterDevelopmentInternHtml.includes(developmentInternDescHtml)) {
    pass("Homepage first-byte HTML remains unchanged after Development Internship work");
  } else fail("Homepage first-byte HTML picked up Development Internship metadata");

  const videosAfterDevelopmentIntern = await fetch(`${injOrigin}/Blog/python-programming/videos`);
  const videosAfterDevelopmentInternHtml = await videosAfterDevelopmentIntern.text();
  if (videosAfterDevelopmentIntern.status === 200 && videosAfterDevelopmentIntern.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Python /videos route still 200 with X-Robots-Tag noindex, nofollow after Development Internship work");
  } else fail("Python /videos headers changed by Development Internship work");
  if (!videosAfterDevelopmentInternHtml.includes(developmentInternTitleHtml) && !videosAfterDevelopmentInternHtml.includes(developmentInternDescHtml)) {
    pass("Python /videos HTML was not given Development Internship metadata");
  } else fail("Python /videos HTML contains Development Internship metadata");

  const aiInternRes = await fetch(`${injOrigin}${AI_INTERNSHIP_PATH}`);
  const aiInternHtml = await aiInternRes.text();
  if (aiInternRes.status === 200) pass("Express-like /Internships/ai returns HTTP 200");
  else fail(`AI Internship HTTP ${aiInternRes.status}`);
  if (aiInternHtml.includes(aiInternTitleHtml) && aiInternHtml.includes(aiInternDescHtml)) {
    pass("AI Internship initial HTML has the approved title and description");
  } else fail("AI Internship initial HTML missing title or description");
  if ((aiInternHtml.match(/rel="canonical"/g) || []).length === 1) pass("AI Internship injected HTML has one canonical");
  else fail("AI Internship injected HTML canonical count is not 1");
  if (aiInternRes.headers.get("link") === `<${canonicalUrl(AI_INTERNSHIP_PATH)}>; rel="canonical"`) {
    pass("AI Internship response Link header is self-canonical");
  } else fail("AI Internship Link header was incorrect");
  if (aiInternHtml.includes('content="index, follow"') && !aiInternHtml.includes("noindex")) {
    pass("AI Internship initial HTML is index, follow");
  } else fail("AI Internship initial HTML not indexable");
  if (
    aiInternHtml.includes('property="og:title"') &&
    aiInternHtml.includes('property="og:image"') &&
    aiInternHtml.includes('name="twitter:card"') &&
    aiInternHtml.includes("summary_large_image") &&
    aiInternHtml.includes(aiInternOgImageHtml) &&
    (aiInternHtml.match(/data-rh="true"/g) || []).length === 12
  ) {
    pass("AI Internship initial HTML has OG, Twitter, and data-rh metadata");
  } else fail("AI Internship initial HTML missing OG, Twitter, or data-rh metadata");
  if (
    !aiInternHtml.includes(developmentInternTitleHtml) &&
    !aiInternHtml.includes(aiBundleTitleHtml) &&
    !aiInternHtml.includes(devBundleTitleHtml) &&
    !aiInternHtml.includes(analyticsBundleTitleHtml) &&
    !aiInternHtml.includes(marketingBundleTitleHtml) &&
    !aiInternHtml.includes(INTERNSHIPS_LISTING_SEO.title) &&
    !aiInternHtml.includes(aifCourseTitleHtml) &&
    !aiInternHtml.includes(peCourseTitleHtml)
  ) {
    pass("AI Internship first-byte HTML does not reuse Development Internship, bundle, listing, or AI course metadata");
  } else fail("AI Internship first-byte HTML mixed another route's metadata");

  const developmentInternAfterAi = await fetch(`${injOrigin}${DEVELOPMENT_INTERNSHIP_PATH}`);
  const developmentInternAfterAiHtml = await developmentInternAfterAi.text();
  if (developmentInternAfterAiHtml.includes(developmentInternTitleHtml) && !developmentInternAfterAiHtml.includes(aiInternTitleHtml)) {
    pass("Development Internship first-byte SEO remains unchanged after AI Internship work");
  } else fail("Development Internship first-byte SEO changed by AI Internship work");

  const internshipsAfterAiIntern = await fetch(`${injOrigin}/Internships`);
  const internshipsAfterAiInternHtml = await internshipsAfterAiIntern.text();
  if (internshipsAfterAiInternHtml.includes(INTERNSHIPS_LISTING_SEO.title) && !internshipsAfterAiInternHtml.includes(aiInternTitleHtml)) {
    pass("Internships listing first-byte SEO remains unchanged after AI Internship work");
  } else fail("Internships listing first-byte SEO changed by AI Internship work");

  const internshipAnalyticsAfterAi = await fetch(`${injOrigin}/Internships/analytics`);
  const internshipAnalyticsAfterAiHtml = await internshipAnalyticsAfterAi.text();
  if (!internshipAnalyticsAfterAiHtml.includes(aiInternTitleHtml) && !internshipAnalyticsAfterAiHtml.includes(aiInternDescHtml)) {
    pass("/Internships/analytics first-byte HTML does not inherit AI Internship metadata");
  } else fail("/Internships/analytics first-byte HTML picked up AI Internship metadata");

  const internshipMarketingAfterAi = await fetch(`${injOrigin}/Internships/marketing`);
  const internshipMarketingAfterAiHtml = await internshipMarketingAfterAi.text();
  if (!internshipMarketingAfterAiHtml.includes(aiInternTitleHtml) && !internshipMarketingAfterAiHtml.includes(aiInternDescHtml)) {
    pass("/Internships/marketing first-byte HTML does not inherit AI Internship metadata");
  } else fail("/Internships/marketing first-byte HTML picked up AI Internship metadata");

  const aiBundleAfterAiIntern = await fetch(`${injOrigin}${AI_BUNDLE_PATH}`);
  const aiBundleAfterAiInternHtml = await aiBundleAfterAiIntern.text();
  if (aiBundleAfterAiInternHtml.includes(aiBundleTitleHtml) && !aiBundleAfterAiInternHtml.includes(aiInternTitleHtml)) {
    pass("AI Bundle first-byte SEO remains unchanged after AI Internship work");
  } else fail("AI Bundle first-byte SEO changed by AI Internship work");

  const aifAfterAiIntern = await fetch(`${injOrigin}${AI_FUNDAMENTALS_COURSE_PATH}`);
  const aifAfterAiInternHtml = await aifAfterAiIntern.text();
  if (aifAfterAiInternHtml.includes(aifCourseTitleHtml) && !aifAfterAiInternHtml.includes(aiInternTitleHtml)) {
    pass("AI Fundamentals first-byte SEO remains unchanged after AI Internship work");
  } else fail("AI Fundamentals first-byte SEO changed by AI Internship work");

  const peAfterAiIntern = await fetch(`${injOrigin}${PROMPT_ENGINEERING_COURSE_PATH}`);
  const peAfterAiInternHtml = await peAfterAiIntern.text();
  if (peAfterAiInternHtml.includes(peCourseTitleHtml) && !peAfterAiInternHtml.includes(aiInternTitleHtml)) {
    pass("Prompt Engineering first-byte SEO remains unchanged after AI Internship work");
  } else fail("Prompt Engineering first-byte SEO changed by AI Internship work");

  const aipAfterAiIntern = await fetch(`${injOrigin}${AI_PRODUCTIVITY_COURSE_PATH}`);
  const aipAfterAiInternHtml = await aipAfterAiIntern.text();
  if (aipAfterAiInternHtml.includes(aipCourseTitleHtml) && !aipAfterAiInternHtml.includes(aiInternTitleHtml)) {
    pass("AI Tools for Productivity first-byte SEO remains unchanged after AI Internship work");
  } else fail("AI Tools for Productivity first-byte SEO changed by AI Internship work");

  const homeAfterAiIntern = await fetch(`${injOrigin}/`);
  const homeAfterAiInternHtml = await homeAfterAiIntern.text();
  if (!homeAfterAiInternHtml.includes(aiInternTitleHtml) && !homeAfterAiInternHtml.includes(aiInternDescHtml)) {
    pass("Homepage first-byte HTML remains unchanged after AI Internship work");
  } else fail("Homepage first-byte HTML picked up AI Internship metadata");

  const videosAfterAiIntern = await fetch(`${injOrigin}/Blog/prompt-engineering/videos`);
  const videosAfterAiInternHtml = await videosAfterAiIntern.text();
  if (videosAfterAiIntern.status === 200 && videosAfterAiIntern.headers.get("x-robots-tag") === "noindex, nofollow") {
    pass("Prompt Engineering /videos route still 200 with X-Robots-Tag noindex, nofollow after AI Internship work");
  } else fail("Prompt Engineering /videos headers changed by AI Internship work");
  if (!videosAfterAiInternHtml.includes(aiInternTitleHtml) && !videosAfterAiInternHtml.includes(aiInternDescHtml)) {
    pass("Prompt Engineering /videos HTML was not given AI Internship metadata");
  } else fail("Prompt Engineering /videos HTML contains AI Internship metadata");
} finally {
  injectionServer.close();
}

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
