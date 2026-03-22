import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ArrowRight, ChevronDown, Zap, Brain, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GetStartedLink from "@/components/navigation/GetStartedLink";

/* ─── Neural Network Canvas ─────────────────────────────────────── */
function NeuralCanvas() {
  const canvasRef = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const layers = [3, 5, 6, 5, 3];
    const nodes = [];
    layers.forEach((count, li) => {
      const x = (W / (layers.length + 1)) * (li + 1);
      for (let ni = 0; ni < count; ni++) {
        const y = (H / (count + 1)) * (ni + 1);
        nodes.push({ x, y, layer: li, phase: Math.random() * Math.PI * 2, speed: 0.018 + Math.random() * 0.025 });
      }
    });

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      /* connections */
      nodes.forEach(a => {
        nodes.forEach(b => {
          if (b.layer !== a.layer + 1) return;
          const pulse = (Math.sin(t * 2.5 + a.phase) + 1) / 2;
          const alpha = 0.06 + pulse * 0.22;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0,   `rgba(99,102,241,${alpha})`);
          grad.addColorStop(0.5, `rgba(168,85,247,${alpha * 1.6})`);
          grad.addColorStop(1,   `rgba(59,130,246,${alpha})`);
          ctx.beginPath(); ctx.strokeStyle = grad; ctx.lineWidth = 1.2;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

          /* signal dot */
          const frac = ((t * 0.55 + a.phase * 0.4) % 1);
          ctx.beginPath();
          ctx.arc(a.x + (b.x - a.x) * frac, a.y + (b.y - a.y) * frac, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,181,253,${pulse * 0.85})`;
          ctx.fill();
        });
      });

      /* nodes */
      nodes.forEach(n => {
        const pulse = (Math.sin(t * 2 + n.phase) + 1) / 2;
        const r = 5 + pulse * 4.5;

        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.5);
        glow.addColorStop(0, `rgba(139,92,246,${0.35 + pulse * 0.45})`);
        glow.addColorStop(1, "rgba(139,92,246,0)");
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        const core = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
        core.addColorStop(0, `rgba(233,213,255,${0.9 + pulse * 0.1})`);
        core.addColorStop(1, "rgba(139,92,246,0.75)");
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = core; ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

/* ─── Floating Particles ─────────────────────────────────────────── */
const PARTICLES = [
  { w: 6, h: 6, top: "14%", left: "8%",   dur: 5.2, delay: 0,   color: "rgba(139,92,246,0.75)",  glow: "rgba(139,92,246,0.5)"  },
  { w: 4, h: 4, top: "72%", left: "6%",   dur: 4.1, delay: 1.2, color: "rgba(59,130,246,0.85)",  glow: "rgba(59,130,246,0.5)"  },
  { w: 8, h: 8, top: "28%", left: "87%",  dur: 6.3, delay: 0.4, color: "rgba(236,72,153,0.65)",  glow: "rgba(236,72,153,0.4)"  },
  { w: 5, h: 5, top: "82%", left: "82%",  dur: 5.6, delay: 2.1, color: "rgba(16,185,129,0.75)",  glow: "rgba(16,185,129,0.4)"  },
  { w: 3, h: 3, top: "55%", left: "94%",  dur: 4.7, delay: 1.6, color: "rgba(245,158,11,0.85)",  glow: "rgba(245,158,11,0.45)" },
  { w: 6, h: 6, top: "9%",  left: "57%",  dur: 5.1, delay: 0.7, color: "rgba(99,102,241,0.75)",  glow: "rgba(99,102,241,0.5)"  },
  { w: 4, h: 4, top: "91%", left: "43%",  dur: 4.4, delay: 2.6, color: "rgba(139,92,246,0.6)",   glow: "rgba(139,92,246,0.35)" },
  { w: 5, h: 5, top: "42%", left: "2%",   dur: 6.1, delay: 0.9, color: "rgba(59,130,246,0.7)",   glow: "rgba(59,130,246,0.4)"  },
  { w: 3, h: 3, top: "20%", left: "72%",  dur: 3.8, delay: 3.0, color: "rgba(6,182,212,0.8)",    glow: "rgba(6,182,212,0.45)"  },
  { w: 4, h: 4, top: "64%", left: "50%",  dur: 5.0, delay: 1.8, color: "rgba(167,139,250,0.7)",  glow: "rgba(167,139,250,0.4)" },
];

/* ─── Typing headline ────────────────────────────────────────────── */
const WORDS = ["AI Powered", "Smarter", "Faster"];
function TypingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.45 }}
        style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
      >
        {WORDS[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function HeroSection() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ background: "linear-gradient(135deg, #020817 0%, #0f0a2e 30%, #1a0a3e 60%, #0d1b4b 100%)" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.5) 0%, transparent 70%)" }} />

      {/* Particles — hidden on mobile for performance */}
      {!isMobile && PARTICLES.map((p, i) => (
        <motion.div key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: p.w, height: p.h, top: p.top, left: p.left, background: p.color, boxShadow: `0 0 ${p.w * 2.5}px ${p.glow}` }}
          animate={{ y: [-12, 12, -12], opacity: [0.35, 1, 0.35], scale: [1, 1.3, 1] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center min-h-[88vh]">

          {/* ── LEFT: Text ── */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
              style={{ background: "rgba(139,92,246,0.12)", borderColor: "rgba(139,92,246,0.4)", backdropFilter: "blur(10px)" }}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300" style={{ fontFamily: "'Inter', sans-serif" }}>Next-Gen AI Learning Platform</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="rounded-2xl p-6 mb-6 border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Learn Faster with{" "}
                <span className="inline-block"><TypingWord /></span>
                {" "}Learning
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "#94a3b8", fontFamily: "'Inter', sans-serif" }}>
              Personalized learning paths, AI mentor guidance and smart progress tracking for modern students.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-14 w-full sm:w-auto">

              <motion.div
                className="w-full sm:w-auto"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
              >
                <GetStartedLink
                  className="relative w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base overflow-hidden min-h-[52px] transition-shadow hover:shadow-lg hover:shadow-violet-500/30"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb)", boxShadow: "0 0 24px rgba(124,58,237,0.55), 0 0 48px rgba(124,58,237,0.2)", border: "1px solid rgba(167,139,250,0.4)", fontFamily: "'Inter', sans-serif" }}
                >
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }} />
                  <Zap className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="w-4 h-4 relative z-10" />
                </GetStartedLink>
              </motion.div>

              <Link to={createPageUrl("Courses")} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: "0 0 30px rgba(6,182,212,0.6), 0 0 60px rgba(6,182,212,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all min-h-[52px]"
                  style={{ background: "rgba(6,182,212,0.08)", boxShadow: "0 0 16px rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.45)", color: "#67e8f9", fontFamily: "'Inter', sans-serif" }}>
                  <Brain className="w-4 h-4" />
                  Explore Skills
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
              className="flex flex-wrap gap-7">
              {[
                { value: "50K+", label: "Active Learners", color: "#a78bfa", glow: "rgba(167,139,250,0.8)" },
                { value: "200+", label: "AI Courses",      color: "#60a5fa", glow: "rgba(96,165,250,0.8)"  },
                { value: "95%",  label: "Placement Rate",  color: "#34d399", glow: "rgba(52,211,153,0.8)"  },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-1 h-10 rounded-full" style={{ background: s.color, boxShadow: `0 0 12px ${s.glow}` }} />
                  <div>
                    <p className="text-xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.value}</p>
                    <p className="text-xs" style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 3D AI Visual ── */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15 }}
            className="relative hidden lg:flex items-center justify-center">

            {/* Outer rings — hidden on mobile to avoid overflow */}
            {[420, 340, 260].map((size, i) => (
              <motion.div key={size}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 18 + i * 5, repeat: Infinity, ease: "linear" }}
                className="absolute rounded-full border pointer-events-none hidden lg:block"
                style={{
                  width: size, height: size,
                  borderColor: [`rgba(139,92,246,0.25)`, `rgba(59,130,246,0.2)`, `rgba(6,182,212,0.15)`][i],
                  borderStyle: "dashed",
                  opacity: 0.6,
                }} />
            ))}

            {/* Outer glow ring solid */}
            <div className="absolute w-[440px] h-[440px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />

            {/* Main glass card */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px] rounded-3xl overflow-hidden border"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(139,92,246,0.35)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 0 70px rgba(124,58,237,0.35), 0 0 120px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}>

              {/* Neural canvas — skip on mobile for performance */}
              {!isMobile && <NeuralCanvas />}

              {/* Center brain pulse */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.22)", border: "1px solid rgba(167,139,250,0.5)", boxShadow: "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)" }}>
                  <Brain className="w-9 h-9 text-purple-300" />
                </motion.div>
              </div>

              {/* Top HUD */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>AI Active</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(96,165,250,0.3)" }}>
                  <span className="text-xs text-blue-400 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Neural Net v4</span>
                </div>
              </div>

              {/* Bottom HUD */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
                <div>
                  <p className="text-xs" style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}>Processing</p>
                  <p className="text-sm font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Learning Pathways</p>
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2"
                  style={{ borderTopColor: "#a78bfa", borderRightColor: "transparent", borderBottomColor: "#60a5fa", borderLeftColor: "transparent" }} />
              </div>
            </motion.div>

            {/* Floating info card – left */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -left-2 lg:-left-6 top-14 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 border"
              style={{ background: "rgba(8,4,24,0.85)", borderColor: "rgba(167,139,250,0.4)", backdropFilter: "blur(24px)", boxShadow: "0 0 24px rgba(167,139,250,0.2)" }}>
              <p className="text-xs font-medium mb-0.5" style={{ color: "#a78bfa", fontFamily: "'Inter', sans-serif" }}>AI Mentor</p>
              <p className="text-sm font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Personalized Path</p>
              <div className="flex gap-1 mt-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-1.5 rounded-full"
                    style={{ width: i === 5 ? 8 : 14, background: i <= 4 ? "#7c3aed" : "rgba(255,255,255,0.1)" }} />
                ))}
              </div>
            </motion.div>

            {/* Floating info card – right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
              className="absolute -right-2 lg:-right-6 bottom-20 rounded-2xl px-3 py-2 lg:px-4 lg:py-3 border"
              style={{ background: "rgba(8,4,24,0.85)", borderColor: "rgba(6,182,212,0.4)", backdropFilter: "blur(24px)", boxShadow: "0 0 24px rgba(6,182,212,0.2)" }}>
              <p className="text-xs font-medium mb-0.5" style={{ color: "#06b6d4", fontFamily: "'Inter', sans-serif" }}>Progress</p>
              <p className="text-sm font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>87% Complete</p>
              <div className="w-28 h-1.5 rounded-full mt-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #06b6d4, #7c3aed)" }}
                  initial={{ width: 0 }} animate={{ width: "87%" }} transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }} />
              </div>
            </motion.div>

            {/* Floating badge – top right */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              className="absolute -right-2 lg:-right-4 top-6 rounded-xl px-3 py-2 border"
              style={{ background: "rgba(8,4,24,0.85)", borderColor: "rgba(52,211,153,0.4)", backdropFilter: "blur(24px)", boxShadow: "0 0 18px rgba(52,211,153,0.15)" }}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
                <span className="text-xs font-bold" style={{ color: "#34d399", fontFamily: "'Inter', sans-serif" }}>+24 XP earned</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
        <span className="text-xs uppercase tracking-widest" style={{ color: "#334155", fontFamily: "'Inter', sans-serif" }}>Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-1.5"
          style={{ borderColor: "rgba(139,92,246,0.45)" }}>
          <motion.div className="w-1.5 h-3 rounded-full"
            style={{ background: "rgba(139,92,246,0.9)" }}
            animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
        </div>
        <ChevronDown className="w-4 h-4 text-purple-500" />
      </motion.div>
    </section>
  );
}