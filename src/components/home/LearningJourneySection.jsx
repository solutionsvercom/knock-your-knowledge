import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Play, Trophy, ChevronRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Excel",
    desc: "Master spreadsheets, formulas & data organization",
    status: "completed",
    duration: "2 weeks",
    color: "#10b981",
    glow: "rgba(16,185,129,0.5)",
  },
  {
    id: 2,
    title: "SQL",
    desc: "Query databases, joins & data manipulation",
    status: "completed",
    duration: "3 weeks",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.5)",
  },
  {
    id: 3,
    title: "Python",
    desc: "Programming basics, pandas & data analysis",
    status: "active",
    duration: "4 weeks",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.6)",
  },
  {
    id: 4,
    title: "Data Visualization",
    desc: "Charts, dashboards & storytelling with data",
    status: "locked",
    duration: "3 weeks",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.5)",
  },
  {
    id: 5,
    title: "Machine Learning",
    desc: "Models, predictions & AI fundamentals",
    status: "locked",
    duration: "5 weeks",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.5)",
  },
];

const statusIcon = (status, color) => {
  if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-white" />;
  if (status === "active") return <Play className="w-5 h-5 text-white" />;
  return <Lock className="w-4 h-4 text-white opacity-50" />;
};

export default function LearningJourneySection() {
  const [hovered, setHovered] = useState(null);
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0f0a2e 60%, #020817 100%)" }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.8) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            Learning Roadmap
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            Your AI{" "}
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              Learning Journey
            </span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            AI builds your personalized path and guides you step-by-step to your goal.
          </p>
        </motion.div>

        {/* Goal badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border"
            style={{
              background: "rgba(167,139,250,0.1)",
              borderColor: "rgba(167,139,250,0.4)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 30px rgba(167,139,250,0.15)"
            }}>
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">Goal:</span>
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              fontWeight: 700, fontSize: "1.05rem"
            }}>
              Become a Data Analyst
            </span>
          </div>
        </motion.div>

        {/* Roadmap */}
        <div className="relative">

          {/* Desktop horizontal layout */}
          <div className="hidden md:block">
            {/* Connecting line track */}
            <div className="relative flex items-center justify-between mb-4 px-16">
              {/* Background track */}
              <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Animated progress fill */}
              <motion.div
                className="absolute left-16 top-1/2 -translate-y-1/2 h-1 rounded-full"
                style={{ background: "linear-gradient(90deg, #10b981, #3b82f6, #a78bfa)" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />

              {/* Travelling pulse dot */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-10"
                style={{ background: "#a78bfa", boxShadow: "0 0 12px rgba(167,139,250,0.9), 0 0 24px rgba(167,139,250,0.5)", left: "calc(4rem)" }}
                animate={{ left: [`calc(4rem + 0%)`, `calc(4rem + ${progress - 2}%)`] }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />

              {/* Nodes */}
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  className="relative z-10 flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                >
                  {/* Node */}
                  <motion.button
                    onHoverStart={() => setHovered(i)}
                    onHoverEnd={() => setHovered(null)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center relative"
                    style={{
                      background: step.status === "locked"
                        ? "rgba(255,255,255,0.05)"
                        : `radial-gradient(circle, ${step.color}cc, ${step.color}66)`,
                      border: `2px solid ${step.status === "locked" ? "rgba(255,255,255,0.1)" : step.color}`,
                      boxShadow: step.status !== "locked"
                        ? `0 0 20px ${step.glow}, 0 0 40px ${step.glow.replace("0.5", "0.2")}`
                        : "none",
                    }}
                  >
                    {/* Pulse ring for active */}
                    {step.status === "active" && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: step.color }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    {statusIcon(step.status, step.color)}
                  </motion.button>

                  {/* Step number */}
                  <div className="mt-3 text-xs font-bold uppercase tracking-widest"
                    style={{ color: step.status === "locked" ? "rgba(255,255,255,0.2)" : step.color }}>
                    Step {step.id}
                  </div>
                  <div className="mt-1 text-sm font-bold text-white text-center"
                    style={{ opacity: step.status === "locked" ? 0.4 : 1 }}>
                    {step.title}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 text-center">{step.duration}</div>
                </motion.div>
              ))}
            </div>

            {/* Tooltip cards on hover */}
            <div className="flex justify-between px-8 mt-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : 10 }}
                  transition={{ duration: 0.2 }}
                  className="w-44 rounded-2xl p-4 border pointer-events-none"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: step.color + "66",
                    backdropFilter: "blur(20px)",
                    boxShadow: `0 0 20px ${step.glow}`
                  }}
                >
                  <p className="text-xs font-bold mb-1" style={{ color: step.color }}>{step.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile vertical layout */}
          <div className="md:hidden space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Left: node + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center relative"
                    style={{
                      background: step.status === "locked"
                        ? "rgba(255,255,255,0.05)"
                        : `radial-gradient(circle, ${step.color}cc, ${step.color}66)`,
                      border: `2px solid ${step.status === "locked" ? "rgba(255,255,255,0.1)" : step.color}`,
                      boxShadow: step.status !== "locked" ? `0 0 20px ${step.glow}` : "none",
                    }}
                  >
                    {step.status === "active" && (
                      <motion.div className="absolute inset-0 rounded-full border-2"
                        style={{ borderColor: step.color }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }} />
                    )}
                    {statusIcon(step.status, step.color)}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 h-12 mt-1 rounded-full"
                      style={{ background: i < completedCount ? `linear-gradient(180deg, ${step.color}, ${steps[i+1].color})` : "rgba(255,255,255,0.06)" }} />
                  )}
                </div>

                {/* Right: card */}
                <div className="flex-1 rounded-2xl p-4 border mb-2"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: step.status === "locked" ? "rgba(255,255,255,0.06)" : step.color + "44",
                    boxShadow: step.status !== "locked" ? `0 0 15px ${step.glow.replace("0.5","0.15")}` : "none"
                  }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-white" style={{ opacity: step.status === "locked" ? 0.4 : 1 }}>{step.title}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: step.status === "locked" ? "rgba(255,255,255,0.05)" : step.color + "22",
                        color: step.status === "locked" ? "rgba(255,255,255,0.2)" : step.color,
                        border: `1px solid ${step.status === "locked" ? "rgba(255,255,255,0.08)" : step.color + "44"}`
                      }}>
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed"
                    style={{ opacity: step.status === "locked" ? 0.5 : 1 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border"
            style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)" }}>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">{completedCount} of {steps.length} steps completed</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border"
            style={{ background: "rgba(167,139,250,0.08)", borderColor: "rgba(167,139,250,0.3)" }}>
            <ChevronRight className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Next: <span style={{ color: "#a78bfa" }}>Python Basics</span></span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}