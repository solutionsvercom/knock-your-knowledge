import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Clock, BookOpen, ChevronRight, Zap, RotateCcw } from "lucide-react";
import { api } from "@/api/apiClient";

const stepColors = [
  { border: "#3b82f6", glow: "rgba(59,130,246,0.35)", bg: "rgba(59,130,246,0.08)", accent: "#60a5fa" },
  { border: "#a78bfa", glow: "rgba(167,139,250,0.35)", bg: "rgba(167,139,250,0.08)", accent: "#c4b5fd" },
  { border: "#34d399", glow: "rgba(52,211,153,0.35)", bg: "rgba(52,211,153,0.08)", accent: "#6ee7b7" },
  { border: "#f59e0b", glow: "rgba(245,158,11,0.35)", bg: "rgba(245,158,11,0.08)", accent: "#fcd34d" },
  { border: "#ec4899", glow: "rgba(236,72,153,0.35)", bg: "rgba(236,72,153,0.08)", accent: "#f9a8d4" },
  { border: "#06b6d4", glow: "rgba(6,182,212,0.35)", bg: "rgba(6,182,212,0.08)", accent: "#67e8f9" },
];

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "#a78bfa" }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export default function AISkillGenerator() {
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!skill.trim() || loading) return;
    setLoading(true);
    setRoadmap(null);
    setError(null);

    const result = await api.ai.invokeLLM({
      prompt: `You are an expert learning coach. A student wants to learn: "${skill}".
Generate a structured learning roadmap with exactly 5-6 steps.
Return ONLY valid JSON with this exact structure:
{
  "skill": "skill name",
  "timeline": "total estimated timeline (e.g. 3-4 months)",
  "summary": "one sentence about why this skill is valuable",
  "steps": [
    {
      "step": 1,
      "title": "step title",
      "topics": ["topic1", "topic2", "topic3"],
      "duration": "e.g. 2 weeks",
      "tip": "one practical tip for this step"
    }
  ]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          skill: { type: "string" },
          timeline: { type: "string" },
          summary: { type: "string" },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                step: { type: "number" },
                title: { type: "string" },
                topics: { type: "array", items: { type: "string" } },
                duration: { type: "string" },
                tip: { type: "string" },
              },
            },
          },
        },
      },
    });

    setRoadmap(result);
    setLoading(false);
  };

  const reset = () => { setRoadmap(null); setSkill(""); setError(null); };

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0a0520 50%, #020817 100%)" }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] opacity-10 pointer-events-none rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.9) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5"
            style={{ background: "rgba(167,139,250,0.1)", borderColor: "rgba(167,139,250,0.35)" }}>
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Powered by AI</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
            AI{" "}
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              Skill Generator
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Type any skill and get a personalized AI-generated learning roadmap in seconds.
          </p>
        </motion.div>

        {/* Input */}
        <AnimatePresence>
          {!roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative mb-12"
            >
              <div
                className="flex items-center gap-3 rounded-2xl px-5 py-4 border transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: skill ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  boxShadow: skill ? "0 0 30px rgba(167,139,250,0.2), 0 0 60px rgba(167,139,250,0.08)" : "none",
                }}
              >
                <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: skill ? "#a78bfa" : "#475569" }} />
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  placeholder="What skill do you want to learn?"
                  className="flex-1 bg-transparent outline-none text-white placeholder-slate-500 text-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generate}
                  disabled={!skill.trim() || loading}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    color: "white",
                    boxShadow: skill ? "0 0 20px rgba(124,58,237,0.5)" : "none",
                  }}
                >
                  {loading ? <LoadingDots /> : <><Send className="w-4 h-4" /> Generate</>}
                </motion.button>
              </div>

              {/* Example pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Machine Learning", "React.js", "Data Analysis", "UI/UX Design", "Python"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSkill(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#94a3b8",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-12"
            >
              <div className="relative w-20 h-20">
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: "rgba(167,139,250,0.5)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2"
                  style={{ borderColor: "rgba(96,165,250,0.5)", borderTopColor: "#60a5fa" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-purple-400" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">Building your roadmap...</p>
                <p className="text-slate-400 text-sm mt-1">AI is curating the best learning path for <span style={{ color: "#a78bfa" }}>"{skill}"</span></p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roadmap result */}
        <AnimatePresence>
          {roadmap && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Summary bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl px-6 py-4 mb-8 border"
                style={{
                  background: "rgba(167,139,250,0.08)",
                  borderColor: "rgba(167,139,250,0.3)",
                  boxShadow: "0 0 30px rgba(167,139,250,0.1)"
                }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-purple-300 uppercase tracking-wide">Your Roadmap</span>
                  </div>
                  <p className="text-white font-bold text-xl">{roadmap.skill}</p>
                  <p className="text-slate-400 text-sm mt-0.5">{roadmap.summary}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold text-sm">{roadmap.timeline}</span>
                  </div>
                  <button onClick={reset} className="p-2 rounded-xl border text-slate-400 hover:text-white transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {roadmap.steps?.map((step, i) => {
                  const col = stepColors[i % stepColors.length];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-6 border group transition-all duration-300 hover:scale-[1.01]"
                      style={{
                        background: col.bg,
                        borderColor: col.border + "44",
                        boxShadow: `0 0 0 rgba(0,0,0,0)`,
                      }}
                      whileHover={{ boxShadow: `0 0 30px ${col.glow}` }}
                    >
                      <div className="flex items-start gap-5">
                        {/* Step number */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
                          style={{
                            background: col.border + "22",
                            border: `2px solid ${col.border}55`,
                            color: col.accent,
                            boxShadow: `0 0 14px ${col.glow}`,
                          }}>
                          {step.step}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <h3 className="text-white font-bold text-base">{step.title}</h3>
                            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                              style={{ background: col.border + "22", color: col.accent, border: `1px solid ${col.border}33` }}>
                              <Clock className="w-3 h-3" />
                              {step.duration}
                            </span>
                          </div>

                          {/* Topics */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {step.topics?.map((topic) => (
                              <span key={topic} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <BookOpen className="w-3 h-3" />
                                {topic}
                              </span>
                            ))}
                          </div>

                          {/* Tip */}
                          {step.tip && (
                            <div className="flex items-start gap-2 mt-2 rounded-xl px-3 py-2"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: col.accent }} />
                              <p className="text-xs text-slate-400 leading-relaxed">{step.tip}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-10"
              >
                <button onClick={reset}
                  className="px-8 py-3 rounded-2xl font-semibold text-white text-sm border transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.3))",
                    borderColor: "rgba(167,139,250,0.4)",
                    boxShadow: "0 0 20px rgba(124,58,237,0.2)"
                  }}>
                  ✨ Generate Another Roadmap
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}