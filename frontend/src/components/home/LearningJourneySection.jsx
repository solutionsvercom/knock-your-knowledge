import React from "react";
import { Link } from "react-router-dom";
import GetStartedLink from "@/components/navigation/GetStartedLink";

const steps = [
  {
    id: 1,
    title: "Explore internship programmes",
    desc: "Open the internships listing and the four track pages: Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing.",
  },
  {
    id: 2,
    title: "Review the track and programme fee",
    desc: "Each paid internship lists duration, skills, and the fee. Programme fee ₹3,999/- plus 18% GST. Total payable ₹4,719. You pay KYK — it is not a stipend.",
  },
  {
    id: 3,
    title: "Understand how to apply",
    desc: "Use Apply Now or Get Started to send your name, phone, and mail ID. KYK saves the form and contacts you. You can also add a programme to cart.",
  },
  {
    id: 4,
    title: "Submit through the KYK application flow",
    desc: "Sending the form or paying at checkout is how you apply on this site. KYK does not treat an application as automatically accepted.",
  },
];

export default function LearningJourneySection() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0f0a2e 60%, #020817 100%)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            How to join a programme
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            From exploring internships to applying
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            These four steps match what this website already offers. They are not a guaranteed placement path.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="rounded-2xl p-6 border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(167,139,250,0.25)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>
                Step {step.id}
              </p>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/Internships"
            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            Explore internships
          </Link>
          <GetStartedLink
            className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            Get Started
          </GetStartedLink>
        </div>
      </div>
    </section>
  );
}
