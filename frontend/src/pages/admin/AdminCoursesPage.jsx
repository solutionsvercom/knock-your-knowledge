import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import CoursesSection from "@/components/crm/admin/CoursesSection";
import { ExternalLink } from "lucide-react";
import { asArray } from "@/lib/asArray";

export default function AdminCoursesPage() {
  const { data: users = [] } = useQuery({ queryKey: ["crm-users"], queryFn: () => api.users.list() });
  const { data: courses = [] } = useQuery({
    queryKey: ["crm-courses"],
    queryFn: async () => asArray(await api.courses.list("-createdAt")),
  });
  const teachers = users.filter((u) => u.role === "teacher");

  return (
    <div>
      <div
        className="mb-6 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3"
        style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(167,139,250,0.25)" }}
      >
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          <strong className="text-slate-200">Database only:</strong> this list shows courses stored in MongoDB — not the old static marketing catalog.
          Use <strong className="text-slate-300">Add Course</strong> for each new course, or run{" "}
          <code className="text-violet-300 text-xs">cd backend && npm run seed:courses</code> to insert sample rows.
          <br />
          <strong className="text-slate-200">Live site:</strong> the public{" "}
          <Link to="/Courses" className="text-violet-400 hover:underline font-medium">
            Courses
          </Link>{" "}
          page and{" "}
          <Link to="/" className="text-violet-400 hover:underline font-medium">
            home featured
          </Link>{" "}
          list pull from this same data. Edits here appear on the website after save (refresh if needed).
        </p>
        <Link
          to="/Courses"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg shrink-0"
          style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.3)" }}
        >
          Preview catalog <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
      <CoursesSection courses={courses} teachers={teachers} />
    </div>
  );
}
