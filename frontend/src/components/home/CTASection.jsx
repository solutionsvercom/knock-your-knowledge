import React, { useState } from "react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import GetStartedLink from "@/components/navigation/GetStartedLink";

export default function CTASection() {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0d0628 40%, #020817 100%)" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,1) 0%, transparent 65%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] pointer-events-none rounded-full opacity-15"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.8) 0%, transparent 65%)" }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            background: ["#a78bfa","#60a5fa","#34d399","#f59e0b","#ec4899","#06b6d4"][i],
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
            boxShadow: `0 0 8px ${["rgba(167,139,250,0.8)","rgba(96,165,250,0.8)","rgba(52,211,153,0.8)","rgba(245,158,11,0.8)","rgba(236,72,153,0.8)","rgba(6,182,212,0.8)"][i]}`,
          }}
          animate={{ y: [-10, 10, -10], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
          style={{ background: "rgba(167,139,250,0.1)", borderColor: "rgba(167,139,250,0.35)" }}
        >
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-purple-300">Join 50,000+ learners worldwide</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6"
        >
          Start Your{" "}
          <span style={{
            background: "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>
            AI Learning
          </span>
          <br />Journey Today
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg lg:text-xl mb-12 max-w-xl mx-auto leading-relaxed"
        >
          Join thousands of students learning faster with AI.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <motion.div
            className="w-full sm:w-auto"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <GetStartedLink
              className="relative w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden min-h-[52px]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb)",
                boxShadow: hovered
                  ? "0 0 40px rgba(124,58,237,0.8), 0 0 80px rgba(124,58,237,0.4), 0 0 120px rgba(79,70,229,0.2)"
                  : "0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.15)",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              />
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-5 h-5 relative z-10" />
            </GetStartedLink>
          </motion.div>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="text-sm text-slate-500 mt-6"
        >
          No credit card required &nbsp;·&nbsp; Free forever plan &nbsp;·&nbsp; Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}