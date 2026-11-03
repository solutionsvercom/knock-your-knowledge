import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Building2, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { internshipFeeLabel } from "@/config/pricing";
import { internshipHref, internshipImgAlt, internshipLabel } from "@/lib/internalSeo";
import { useContactForm } from "@/lib/ContactFormContext";

const typeColors = {
  remote: "bg-green-100 text-green-700",
  hybrid: "bg-purple-100 text-purple-700",
  onsite: "bg-orange-100 text-orange-700",
};

const LOGO_FALLBACK =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80";

const INTERNSHIP_LINKS = [
  { to: "/Internships/development", text: "Development Internship" },
  { to: "/Internships/ai", text: "AI & Prompt Engineering Internship" },
  { to: "/Internships/analytics", text: "Business Analytics Internship" },
  { to: "/Internships/marketing", text: "Advanced Digital Marketing Internship" },
];

export default function InternshipsPreview({
  internships,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
}) {
  const { openContactForm } = useContactForm();
  const rows = (Array.isArray(internships) ? internships : []).filter((item) => !item?.demo);

  const openApplyForm = (programTitle) => {
    openContactForm({
      internshipInterest: programTitle,
      source: "internship-apply",
      heading: "Apply for internship",
      description:
        "Enter your name, phone, mail ID, and the internship course you want to enroll in. Our team will contact you soon.",
    });
  };

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Paid internship programmes
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Four real-time internships at KYK
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Programme fee ₹3,999 + 18% GST. The intern pays this fee to Knock Your Knowledge. It is not a stipend or
            salary. Listings below come from KYK’s internship data on this site.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 gap-2 text-sm mb-10">
          {INTERNSHIP_LINKS.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="font-semibold text-violet-700 dark:text-violet-300 hover:underline">
                {item.text}
              </Link>
            </li>
          ))}
        </ul>

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
          <p className="text-center text-gray-500 dark:text-gray-400 py-12 text-sm">
            Programme pages are linked above. Open a track to read duration, skills, and how to apply.
          </p>
        ) : null}

        <div className="space-y-4">
          {!isLoading && !isError
            ? rows.map((item, i) => (
                <div
                  key={item?.id ?? `internship-${i}`}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={item.company_logo || item.image || LOGO_FALLBACK}
                        alt={internshipImgAlt(internshipLabel(item))}
                        className="w-full h-full object-cover max-w-full"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {internshipHref(item) ? (
                          <Link
                            to={internshipHref(item)}
                            className="hover:text-violet-600 dark:hover:text-violet-300"
                          >
                            {internshipLabel(item)}
                          </Link>
                        ) : (
                          internshipLabel(item)
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-500">{item.company}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {item.location}
                        </span>
                        <Badge className={`${typeColors[item.work_type]} border-0 text-xs`}>{item.work_type}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.duration}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                          Internship programme fee: {internshipFeeLabel(item)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.skills?.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 self-start sm:self-center w-full sm:w-auto">
                      {internshipHref(item) ? (
                        <Link
                          to={internshipHref(item)}
                          className="inline-flex items-center justify-center rounded-xl h-10 px-6 text-sm font-semibold border border-violet-300 text-violet-700 dark:text-violet-300 dark:border-violet-500/40"
                        >
                          View program
                        </Link>
                      ) : null}
                      <Button
                        type="button"
                        className="bg-violet-600 hover:bg-violet-700 rounded-xl h-10 px-6 w-full sm:w-auto"
                        onClick={() => openApplyForm(item.title)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>

        <div className="text-center mt-10">
          <Link to="/Internships">
            <Button variant="outline" className="rounded-xl gap-2">
              View all internship programmes <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
