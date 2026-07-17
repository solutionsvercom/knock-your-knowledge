import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { GraduationCap, Instagram, Youtube, ArrowRight, Mail, Phone, ExternalLink } from "lucide-react";
import {
  whatsappGetStartedUrl,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
} from "@/config/contact";

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

const platformLinks = [
  { name: "Internship Courses", page: "Courses" },
  { name: "Internships", page: "Internships" },
  { name: "Live Classes", page: "LiveClasses" },
];

const companyLinks = [
  { name: "About Us", page: "About" },
  { name: "Blog", page: "Blog" },
];

const socials = [
  { icon: Instagram, href: "#", label: "Instagram", color: "rgba(236,72,153,0.8)" },
  { icon: FacebookIcon, href: "#", label: "Facebook", color: "rgba(59,130,246,0.8)" },
  { icon: Youtube, href: "#", label: "YouTube", color: "rgba(239,68,68,0.8)" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#020817", borderTop: "1px solid rgba(139,92,246,0.15)" }}>
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), rgba(96,165,250,0.5), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  boxShadow: "0 0 18px rgba(124,58,237,0.5)",
                }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-black"
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                KYK
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "#64748b" }}>
              Every internship is a first step toward a career — learn by doing, grow with mentors, and turn ambition into experience.
            </p>

            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
              Ready to join?
            </p>
            <button
              type="button"
              onClick={() => window.open(whatsappGetStartedUrl(), "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #25d366, #128c7e)",
                boxShadow: "0 0 16px rgba(37,211,102,0.35)",
              }}
            >
              Apply Now <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>
              Platform
            </h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="group flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                    style={{ color: "#475569" }}
                  >
                    <ArrowRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#a78bfa" }}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="group flex items-center gap-1.5 text-sm transition-colors hover:text-white"
                    style={{ color: "#475569" }}
                  >
                    <ArrowRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#a78bfa" }}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support — Contact Us only */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>
              Support
            </h4>
            <p className="text-sm font-medium text-white mb-3">Contact Us</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-start gap-2 text-sm transition-colors hover:text-white"
                  style={{ color: "#475569" }}
                >
                  <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#a78bfa" }} />
                  <span className="break-all">{CONTACT_EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                  style={{ color: "#475569" }}
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#a78bfa" }} />
                  {CONTACT_PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-xs" style={{ color: "#334155" }}>
            © {new Date().getFullYear()} KYK. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
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

          <p className="text-xs text-center sm:text-right" style={{ color: "#475569" }}>
            Privacy &nbsp;·&nbsp; Terms &nbsp;·&nbsp; Cookies
            <br />
            <span style={{ color: "#334155" }}>Powered by Vercom Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
