import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Software Engineer at Google",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    feedback: "SkyBrisk completely changed how I learn. The AI tutor explains concepts so well — I went from struggling with DSA to cracking a Google interview in 4 months!",
    rating: 5,
    glow: "rgba(59,130,246,0.4)",
    accent: "#60a5fa",
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist at Amazon",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    feedback: "The personalized learning path is insane! Within 6 months, I went from a complete beginner to landing a data science role at Amazon. Worth every rupee.",
    rating: 5,
    glow: "rgba(167,139,250,0.4)",
    accent: "#a78bfa",
  },
  {
    name: "Marcus Johnson",
    role: "Product Designer at Airbnb",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    feedback: "Live doubt sessions saved me so many times. Having an expert available when you're stuck at 2 AM is a game-changer. Highly recommend for serious learners.",
    rating: 5,
    glow: "rgba(16,185,129,0.4)",
    accent: "#34d399",
  },
  {
    name: "Sneha Iyer",
    role: "Full-Stack Dev at Razorpay",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop",
    feedback: "I got my internship through SkyBrisk's partner program! The courses gave me real project experience that I could actually show in interviews. Amazing platform.",
    rating: 5,
    glow: "rgba(249,115,22,0.4)",
    accent: "#fb923c",
  },
  {
    name: "Rishi Kumar",
    role: "ML Engineer at Microsoft",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop",
    feedback: "The gamification keeps me motivated every single day. Hitting streaks, earning badges — it makes studying feel like a game. Best investment in my career.",
    rating: 5,
    glow: "rgba(236,72,153,0.4)",
    accent: "#f472b6",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4" style={{ color: i < rating ? "#f59e0b" : "#334155", fill: i < rating ? "#f59e0b" : "none" }} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef(null);

  const go = (next) => {
    setDir(next > current ? 1 : -1);
    setCurrent(next);
  };

  const prev = () => go(current === 0 ? testimonials.length - 1 : current - 1);
  const next = () => go(current === testimonials.length - 1 ? 0 : current + 1);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  const resetTimer = () => { clearInterval(timerRef.current); };

  const t = testimonials[current];

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #060d1f 50%, #020817 100%)" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none rounded-full opacity-10"
        style={{ background: `radial-gradient(ellipse, ${t.glow.replace("0.4","0.9")} 0%, transparent 70%)`, transition: "background 0.8s ease" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>Student Stories</p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            What Students{" "}
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              Are Saying
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg">Real stories from learners who transformed their careers.</p>
        </motion.div>

        {/* Carousel */}
        <div className="relative flex items-center gap-4 md:gap-8">

          {/* Prev */}
          <button
            onClick={() => { resetTimer(); prev(); }}
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>

          {/* Card */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                custom={dir}
                initial={{ opacity: 0, x: dir * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -80 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="rounded-3xl p-8 md:p-10 border relative"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: t.accent + "33",
                  backdropFilter: "blur(24px)",
                  boxShadow: `0 0 60px ${t.glow}, 0 4px 32px rgba(0,0,0,0.5)`,
                }}
              >
                {/* Quote icon */}
                <div className="absolute top-8 right-8 opacity-10">
                  <Quote className="w-16 h-16" style={{ color: t.accent }} />
                </div>

                {/* Stars */}
                <StarRating rating={t.rating} />

                {/* Feedback */}
                <p className="text-slate-200 text-lg md:text-xl leading-relaxed mt-5 mb-8 font-light">
                  "{t.feedback}"
                </p>

                {/* Student info */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover"
                      style={{ border: `2px solid ${t.accent}55`, boxShadow: `0 0 16px ${t.glow}` }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: t.accent, boxShadow: `0 0 8px ${t.glow}` }}>
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{t.name}</p>
                    <p className="text-sm" style={{ color: t.accent }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}
          <button
            onClick={() => { resetTimer(); next(); }}
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-8">
          {testimonials.map((item, i) => (
            <button
              key={i}
              onClick={() => { resetTimer(); go(i); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                background: i === current ? item.accent : "rgba(255,255,255,0.15)",
                boxShadow: i === current ? `0 0 10px ${item.glow}` : "none",
              }}
            />
          ))}
        </div>

        {/* Mini avatars preview */}
        <div className="flex justify-center items-center gap-3 mt-10">
          {testimonials.map((item, i) => (
            <button key={i} onClick={() => { resetTimer(); go(i); }}>
              <img
                src={item.image}
                alt={item.name}
                className="rounded-full object-cover transition-all duration-300"
                style={{
                  width: i === current ? 44 : 32,
                  height: i === current ? 44 : 32,
                  border: `2px solid ${i === current ? item.accent : "rgba(255,255,255,0.1)"}`,
                  boxShadow: i === current ? `0 0 14px ${item.glow}` : "none",
                  opacity: i === current ? 1 : 0.4,
                }}
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}