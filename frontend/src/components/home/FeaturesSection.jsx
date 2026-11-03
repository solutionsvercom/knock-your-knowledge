import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, BookOpen, Layers, Send } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Four paid internships",
    description:
      "Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing. Each is a paid, real-time programme — not a course pack.",
    to: "/Internships",
    linkText: "All internship programmes",
  },
  {
    icon: BookOpen,
    title: "17 courses",
    description:
      "KYK lists 17 courses across the same four tracks. A course has its own page and fee. Courses are not internships.",
    to: "/Courses",
    linkText: "All 17 courses",
  },
  {
    icon: Layers,
    title: "Four course bundles",
    description:
      "Four bundles group listed courses on a track. A bundle is a course pack, not an internship.",
    to: "/Bundles",
    linkText: "All course bundles",
  },
  {
    icon: Send,
    title: "How to apply",
    description:
      "Use Apply Now or Get Started to send your name, phone, and mail ID. You can also add an internship to cart and pay the programme fee plus GST.",
    to: "/About",
    linkText: "About KYK",
  },
];

const BUNDLE_LINKS = [
  { to: "/Bundles/development", text: "Development Bundle" },
  { to: "/Bundles/ai", text: "AI & Prompt Engineering Bundle" },
  { to: "/Bundles/analytics", text: "Business Analytics Bundle" },
  { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
];

export default function FeaturesSection() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d1b4b 0%, #0f0a2e 50%, #020817 100%)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            What KYK offers
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            Internships, courses and bundles are different products
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            Compare a paid internship with a listed course or a track bundle, then apply or enrol from this site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-10">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="relative rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-violet-600/30">
                <feat.icon className="w-6 h-6 text-violet-200" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{feat.description}</p>
              <Link to={feat.to} className="text-sm font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                {feat.linkText}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-sm mb-3">
          <Link to="/Blog" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
            Career Guide
          </Link>
          <span style={{ color: "#64748b" }}> · </span>
          <Link to="/Bundles" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
            Course bundles
          </Link>
        </p>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {BUNDLE_LINKS.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
