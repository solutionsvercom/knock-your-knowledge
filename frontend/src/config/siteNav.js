/** Main site navigation — Courses, Bundles, Internships, and top-level pages. */

export const SITE_NAV = [
  { name: "Home", to: "/", page: "Home" },
  {
    name: "Courses",
    to: "/Courses",
    page: "Courses",
    mega: true,
    children: [
      { name: "All 17 Courses", to: "/Courses" },
      {
        name: "Development",
        to: "/Courses?cat=development#cat-development",
        children: [
          { name: "Python Programming", to: "/Blog/python-programming" },
          { name: "Data Science", to: "/Blog/data-science" },
          { name: "MERN Stack Development", to: "/Blog/mern-stack-development" },
        ],
      },
      {
        name: "AI & Prompt Engineering",
        to: "/Courses?cat=ai#cat-ai",
        children: [
          { name: "Artificial Intelligence Fundamentals", to: "/Blog/artificial-intelligence-fundamentals" },
          { name: "Prompt Engineering", to: "/Blog/prompt-engineering" },
          { name: "AI Tools for Productivity", to: "/Blog/8-best-ai-tools-for-productivity" },
        ],
      },
      {
        name: "Business Analytics",
        to: "/Courses?cat=analytics#cat-analytics",
        children: [
          { name: "SQL for Data Analysis", to: "/Blog/sql-for-data-analysis" },
          { name: "Python for Analytics", to: "/Blog/python-for-analytics" },
          { name: "Power BI Dashboarding", to: "/Blog/power-bi-dashboarding" },
          { name: "Tableau Visualization", to: "/Blog/tableau-visualization" },
          { name: "Jira for Project Management", to: "/Blog/jira-for-project-management" },
        ],
      },
      {
        name: "Advanced Digital Marketing",
        to: "/Courses?cat=marketing#cat-marketing",
        children: [
          { name: "SEO — Search Engine Optimization", to: "/Blog/seo-search-engine-optimization" },
          { name: "SEM — Search Engine Marketing", to: "/Blog/sem-search-engine-marketing" },
          { name: "SMM — Social Media Marketing", to: "/Blog/smm-social-media-marketing" },
          { name: "SMO — Social Media Optimization", to: "/Blog/smo-social-media-optimization" },
          { name: "Google Search Console", to: "/Blog/google-webmaster-search-console" },
          { name: "AI Tools in Digital Marketing", to: "/Blog/ai-tools-in-digital-marketing" },
        ],
      },
    ],
  },
  {
    name: "Bundles",
    to: "/Courses",
    page: "Courses",
    children: [
      { name: "Development Bundle", to: "/Courses?cat=development#bundle-development" },
      { name: "AI & Prompt Engineering Bundle", to: "/Courses?cat=ai#bundle-ai" },
      { name: "Business Analytics Bundle", to: "/Courses?cat=analytics#bundle-analytics" },
      { name: "Advanced Digital Marketing Bundle", to: "/Courses?cat=marketing#bundle-marketing" },
    ],
  },
  {
    name: "Internships",
    to: "/Internships",
    page: "Internships",
    children: [
      { name: "Development Internship", to: "/Internships#intern-development" },
      { name: "AI & Prompt Engineering Internship", to: "/Internships#intern-ai-prompt" },
      { name: "Business Analytics Internship", to: "/Internships#intern-business-analytics" },
      { name: "Advanced Digital Marketing Internship", to: "/Internships#intern-digital-marketing" },
    ],
  },
  { name: "Career Guide", to: "/Blog", page: "Blog" },
  { name: "Live Classes", to: "/LiveClasses", page: "LiveClasses" },
  { name: "About Us", to: "/About", page: "About" },
];
