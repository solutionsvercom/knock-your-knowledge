import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GetStartedLink from "@/components/navigation/GetStartedLink";
import {
  Target,
  Users,
  Award,
  Briefcase,
  HeartHandshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Learn by doing",
    desc: "Internship courses built around projects, practice, and mentor feedback — not just lectures.",
    color: "#60a5fa",
  },
  {
    icon: Briefcase,
    title: "Career-first paths",
    desc: "Tracks in Development, AI, Business Analytics, and Digital Marketing aligned to real roles.",
    color: "#a78bfa",
  },
  {
    icon: HeartHandshake,
    title: "Placement assistance",
    desc: "100% placement assistance with guidance so you can apply confidently to internship programs.",
    color: "#34d399",
  },
  {
    icon: Users,
    title: "Growing community",
    desc: "50+ interns every month joining KYK to build skills and start their careers.",
    color: "#fb923c",
  },
];

const STATS = [
  { value: "19+", label: "Internship Courses" },
  { value: "25+", label: "Partner Companies" },
  { value: "10+", label: "States" },
  { value: "100%", label: "Placement Assistance" },
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
            Knock Your{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Knowledge
            </span>
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#64748b" }}>
            We help learners turn ambition into experience — through internship courses, real programs, and career support that opens doors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
              Our story
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Built for interns who want to grow
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748b" }}>
              Knock Your Knowledge (KYK) started with a simple belief: every internship is a first step toward a career.
              We combine practical internship courses with mentor-led learning so students can build skills that companies actually need.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#64748b" }}>
              From Development and AI & Prompt Engineering to Business Analytics and Advanced Digital Marketing, our programs
              prepare you for real workplaces — travel companies, hospitals, play schools, tech firms, career platforms, restaurants, gyms, and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={createPageUrl("Courses")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                Internship Courses <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={createPageUrl("Blog")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                }}
              >
                Read our blogs
              </Link>
            </div>
          </div>
          <div
            className="rounded-2xl p-8 grid grid-cols-2 gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-5 text-center"
                style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}
              >
                <p className="text-2xl font-black" style={{ color: "#a78bfa", fontFamily: "'Poppins', sans-serif" }}>
                  {s.value}
                </p>
                <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
              What we stand for
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Why learners choose KYK
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl p-6 transition-all hover:translate-y-[-2px]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${v.color}18`, border: `1px solid ${v.color}40` }}
                >
                  <v.icon className="w-5 h-5" style={{ color: v.color }} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div
          className="rounded-2xl p-8 lg:p-10 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <Award className="w-10 h-10 mx-auto mb-4" style={{ color: "#fbbf24" }} />
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our mission
          </h2>
          <p className="text-sm max-w-2xl mx-auto mb-8" style={{ color: "#94a3b8" }}>
            To empower every learner with internship-ready skills, mentor support, and opportunities that turn learning into a career journey — across 10+ states and 25+ partner companies.
          </p>
          <GetStartedLink
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 16px rgba(124,58,237,0.35)",
            }}
          >
            <Sparkles className="w-4 h-4" /> Get Started
          </GetStartedLink>
        </div>
      </div>
    </div>
  );
}
