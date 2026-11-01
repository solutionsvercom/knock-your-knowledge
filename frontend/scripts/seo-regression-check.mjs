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
  blogPostSrc.includes('titleAs=')
) {
  pass("SMM and SEO course pages use SEO H1 and demote the enroll card heading");
} else fail("SMM/SEO H1/hero heading wiring missing");
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
if (jsonLdSrc.includes('instructor === "Emily Ross"') && jsonLdSrc.includes('instructor === "Jasmine Patel"')) {
  pass("JSON-LD instructor extras remain catalog-gated for SMM and SEO courses");
} else fail("JSON-LD instructor checks missing");

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
    !internHtml.includes(seoCourseTitleHtml)
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
  if (smmAfterHtml.includes(smmTitleHtml) && !smmAfterHtml.includes(seoCourseTitleHtml)) {
    pass("SMM first-byte SEO remains unchanged");
  } else fail("SMM first-byte SEO changed by SEO course work");

  const coursesRes = await fetch(`${injOrigin}/Courses`);
  const coursesHtml = await coursesRes.text();
  if (
    !coursesHtml.includes(SMM_COURSE_SEO.title) &&
    !coursesHtml.includes(INTERNSHIPS_LISTING_SEO.title) &&
    !coursesHtml.includes(seoCourseTitleHtml)
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
    !semHtml.includes(seoCourseTitleHtml)
  ) {
    pass("Homepage, Bundles, and SEM course first-byte HTML were not given SEO course metadata");
  } else fail("SEO course metadata leaked onto homepage, Bundles, or SEM");

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
  if (!semVidHtml.includes(SMM_COURSE_SEO.title)) pass("SEM /videos HTML was not given SMM metadata");
  else fail("SEM /videos HTML contains SMM metadata");
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
