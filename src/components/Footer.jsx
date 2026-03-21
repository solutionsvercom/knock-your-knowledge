import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { GraduationCap, Send, Twitter, Linkedin, Instagram, Youtube, Github, ArrowRight } from "lucide-react";

const navCols = [
  {
    title: "Platform",
    links: [
      { name: "Courses", page: "Courses" },
      { name: "Internships", page: "Internships" },
      { name: "Live Classes", page: "LiveClasses" },
      { name: "AI Tutor", page: "AITutor" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "FAQs", href: "#" },
      { name: "Refund Policy", href: "#" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "#", label: "Twitter", color: "rgba(96,165,250,0.8)" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "rgba(167,139,250,0.8)" },
  { icon: Instagram, href: "#", label: "Instagram", color: "rgba(236,72,153,0.8)" },
  { icon: Youtube, href: "#", label: "YouTube", color: "rgba(239,68,68,0.8)" },
  { icon: Github, href: "#", label: "GitHub", color: "rgba(148,163,184,0.8)" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer style={{ background: "#020817", borderTop: "1px solid rgba(139,92,246,0.15)" }}>
      {/* Top glow line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), rgba(96,165,250,0.5), transparent)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 18px rgba(124,58,237,0.5)" }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black"
                style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                SkyBrisk
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "#64748b" }}>
              Empowering learners worldwide with AI-driven education, expert courses, and real career opportunities.
            </p>

            {/* Newsletter */}
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>Newsletter</p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#34d399" }}>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                You're subscribed! 🎉
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(167,139,250,0.25)", background: "rgba(255,255,255,0.03)" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-transparent text-sm outline-none placeholder-slate-600"
                  style={{ color: "#cbd5e1" }}
                />
                <button type="submit"
                  className="px-4 py-2.5 flex items-center gap-1 text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white", minWidth: 90 }}>
                  <Send className="w-3.5 h-3.5" /> Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Nav cols */}
          {navCols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {link.page ? (
                      <Link to={createPageUrl(link.page)}
                        className="group flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                        style={{ color: "#475569" }}>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#a78bfa" }} />
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.href}
                        className="group flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                        style={{ color: "#475569" }}>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#a78bfa" }} />
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-xs" style={{ color: "#334155" }}>
            © {new Date().getFullYear()} SkyBrisk. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#475569",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = s.color.replace("0.8", "0.5");
                  e.currentTarget.style.boxShadow = `0 0 14px ${s.color.replace("0.8", "0.4")}`;
                  e.currentTarget.style.color = "#e2e8f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.color = "#475569";
                }}
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <p className="text-xs" style={{ color: "#1e293b" }}>
            Privacy &nbsp;·&nbsp; Terms &nbsp;·&nbsp; Cookies
          </p>
        </div>
      </div>
    </footer>
  );
}