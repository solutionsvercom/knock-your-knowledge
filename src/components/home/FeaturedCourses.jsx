import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Clock, Users, Star, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const levelColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function FeaturedCourses({
  courses,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  const list = Array.isArray(courses) ? courses : [];
  const featured = list.filter((c) => c?.id).slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-14">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Featured Courses</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Master In-Demand Skills</h2>
          </div>
          <Link to={createPageUrl("Courses")}>
            <Button variant="outline" className="rounded-xl gap-2">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" aria-hidden />
            <p className="text-sm text-gray-500">Loading featured courses…</p>
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-8 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" aria-hidden />
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error?.message || "Could not load courses."}</p>
            {onRetry ? (
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !isError && featured.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No courses available yet. Check back soon or browse the full catalog.
          </p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {!isLoading && !isError
            ? featured.map((course, i) => (
            <motion.div
              key={course?.id ?? `course-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={createPageUrl(`CourseDetail?id=${course.id}`)}
                className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      course.thumbnail ||
                      course.image ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                    }
                    alt={course.title}
                    className="w-full h-40 sm:h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500 max-w-full"
                    loading="lazy"
                  />
                  <Badge className={`absolute top-4 left-4 ${levelColors[String(course.level || "beginner").toLowerCase()] || levelColors.beginner} border-0 font-medium`}>
                    {course.level}
                  </Badge>
                </div>
                <div className="p-6">
                  <p className="text-sm font-semibold text-blue-600 capitalize mb-1">{course.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">By {course.instructor}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration_hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.students_count?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                      <span className="text-sm text-gray-400 line-through">${course.original_price}</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm h-11 px-5">
                      Enroll
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
            : null}
        </div>
      </div>
    </section>
  );
}