/** Shared internship / checkout pricing */
export const INTERNSHIP_FEE_AMOUNT = 3999;
export const INTERNSHIP_FEE_LABEL = "₹3999/-";
/** Individual internship-course enrollment (Python, SEO, Power BI, …). */
export const COURSE_FEE_AMOUNT = 3999;
export const COURSE_FEE_LABEL = "₹3999/-";
/** Development retail courses on /Courses (Python, Data Science, MERN). */
export const DEVELOPMENT_COURSE_FEE = 299;
export const DEVELOPMENT_BUNDLE_FEE = 799;
export const DEVELOPMENT_BUNDLE_ID = "bundle-dev-starter";
export const DEVELOPMENT_COURSE_TITLES = [
  "Python Programming",
  "Data Science",
  "MERN Stack Development",
];
/** AI & Prompt Engineering retail courses. */
export const AI_COURSE_FEE = 199;
export const AI_BUNDLE_FEE = 499;
export const AI_BUNDLE_ID = "bundle-ai-mastery";
export const AI_COURSE_TITLES = [
  "Artificial Intelligence Fundamentals",
  "Prompt Engineering",
  "8 Best AI Tools for Productivity",
];
/** Business Analytics retail courses. */
export const ANALYTICS_COURSE_FEE = 199;
export const ANALYTICS_BUNDLE_FEE = 899;
export const ANALYTICS_BUNDLE_ID = "bundle-analytics";
export const ANALYTICS_COURSE_TITLES = [
  "SQL for Data Analysis",
  "Python for Analytics",
  "Power BI Dashboarding",
  "Tableau Visualization",
  "Jira for Project Management",
];
/** Advanced Digital Marketing retail courses. */
export const MARKETING_COURSE_FEE = 149;
export const MARKETING_BUNDLE_FEE = 799;
export const MARKETING_BUNDLE_ID = "bundle-marketing-pro";
export const MARKETING_COURSE_TITLES = [
  "SEO — Search Engine Optimization",
  "SEM — Search Engine Marketing",
  "SMM — Social Media Marketing",
  "SMO — Social Media Optimization",
  "Google Webmaster & Search Console",
  "AI Tools in Digital Marketing",
];

export const RETAIL_BUNDLES = [
  {
    id: DEVELOPMENT_BUNDLE_ID,
    slug: "development",
    categoryId: "development",
    fee: DEVELOPMENT_BUNDLE_FEE,
    courseFee: DEVELOPMENT_COURSE_FEE,
    titles: DEVELOPMENT_COURSE_TITLES,
    pageTitle: "Development Bundle",
    packTitle: "Development pack — all 3 courses",
    cartTitle: "Development pack (Python + Data Science + MERN)",
    names: "Python, Data Science, and MERN Stack",
  },
  {
    id: AI_BUNDLE_ID,
    slug: "ai",
    categoryId: "ai",
    fee: AI_BUNDLE_FEE,
    courseFee: AI_COURSE_FEE,
    titles: AI_COURSE_TITLES,
    pageTitle: "AI & Prompt Engineering Bundle",
    packTitle: "AI pack — all 3 courses",
    cartTitle: "AI pack (AI Fundamentals + Prompt Engineering + AI Tools)",
    names: "AI Fundamentals, Prompt Engineering, and AI Tools",
  },
  {
    id: ANALYTICS_BUNDLE_ID,
    slug: "analytics",
    categoryId: "analytics",
    fee: ANALYTICS_BUNDLE_FEE,
    courseFee: ANALYTICS_COURSE_FEE,
    titles: ANALYTICS_COURSE_TITLES,
    pageTitle: "Business Analytics Bundle",
    packTitle: "Analytics pack — all 5 courses",
    cartTitle: "Analytics pack (SQL + Python + Power BI + Tableau + Jira)",
    names: "SQL, Python for Analytics, Power BI, Tableau, and Jira",
  },
  {
    id: MARKETING_BUNDLE_ID,
    slug: "marketing",
    categoryId: "marketing",
    fee: MARKETING_BUNDLE_FEE,
    courseFee: MARKETING_COURSE_FEE,
    titles: MARKETING_COURSE_TITLES,
    pageTitle: "Advanced Digital Marketing Bundle",
    packTitle: "Marketing pack — all 6 courses",
    cartTitle: "Marketing pack (SEO + SEM + SMM + SMO + GSC + AI Marketing)",
    names: "SEO, SEM, SMM, SMO, Search Console, and AI Marketing",
  },
];

