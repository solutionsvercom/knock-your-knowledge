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
const aifCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  AI_FUNDAMENTALS_COURSE_PATH
);
if (aifCourseShell.includes(aifCourseTitleHtml)) pass("Initial HTML title for AI Fundamentals course");
else fail("Initial HTML missing AI Fundamentals course title");
if (aifCourseShell.includes(AI_FUNDAMENTALS_COURSE_SEO.description)) pass("Initial HTML description for AI Fundamentals course");
else fail("Initial HTML missing AI Fundamentals course description");
if ((aifCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("AI Fundamentals course initial HTML has exactly one canonical");
else fail("AI Fundamentals course initial HTML canonical count is not 1");
if (aifCourseShell.includes(`href="${canonicalUrl(AI_FUNDAMENTALS_COURSE_PATH)}"`)) pass("AI Fundamentals course initial HTML canonical is the course URL");
else fail("AI Fundamentals course initial HTML canonical is not the course URL");
if (aifCourseShell.includes('content="index, follow"')) pass("AI Fundamentals course initial HTML robots is index, follow");
else fail("AI Fundamentals course initial HTML missing index, follow");
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
const dsCourseShell = applyInitialHtmlSeo(
  `<!doctype html><html><head><title>Home</title><meta name="description" content="Home desc" /></head><body></body></html>`,
  DATA_SCIENCE_COURSE_PATH
);
if (dsCourseShell.includes(dsCourseTitleHtml)) pass("Initial HTML title for Data Science course");
else fail("Initial HTML missing Data Science course title");
if (dsCourseShell.includes(DATA_SCIENCE_COURSE_SEO.description)) pass("Initial HTML description for Data Science course");
else fail("Initial HTML missing Data Science course description");
if ((dsCourseShell.match(/rel="canonical"/g) || []).length === 1) pass("Data Science course initial HTML has exactly one canonical");
else fail("Data Science course initial HTML canonical count is not 1");
if (dsCourseShell.includes(`href="${canonicalUrl(DATA_SCIENCE_COURSE_PATH)}"`)) pass("Data Science course initial HTML canonical is the course URL");
else fail("Data Science course initial HTML canonical is not the course URL");
if (dsCourseShell.includes('content="index, follow"')) pass("Data Science course initial HTML robots is index, follow");
else fail("Data Science course initial HTML missing index, follow");
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
  blogPostSrc.includes('titleAs=')
) {
  pass("SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN Stack Development, Jira for Project Management, SQL for Data Analysis, Power BI Dashboarding, and Tableau Visualization course pages use SEO H1 and demote the enroll card heading");
} else fail("SMM/SEO/SEM/SMO/GSC/AI marketing/AI productivity/Prompt Engineering/AI Fundamentals/Python Programming/Data Science/MERN/Jira/SQL/Power BI/Tableau H1/hero heading wiring missing");
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
  jsonLdSrc.includes("tableau-visualization")
) {
  pass("JSON-LD instructor extras remain catalog-gated for SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, AI Fundamentals, Python Programming, Data Science, MERN Stack Development, Jira for Project Management, SQL for Data Analysis, Power BI Dashboarding, and Tableau Visualization courses");
} else fail("JSON-LD instructor checks missing");
if ((jsonLdSrc.match(/slug === "power-bi-dashboarding"/g) || []).length === 2) {
  pass("Power BI JSON-LD extras and FAQPage are declared once each");
} else fail("Power BI JSON-LD slug handling is duplicated or missing");
if ((jsonLdSrc.match(/slug === "tableau-visualization"/g) || []).length === 2) {
  pass("Tableau JSON-LD extras and FAQPage are declared once each");
} else fail("Tableau JSON-LD slug handling is duplicated or missing");

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
for (const t of ["EducationalOrganization", "WebSite", "BreadcrumbList", "Course", "ItemList", "CourseInstance", "Offer", "FAQPage"]) {
  if (jsonLd.includes(`"${t}"`) || jsonLd.includes(`@type": "${t}"`) || jsonLd.includes(`"@type": "${t}"`)) {
    pass(`JSON-LD builder includes ${t}`);
  } else fail(`JSON-LD builder missing ${t}`);
}
if (!jsonLd.includes("aggregateRating") && !jsonLd.includes("Review")) pass("JSON-LD omits unverified ratings/reviews");
else warn("JSON-LD includes rating/review fields");

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
  if (aifCourseHtml.includes(aifCourseTitleHtml) && aifCourseHtml.includes(AI_FUNDAMENTALS_COURSE_SEO.description)) {
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
    !aifCourseHtml.includes(SMM_COURSE_SEO.title) &&
    !aifCourseHtml.includes(seoCourseTitleHtml) &&
    !aifCourseHtml.includes(semCourseTitleHtml) &&
    !aifCourseHtml.includes(smoCourseTitleHtml) &&
    !aifCourseHtml.includes(gscCourseTitleHtml) &&
    !aifCourseHtml.includes(aimCourseTitleHtml) &&
    !aifCourseHtml.includes(aipCourseTitleHtml) &&
    !aifCourseHtml.includes(peCourseTitleHtml) &&
    !aifCourseHtml.includes(pyCourseTitleHtml) &&
    !aifCourseHtml.includes(INTERNSHIPS_LISTING_SEO.title)
  ) {
    pass("AI Fundamentals course first-byte HTML does not reuse SMM, SEO, SEM, SMO, GSC, AI marketing, AI productivity, Prompt Engineering, Python Programming, or Internships metadata");
  } else fail("AI Fundamentals course first-byte HTML mixed another route's metadata");

  const peAfter = await fetch(`${injOrigin}${PROMPT_ENGINEERING_COURSE_PATH}`);
  const peAfterHtml = await peAfter.text();
  if (peAfterHtml.includes(peCourseTitleHtml) && !peAfterHtml.includes(aifCourseTitleHtml)) {
    pass("Prompt Engineering course first-byte SEO remains unchanged");
  } else fail("Prompt Engineering course first-byte SEO changed by AI Fundamentals work");

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
  if (dsCourseHtml.includes(dsCourseTitleHtml) && dsCourseHtml.includes(DATA_SCIENCE_COURSE_SEO.description)) {
    pass("Data Science course initial HTML has the new title and description");
  } else fail("Data Science course initial HTML missing title or description");

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
