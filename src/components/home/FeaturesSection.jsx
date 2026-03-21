import React from "react";
import { Bot, Map, BarChart3, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Bot,
    title: "AI Mentor",
    description: "Ask questions and receive instant AI-powered explanations tailored to your level.",
    gradient: "from-purple-500 to-indigo-500",
    glow: "rgba(139,92,246,0.4)",
    border: "rgba(139,92,246,0.4)",
  },
  {
    icon: Map,
    title: "Personalized Learning Paths",
    description: "AI creates a custom roadmap based on your learning goals and current skill level.",
    gradient: "from-blue-500 to-cyan-400",
    glow: "rgba(59,130,246,0.4)",
    border: "rgba(59,130,246,0.4)",
  },
  {
    icon: BarChart3,
    title: "Smart Progress Tracking",
    description: "Track completed lessons, streaks, and skill growth with intelligent insights.",
    gradient: "from-emerald-500 to-teal-400",
    glow: "rgba(16,185,129,0.4)",
    border: "rgba(16,185,129,0.4)",
  },
  {
    icon: Zap,
    title: "Interactive Quizzes",
    description: "Practice with AI-generated quizzes and challenges to reinforce your learning.",
    gradient: "from-pink-500 to-rose-400",
    glow: "rgba(236,72,153,0.4)",
    border: "rgba(236,72,153,0.4)",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d1b4b 0%, #0f0a2e 50%, #020817 100%)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#a78bfa" }}>
            Platform Features
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            Why Students{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Love This Platform
            </span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            Everything you need to learn smarter, faster, and with confidence.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -10, transition: { duration: 0.25 } }}
              className="relative rounded-2xl p-6 cursor-pointer group"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid transparent",
                backgroundClip: "padding-box",
                boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
              }}
            >
              {/* Gradient border via pseudo-layer */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${feat.border}, transparent 60%)`,
                  padding: "1px",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  border: `1px solid ${feat.border}`,
                  borderRadius: "1rem",
                }}
              />

              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `0 0 40px ${feat.glow}` }}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br ${feat.gradient}`}
                style={{ boxShadow: `0 0 20px ${feat.glow}` }}
              >
                <feat.icon className="w-7 h-7 text-white" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>

              {/* Bottom accent line */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}