export const INTERNSHIP_PAGES = [
  {
    slug: "development",
    id: "intern-development",
    categoryId: "development",
    navTitle: "Development Internship",
  },
  {
    slug: "ai",
    id: "intern-ai-prompt",
    categoryId: "ai",
    navTitle: "AI & Prompt Engineering Internship",
  },
  {
    slug: "analytics",
    id: "intern-business-analytics",
    categoryId: "analytics",
    navTitle: "Business Analytics Internship",
  },
  {
    slug: "marketing",
    id: "intern-digital-marketing",
    categoryId: "marketing",
    navTitle: "Advanced Digital Marketing Internship",
  },
];
export const GST_RATE = 0.18; // 18% GST as applicable

export function formatInr(amount) {
  return `₹${Math.round(Number(amount) || 0).toLocaleString("en-IN")}/-`;
}

/** Apply coupon fraction to original (e.g. 0.7 = pay 70%). */
export function discountedPrice(original, payFraction = 1) {
  return Math.round((Number(original) || 0) * Number(payFraction || 1));
}

/**
 * GST on taxable base (after any discount).
 * Returns { base, gst, total }.
 */
export function withGst(baseAmount) {
  const base = Math.round(Number(baseAmount) || 0);
  const gst = Math.round(base * GST_RATE);
  return { base, gst, total: base + gst };
}

export function feeLabelWithGst(base = INTERNSHIP_FEE_AMOUNT) {
  return `${formatInr(base)} + 18% GST`;
}

export function internshipUnitPrice(item) {
  const n = Number(item?.price);
  if (Number.isFinite(n) && n > 0) return Math.round(n);
  return INTERNSHIP_FEE_AMOUNT;
}

export function internshipFeeLabel(item) {
  return feeLabelWithGst(internshipUnitPrice(item));
}

export function isDevelopmentRetailCourse(title) {
  return DEVELOPMENT_COURSE_TITLES.includes(String(title || "").trim());
}

export function isAiRetailCourse(title) {
  return AI_COURSE_TITLES.includes(String(title || "").trim());
}

export function retailOfferForTitle(title) {
  const t = String(title || "").trim();
  return RETAIL_BUNDLES.find((b) => b.titles.includes(t)) || null;
}

export function isRetailCourse(title) {
  return Boolean(retailOfferForTitle(title));
}

export function isRetailBundleId(id) {
  return RETAIL_BUNDLES.some((b) => b.id === id);
}

export function retailOfferForCategory(categoryId) {
  return RETAIL_BUNDLES.find((b) => b.categoryId === categoryId) || null;
}

export function retailOfferForSlug(slug) {
  return RETAIL_BUNDLES.find((b) => b.slug === slug) || null;
}

export function internshipPageForSlug(slug) {
  return INTERNSHIP_PAGES.find((p) => p.slug === slug) || null;
}

export function internshipPageForId(id) {
  return INTERNSHIP_PAGES.find((p) => p.id === id) || null;
}

export function courseUnitPrice(item) {
  const n = Number(item?.price);
  if (Number.isFinite(n) && n > 0) return Math.round(n);
  const offer = retailOfferForTitle(item?.title);
  if (offer) return offer.courseFee;
  return COURSE_FEE_AMOUNT;
}

export function courseFeeLabel(item) {
  return feeLabelWithGst(courseUnitPrice(item));
}
