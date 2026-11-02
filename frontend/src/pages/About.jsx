import React from "react";
import { Link } from "react-router-dom";
import GetStartedLink from "@/components/navigation/GetStartedLink";
import { seoForPath } from "@/config/seo";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/config/contact";
import { ArrowRight, Sparkles } from "lucide-react";

const pageSeo = seoForPath("/About");

const INTERNSHIP_LINKS = [
  { to: "/Internships/development", text: "Development Internship" },
  { to: "/Internships/ai", text: "AI & Prompt Engineering Internship" },
  { to: "/Internships/analytics", text: "Business Analytics Internship" },
  { to: "/Internships/marketing", text: "Advanced Digital Marketing Internship" },
];

const BUNDLE_LINKS = [
  { to: "/Bundles/development", text: "Development Bundle" },
  { to: "/Bundles/ai", text: "AI & Prompt Engineering Bundle" },
  { to: "/Bundles/analytics", text: "Business Analytics Bundle" },
  { to: "/Bundles/marketing", text: "Advanced Digital Marketing Bundle" },
];

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <div
        className="py-16 border-b"
        style={{
          borderColor: "rgba(167,139,250,0.15)",
          background: "linear-gradient(180deg, rgba(124,58,237,0.07) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            About KYK
          </p>
          <h1
            className="text-4xl lg:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {pageSeo.h1}
          </h1>
          <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            A paid internship platform for Development, AI, Analytics and Digital Marketing
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            Knock Your Knowledge (KYK) is a paid, real-time internship platform. Students and graduates can explore four
            internship programmes, plus separate courses and course bundles on the same tracks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <section>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Who KYK is
          </h2>
          <p className="text-sm leading-relaxed mb-4 max-w-3xl" style={{ color: "#94a3b8" }}>
            Knock Your Knowledge started with a simple belief: every internship is a first step toward a career. KYK
            publishes paid internship programmes and related learning products so you can compare options and apply
            through this website.
          </p>
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: "#94a3b8" }}>
            KYK is not a video-only LMS. Course pages may include listed lessons, but the core offering on this site is
            paid internship programmes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Paid internships versus courses and bundles
          </h2>
          <p className="text-sm leading-relaxed mb-4 max-w-3xl" style={{ color: "#94a3b8" }}>
            Internships, courses, and bundles are different products. An internship programme is not a course pack, and
            a bundle is not an internship.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 className="text-sm font-bold text-white mb-2">Paid internships</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                Four paid, real-time programmes. The intern pays KYK a programme fee. It is not a stipend or salary.
                Listed fee ₹3,999/- plus 18% GST (₹720), total payable ₹4,719.
              </p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 className="text-sm font-bold text-white mb-2">Courses</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                KYK lists 17 courses across the four tracks. Each course has its own page and fee. Courses are not the
                internship programmes.
              </p>
            </div>
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 className="text-sm font-bold text-white mb-2">Bundles</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                Four course bundles group listed courses on a track. A bundle is a course pack, not an internship.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Four internship programmes
          </h2>
          <p className="text-sm leading-relaxed mb-4 max-w-3xl" style={{ color: "#94a3b8" }}>
            The four tracks are Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing.
            Open a programme page for duration, skills, and how to apply.
          </p>
          <p className="text-sm mb-3">
            <Link to="/Internships" className="inline-flex items-center gap-2 font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              All internship programmes <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {INTERNSHIP_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Courses, bundles and Career Guide
          </h2>
          <p className="text-sm leading-relaxed mb-4 max-w-3xl" style={{ color: "#94a3b8" }}>
            If you want a listed course or a track pack instead of an internship, use Courses or Bundles. The Career
            Guide has two articles on landing a first internship and internship interview prep.
          </p>
          <p className="text-sm mb-3">
            <Link to="/Courses" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              All 17 courses
            </Link>
            <span style={{ color: "#64748b" }}> · </span>
            <Link to="/Bundles" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              All course bundles
            </Link>
            <span style={{ color: "#64748b" }}> · </span>
            <Link to="/Blog" className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              Career Guide
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
        </section>

        <section>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Who can explore KYK
          </h2>
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: "#94a3b8" }}>
            KYK does not publish degree, age, or experience cut-offs on this page. Anyone comparing a paid internship
            with a course or bundle on the Development, AI, Analytics, or Digital Marketing tracks can use this site to
            read the listings and apply.
          </p>
        </section>

        <section
          className="rounded-2xl p-8 lg:p-10"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            How to apply and contact KYK
          </h2>
          <p className="text-sm max-w-2xl mb-4" style={{ color: "#94a3b8" }}>
            Use Apply Now or Get Started to send your name, phone, and mail ID. KYK saves the form and contacts you.
            You can also add an internship to cart and pay the programme fee plus GST at checkout. There is no separate
            Contact page.
          </p>
          <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
            Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              {CONTACT_EMAIL}
            </a>
            {" · "}
            Phone{" "}
            <a href={`tel:${CONTACT_PHONE_TEL}`} className="font-semibold hover:text-violet-200" style={{ color: "#a78bfa" }}>
              {CONTACT_PHONE}
            </a>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/Internships"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              Explore internships <ArrowRight className="w-4 h-4" />
            </Link>
            <GetStartedLink
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Sparkles className="w-4 h-4" /> Get Started
            </GetStartedLink>
          </div>
        </section>
      </div>
    </div>
  );
}
