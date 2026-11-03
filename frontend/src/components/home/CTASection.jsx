import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import GetStartedLink from "@/components/navigation/GetStartedLink";

export default function CTASection() {
  return (
    <section
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0d0628 40%, #020817 100%)" }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          Explore KYK paid internships
        </h2>
        <p className="text-slate-400 text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Open a programme page for duration, skills, and the fee paid to KYK. Courses, bundles, the Career Guide, and
          About Us are linked from this homepage too.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-8">
          <Link
            to="/Internships"
            className="relative w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg text-white min-h-[52px]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb)" }}
          >
            Explore internships
            <ArrowRight className="w-5 h-5" />
          </Link>
          <GetStartedLink
            className="relative w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg text-white min-h-[52px]"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Sparkles className="w-5 h-5" />
            Get Started
          </GetStartedLink>
        </div>
        <p className="text-sm">
          <Link to="/Blog" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
            Career Guide
          </Link>
          <span style={{ color: "#64748b" }}> · </span>
          <Link to="/About" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
            About KYK
          </Link>
        </p>
      </div>
    </section>
  );
}
