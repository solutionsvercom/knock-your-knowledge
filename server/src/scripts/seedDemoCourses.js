/**
 * Inserts sample courses (by unique title) so the admin panel / API have multiple rows to work with.
 * Skips any title that already exists — safe to run multiple times.
 */
import { loadServerEnv } from "../lib/loadServerEnv.js";
import { connectDb } from "../lib/db.js";
import { Course } from "../models/Course.js";

loadServerEnv();

const DEMOS = [
  {
    title: "Demo: Web Development Fundamentals",
    category: "programming",
    level: "beginner",
    instructor: "Alex Chen",
    price: 49,
    original_price: 99,
    short_description: "HTML, CSS, JavaScript and how the web works — sample row for admin testing.",
    description: "Use the admin panel to edit or delete this demo course.",
    duration_hours: 14,
    has_certificate: true,
    students_count: 120,
    rating: 4.7,
    status: "published",
  },
  {
    title: "Demo: Data Analysis with Python",
    category: "data science",
    level: "intermediate",
    instructor: "Sarah Patel",
    price: 59,
    original_price: 119,
    short_description: "Pandas, visualization, and reporting — demo listing.",
    description: "Sample course. Replace with your own content from /admin/courses.",
    duration_hours: 22,
    has_certificate: true,
    students_count: 86,
    rating: 4.8,
    status: "published",
  },
  {
    title: "Demo: UI Design Principles",
    category: "design",
    level: "beginner",
    instructor: "Jordan Lee",
    price: 39,
    original_price: 79,
    short_description: "Layout, typography, and color for interfaces.",
    description: "Demo course row.",
    duration_hours: 10,
    has_certificate: false,
    students_count: 64,
    rating: 4.6,
    status: "published",
  },
  {
    title: "Demo: Digital Marketing Essentials",
    category: "marketing",
    level: "beginner",
    instructor: "Emily Ross",
    price: 44,
    original_price: 89,
    short_description: "SEO, content, and analytics basics.",
    description: "Demo course row.",
    duration_hours: 16,
    has_certificate: true,
    students_count: 210,
    rating: 4.9,
    status: "published",
  },
  {
    title: "Demo: Business Strategy Workshop",
    category: "business",
    level: "advanced",
    instructor: "Chris Taylor",
    price: 69,
    original_price: 129,
    short_description: "Planning, positioning, and growth — demo.",
    description: "Demo course row.",
    duration_hours: 8,
    has_certificate: false,
    students_count: 42,
    rating: 4.5,
    status: "published",
  },
];

await connectDb();

let added = 0;
for (const doc of DEMOS) {
  const exists = await Course.findOne({ title: doc.title });
  if (!exists) {
    await Course.create(doc);
    added += 1;
    console.log(`+ ${doc.title}`);
  }
}

console.log(`\nDone: added ${added} demo course(s). Existing titles were skipped.`);
process.exit(0);
