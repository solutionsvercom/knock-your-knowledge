import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import { asArray } from "@/lib/asArray";
import { ApiQueryStatus } from "@/components/common/ApiQueryStatus";
import { Search, MapPin, Clock, DollarSign, Building2, Calendar, Users, Bookmark } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const typeStyles = {
  remote: { background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" },
  hybrid: { background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" },
  onsite: { background: "rgba(251,146,60,0.1)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.25)" },
};

const LOGO_FALLBACK =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80";

export default function Internships() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [duration, setDuration] = useState("all");

  const {
    data: internshipsRaw,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["internships"],
    queryFn: () => api.internships.list(),
  });

  const internships = asArray(internshipsRaw);

  const filtered = internships.filter((item) => {
    const matchSearch = !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.company?.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "all" || item.work_type === type;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      {/* Header */}
      <div className="py-16 border-b" style={{ borderColor: "rgba(167,139,250,0.15)", background: "linear-gradient(180deg, rgba(124,58,237,0.05) 0%, transparent 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>Career Launch</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Internship{" "}
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Opportunities
            </span>
          </h1>
          <p style={{ color: "#475569" }}>Launch your career with real-world experience at top companies</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats — derived from live API count */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: String(internships.length), label: "Listings (API)", color: "#60a5fa" },
            { value: String(new Set(internships.map((i) => i.company).filter(Boolean)).size), label: "Companies", color: "#a78bfa" },
            { value: internships.length ? "Live data" : "—", label: "Source", color: "#34d399" },
            { value: "API", label: "Integration", color: "#06b6d4" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-5 text-center transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: `0 0 20px ${stat.color}11` }}>
              <p className="text-2xl font-black" style={{ color: stat.color, fontFamily: "'Poppins', sans-serif" }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: "#475569" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
            <input
              placeholder="Search by title, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 h-11 rounded-xl text-sm outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[160px] h-11 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
              <MapPin className="w-4 h-4 mr-2" style={{ color: "#475569" }} />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent style={{ background: "#0f172a", border: "1px solid rgba(167,139,250,0.2)" }}>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
            </SelectContent>
          </Select>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-[160px] h-11 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
              <Clock className="w-4 h-4 mr-2" style={{ color: "#475569" }} />
              <SelectValue placeholder="Any Duration" />
            </SelectTrigger>
            <SelectContent style={{ background: "#0f172a", border: "1px solid rgba(167,139,250,0.2)" }}>
              <SelectItem value="all">Any Duration</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="4">4 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isLoading && !isError ? (
          <p className="text-sm mb-6" style={{ color: "#475569" }}>
            Showing <span className="font-semibold" style={{ color: "#a78bfa" }}>{filtered.length}</span> internships
          </p>
        ) : null}

        <ApiQueryStatus
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          loadingLabel="Loading internships from API…"
        >
        {/* Listings */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(96,165,250,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <img src={item.company_logo || LOGO_FALLBACK} alt={item.company || ""} className="w-full h-full object-cover max-w-full" loading="lazy" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: "#475569" }}>
                    <Building2 className="w-3.5 h-3.5" />{item.company}
                  </div>
                  <p className="text-sm mt-2" style={{ color: "#475569" }}>{item.description}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm" style={{ color: "#475569" }}>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{item.location}</span>
                    {item.work_type && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={typeStyles[item.work_type] || {}}>
                        {item.work_type}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{item.duration}</span>
                    <span className="flex items-center gap-1 font-medium" style={{ color: "#34d399" }}>
                      <DollarSign className="w-3.5 h-3.5" />{item.stipend}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.skills?.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 self-start lg:self-center flex-shrink-0 w-full lg:w-auto">
                  <button className="w-full lg:w-auto min-h-[48px] px-6 rounded-xl text-base font-semibold text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 16px rgba(59,130,246,0.3)" }}>
                    Apply Now
                  </button>
                  <button className="w-full lg:w-auto min-h-[48px] px-6 rounded-xl text-base font-medium flex items-center gap-2 justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}>
                    <Bookmark className="w-3.5 h-3.5" /> Save
                  </button>
                  <div className="text-xs text-center mt-1" style={{ color: "#334155" }}>
                    {item.deadline && (
                      <span className="flex items-center gap-1 justify-center">
                        <Calendar className="w-3 h-3" /> {format(new Date(item.deadline), "MMM d, yyyy")}
                      </span>
                    )}
                    <span className="flex items-center gap-1 justify-center mt-0.5">
                      <Users className="w-3 h-3" /> {item.applicants} applicants • {item.openings} openings
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!isLoading && !isError && internships.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: "#475569" }}>
            No internships returned from the API yet. Add records via the backend or admin when available.
          </p>
        ) : null}
        </ApiQueryStatus>
      </div>
    </div>
  );
}