import { CATEGORIES } from "@/data/courseCatalog";
import { getBlogBySlug, slugifyTitle } from "@/data/courseBlogs";
import { INTERNSHIP_PAGES, RETAIL_BUNDLES, retailOfferForTitle } from "@/config/pricing";
import { CONTACT_EMAIL, CONTACT_PHONE_TEL, SOCIAL_FACEBOOK_URL, SOCIAL_INSTAGRAM_URL } from "@/config/contact";
import {
  BUNDLE_SEO,
  CAREER_SEO,
  COURSE_SEO,
  DEFAULT_OG_IMAGE,
  INTERNSHIP_SEO,
  SITE_NAME,
  canonicalUrl,
  seoForPath,
} from "@/config/seo";
import { SITE_ORIGIN } from "@/config/publicPaths";

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

function catalogCourses() {
  return CATEGORIES.flatMap((cat) =>
    (cat.courses || []).map((course) => ({
      ...course,
      categoryLabel: cat.label,
      slug: slugifyTitle(course.title),
    }))
  );
}

function isoWorkload(duration) {
  const n = parseInt(String(duration || "").match(/\d+/)?.[0] || "", 10);
  return Number.isFinite(n) && n > 0 ? `PT${n}H` : undefined;
}

function organizationNode() {
  return {
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
    },
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_TEL,
    sameAs: [SOCIAL_INSTAGRAM_URL, SOCIAL_FACEBOOK_URL].filter(Boolean),
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    publisher: { "@id": ORG_ID },
  };
}

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

function courseNode(course, seo, extras = {}) {
  const url = canonicalUrl(`/Blog/${course.slug}`);
  const offer = retailOfferForTitle(course.title);
  const price = offer?.courseFee ?? (Number(course.price) || undefined);
  const workload = isoWorkload(course.duration);
  const node = {
    "@type": "Course",
    "@id": `${url}#course`,
    name: extras.name || seo?.h1 || course.title,
    description: extras.description || seo?.description || course.shortDesc || course.title,
    url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      sameAs: `${SITE_ORIGIN}/`,
    },
  };
  if (extras.image) {
    node.image = extras.image;
  }
  if (extras.instructor) {
    node.instructor = {
      "@type": "Person",
      name: extras.instructor,
    };
  }
  if (price != null) {
    const offerNode = {
      "@type": "Offer",
      category: "Paid",
      priceCurrency: "INR",
      price: String(price),
      url,
    };
    if (extras.vatExcluded) {
      offerNode.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: String(price),
        priceCurrency: "INR",
        valueAddedTaxIncluded: false,
      };
    }
    node.offers = [offerNode];
  }
  node.hasCourseInstance = [
    {
      "@type": "CourseInstance",
      courseMode: "Online",
      ...(workload ? { courseWorkload: workload } : {}),
    },
  ];
  return node;
}

