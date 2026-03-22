import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { MapPin, Clock, DollarSign, ArrowRight, Building2, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const typeColors = {
  remote: "bg-green-100 text-green-700",
  hybrid: "bg-purple-100 text-purple-700",
  onsite: "bg-orange-100 text-orange-700",
};

const LOGO_FALLBACK =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80";

export default function InternshipsPreview({
  internships,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  const rows = Array.isArray(internships) ? internships : [];
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Career Opportunities</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Launch Your Career with Real Internships
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Get hands-on experience with top companies. Our placement partners actively recruit from our platform.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" aria-hidden />
            <p className="text-sm text-gray-500">Loading internships…</p>
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-8 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" aria-hidden />
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">{error?.message || "Could not load internships."}</p>
            {onRetry ? (
              <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Try again
              </Button>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !isError && rows.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-sm">No internship listings from the API yet.</p>
        ) : null}

        <div className="space-y-4">
          {!isLoading && !isError
            ? rows.map((item, i) => (
            <motion.div
              key={item?.id ?? `internship-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg hover:shadow-gray-100/80 dark:hover:shadow-gray-950/80 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={item.company_logo || LOGO_FALLBACK} alt={item.company || ""} className="w-full h-full object-cover max-w-full" loading="lazy" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-500">{item.company}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location}</span>
                    <Badge className={`${typeColors[item.work_type]} border-0 text-xs`}>{item.work_type}</Badge>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration}</span>
                    <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3.5 h-3.5" /> {item.stipend}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.skills?.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">{skill}</span>
                    ))}
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl h-10 px-6 self-start sm:self-center w-full sm:w-auto">
                  Apply Now
                </Button>
              </div>
            </motion.div>
          ))
            : null}
        </div>

        <div className="text-center mt-10">
          <Link to={createPageUrl("Internships")}>
            <Button variant="outline" className="rounded-xl gap-2">
              View All Internships <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}