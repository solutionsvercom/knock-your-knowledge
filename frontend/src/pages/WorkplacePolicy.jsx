import React from "react";
import { Link } from "react-router-dom";
import { seoForPath } from "@/config/seo";

const pageSeo = seoForPath("/WorkplacePolicy");

const POLICY_POINTS = [
  {
    title: "Flexible Work Environment",
    body: "Employees may work remotely or from the office, depending on their role, responsibilities and project requirements.",
  },
  {
    title: "Office Collaboration",
    body: "Team members may be required to attend office meetings, training sessions, team discussions and important project activities when scheduled.",
  },
  {
    title: "Working Hours",
    body: "Employees are expected to follow their assigned working hours and remain available during designated team collaboration hours.",
  },
  {
    title: "Communication",
    body: "Team members must maintain regular communication with managers and colleagues through approved communication channels.",
  },
  {
    title: "Productivity & Accountability",
    body: "Employees are responsible for completing assigned tasks, meeting deadlines and maintaining work quality regardless of their work location.",
  },
  {
    title: "Meetings & Attendance",
    body: "Employees must attend scheduled online and offline meetings and inform their reporting manager about planned leave or unavailability.",
  },
  {
    title: "Data Security",
    body: "Employees must protect company information, maintain confidentiality and follow company data-security guidelines while working remotely.",
  },
  {
    title: "Policy Flexibility",
    body: "Remote and office attendance arrangements may vary according to business requirements, project needs and management decisions.",
  },
];

export default function WorkplacePolicy() {
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
            Company policy
          </p>
          <h1
            className="text-4xl lg:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {pageSeo.h1}
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            Knock Your Knowledge follows a flexible hybrid working model that combines remote work with in-office
            collaboration to maintain productivity, teamwork and professional development.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our Workplace Policy
          </h2>
          <div className="space-y-4">
            {POLICY_POINTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our Approach
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            At KYK, we believe that flexibility and accountability go hand in hand. Our hybrid workplace is designed to
            encourage collaboration, continuous learning, professional growth and a healthy work-life balance.
          </p>
        </section>

        <p className="text-sm" style={{ color: "#64748b" }}>
          Related:{" "}
          <Link to="/PrivacyPolicy" className="underline" style={{ color: "#a78bfa" }}>
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link to="/About" className="underline" style={{ color: "#a78bfa" }}>
            About KYK
          </Link>
        </p>
      </div>
    </div>
  );
}