function faqPageNode(faqs, path) {
  return {
    "@type": "FAQPage",
    "@id": `${canonicalUrl(path)}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function jsonLdForPath(pathname) {
  const path = String(pathname || "/").split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const seo = seoForPath(path);
  if (seo.noindex) return null;

  const graph = [];

  if (path === "/" || path === "/Home") {
    graph.push(organizationNode(), websiteNode());
    return { "@context": "https://schema.org", "@graph": graph };
  }

  if (path === "/Courses") {
    const courses = catalogCourses().filter((c) => COURSE_SEO[c.slug]);
    graph.push(
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Courses", path: "/Courses" },
      ]),
      {
        "@type": "ItemList",
        name: "KYK internship courses",
        numberOfItems: courses.length,
        itemListElement: courses.map((course, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: courseNode(course, COURSE_SEO[course.slug], { name: course.title }),
        })),
      }
    );
    return { "@context": "https://schema.org", "@graph": graph };
  }

  const courseMatch = path.match(/^\/Blog\/([^/]+)$/);
  if (courseMatch && COURSE_SEO[courseMatch[1]]) {
    const course = catalogCourses().find((c) => c.slug === courseMatch[1]);
    graph.push(
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Courses", path: "/Courses" },
        { name: COURSE_SEO[courseMatch[1]].h1, path },
      ])
    );
    if (course) {
      const slug = courseMatch[1];
      const extras = {};
      if (slug === "smm-social-media-marketing") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Jasmine Patel") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "seo-search-engine-optimization") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Emily Ross") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "sem-search-engine-marketing") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Paul Martinez") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "smo-social-media-optimization") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Kevin Wu") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "google-webmaster-search-console") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Emily Ross") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "ai-tools-in-digital-marketing") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Lisa Monroe") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "8-best-ai-tools-for-productivity") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Tom Watts") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "prompt-engineering") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Lisa Monroe") {
          extras.instructor = course.instructor;
        }
      }
      if (slug === "artificial-intelligence-fundamentals") {
        const post = getBlogBySlug(slug);
        extras.image = course.image;
        extras.description = post?.intro || COURSE_SEO[slug].description;
        extras.vatExcluded = true;
        if (course.instructor === "Dr. Meera Singh") {
          extras.instructor = course.instructor;
        }
      }
      graph.push(courseNode(course, COURSE_SEO[slug], extras));
      if (
        slug === "smm-social-media-marketing" ||
        slug === "seo-search-engine-optimization" ||
        slug === "sem-search-engine-marketing" ||
        slug === "smo-social-media-optimization" ||
        slug === "google-webmaster-search-console" ||
        slug === "ai-tools-in-digital-marketing" ||
        slug === "8-best-ai-tools-for-productivity" ||
        slug === "prompt-engineering" ||
        slug === "artificial-intelligence-fundamentals"
      ) {
        const faqs = getBlogBySlug(slug)?.faqs || [];
        if (faqs.length) graph.push(faqPageNode(faqs, path));
      }
    }
    return { "@context": "https://schema.org", "@graph": graph };
  }

  if (courseMatch && CAREER_SEO[courseMatch[1]]) {
    graph.push(
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Career Guide", path: "/Blog" },
        { name: CAREER_SEO[courseMatch[1]].h1, path },
      ])
    );
    return { "@context": "https://schema.org", "@graph": graph };
  }

  const bundleMatch = path.match(/^\/Bundles\/([^/]+)$/);
  if (bundleMatch && BUNDLE_SEO[bundleMatch[1]]) {
    const offer = RETAIL_BUNDLES.find((b) => b.slug === bundleMatch[1]);
    const included = catalogCourses().filter((c) => offer?.titles?.includes(c.title));
    graph.push(
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Bundles", path: "/Bundles" },
        { name: BUNDLE_SEO[bundleMatch[1]].h1, path },
      ])
    );
    if (included.length) {
      graph.push({
        "@type": "ItemList",
        name: BUNDLE_SEO[bundleMatch[1]].h1,
        numberOfItems: included.length,
        itemListElement: included.map((course, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: canonicalUrl(`/Blog/${course.slug}`),
          name: course.title,
        })),
      });
    }
    return { "@context": "https://schema.org", "@graph": graph };
  }

  const internMatch = path.match(/^\/Internships\/([^/]+)$/);
  if (internMatch && INTERNSHIP_SEO[internMatch[1]]) {
    const page = INTERNSHIP_PAGES.find((p) => p.slug === internMatch[1]);
    graph.push(
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Internships", path: "/Internships" },
        { name: page?.navTitle || INTERNSHIP_SEO[internMatch[1]].h1, path },
      ])
    );
    return { "@context": "https://schema.org", "@graph": graph };
  }

  const listingCrumbs = {
    "/Bundles": [
      { name: "Home", path: "/" },
      { name: "Bundles", path: "/Bundles" },
    ],
    "/Internships": [
      { name: "Home", path: "/" },
      { name: "Internships", path: "/Internships" },
    ],
    "/Blog": [
      { name: "Home", path: "/" },
      { name: "Career Guide", path: "/Blog" },
    ],
    "/LiveClasses": [
      { name: "Home", path: "/" },
      { name: "Live Classes", path: "/LiveClasses" },
    ],
    "/About": [
      { name: "Home", path: "/" },
      { name: "About", path: "/About" },
    ],
  };
  if (listingCrumbs[path]) {
    graph.push(breadcrumb(listingCrumbs[path]));
    return { "@context": "https://schema.org", "@graph": graph };
  }

  return null;
}
