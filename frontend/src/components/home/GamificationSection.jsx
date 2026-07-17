import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Flame, Star, Award, Trophy, Zap, Shield, Code, Brain, TrendingUp, Medal } from "lucide-react";

function useCountUp(target, duration = 1800, inView) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);
  return count;
}

function AnimatedCard({ children, glowColor, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative rounded-2xl p-6 border group cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor.replace("0.5", "0.2")}` }}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border"
        style={{ borderColor: glowColor }}
      />
      {children}
    </motion.div>
  );
}

const badges = [
  { icon: Flame, label: "Hot Streak", color: "#f97316", bg: "rgba(249,115,22,0.15)", earned: true },
  { icon: Code, label: "Code Master", color: "#3b82f6", bg: "rgba(59,130,246,0.15)", earned: true },
  { icon: Brain, label: "AI Scholar", color: "#a78bfa", bg: "rgba(167,139,250,0.15)", earned: true },
  { icon: Shield, label: "Quiz Hero", color: "#10b981", bg: "rgba(16,185,129,0.15)", earned: true },
  { icon: Star, label: "Top Learner", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", earned: false },
  { icon: Zap, label: "Speed Run", color: "#ec4899", bg: "rgba(236,72,153,0.15)", earned: false },
];

const leaderboard = [
  { rank: 1, name: "Aarav S.", points: 9820, avatar: "A", color: "#f59e0b" },
  { rank: 2, name: "Priya M.", points: 8740, avatar: "P", color: "#94a3b8" },
  { rank: 3, name: "Rishi K.", points: 7590, avatar: "R", color: "#cd7c2f" },
  { rank: 4, name: "You", points: 6230, avatar: "Y", color: "#a78bfa", isMe: true },
  { rank: 5, name: "Sneha T.", points: 5810, avatar: "S", color: "#94a3b8" },
];

function StreakCard({ inView }) {
  const streak = useCountUp(14, 1200, inView);
  return (
    <AnimatedCard glowColor="rgba(249,115,22,0.5)" delay={0}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
          <Flame className="w-6 h-6 text-orange-400" />
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.3)" }}>
          🔥 On Fire!
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-1">Daily Learning Streak</p>
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black text-white">{streak}</span>
        <span className="text-orange-400 text-xl font-bold mb-1">days</span>
      </div>
      <div className="flex gap-1.5 mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 h-2 rounded-full"
            style={{ background: i < 5 ? "linear-gradient(90deg, #f97316, #fb923c)" : "rgba(255,255,255,0.08)",
              boxShadow: i < 5 ? "0 0 6px rgba(249,115,22,0.6)" : "none" }} />
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">Last 7 days • Keep it going!</p>
    </AnimatedCard>
  );
}

function PointsCard({ inView }) {
  const pts = useCountUp(6230, 2000, inView);
  return (
    <AnimatedCard glowColor="rgba(245,158,11,0.5)" delay={0.1}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
          <Star className="w-6 h-6 text-yellow-400" />
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" }}>
          +120 today
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-1">Points Earned</p>
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black text-white">{pts.toLocaleString()}</span>
        <span className="text-yellow-400 text-xl font-bold mb-1">XP</span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Level 12</span><span>Level 13</span>
        </div>
        <div className="w-full h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)", boxShadow: "0 0 10px rgba(245,158,11,0.6)" }}
            initial={{ width: 0 }}
            whileInView={{ width: "72%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }} />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">1,770 XP to next level</p>
      </div>
    </AnimatedCard>
  );
}

function BadgesCard() {
  return (
    <AnimatedCard glowColor="rgba(167,139,250,0.5)" delay={0.2}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}>
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.3)" }}>
          4 / 6 earned
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-4">Skill Badges</p>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge) => (
          <motion.div
            key={badge.label}
            whileHover={{ scale: badge.earned ? 1.1 : 1 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
              style={{
                background: badge.earned ? badge.bg : "rgba(255,255,255,0.03)",
                border: `1px solid ${badge.earned ? badge.color + "44" : "rgba(255,255,255,0.06)"}`,
                boxShadow: badge.earned ? `0 0 14px ${badge.color}44` : "none",
                opacity: badge.earned ? 1 : 0.35,
                filter: badge.earned ? "none" : "grayscale(100%)"
              }}>
              <badge.icon className="w-5 h-5" style={{ color: badge.earned ? badge.color : "#475569" }} />
              {!badge.earned && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.4)" }}>
                  <span className="text-slate-500 text-xs">🔒</span>
                </div>
              )}
            </div>
            <span className="text-xs text-center leading-tight"
              style={{ color: badge.earned ? "#94a3b8" : "#334155" }}>
              {badge.label}
            </span>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
}

function LeaderboardCard() {
  return (
    <AnimatedCard glowColor="rgba(59,130,246,0.5)" delay={0.3}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
          <Trophy className="w-6 h-6 text-blue-400" />
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>
          <TrendingUp className="w-3 h-3 inline mr-1" />+2 this week
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-4">Leaderboard Ranking</p>
      <div className="space-y-2.5">
        {leaderboard.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2"
            style={{
              background: entry.isMe ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${entry.isMe ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.04)"}`,
              boxShadow: entry.isMe ? "0 0 15px rgba(167,139,250,0.15)" : "none"
            }}
          >
            <div className="w-6 text-center">
              {entry.rank <= 3
                ? <Medal className="w-4 h-4 mx-auto" style={{ color: entry.color }} />
                : <span className="text-xs text-slate-500 font-bold">#{entry.rank}</span>}
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: entry.color + "33", color: entry.color, border: `1px solid ${entry.color}44` }}>
              {entry.avatar}
            </div>
            <span className="flex-1 text-sm font-medium" style={{ color: entry.isMe ? "#c4b5fd" : "#e2e8f0" }}>
              {entry.name} {entry.isMe && <span className="text-xs text-purple-400">(You)</span>}
            </span>
            <span className="text-xs font-bold" style={{ color: entry.isMe ? "#a78bfa" : "#64748b" }}>
              {entry.points.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
}

export default function GamificationSection() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0a0520 50%, #020817 100%)" }}
    >
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-10 pointer-events-none rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.8) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>
            Gamification
          </p>
          <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
            Stay{" "}
            <span style={{
              background: "linear-gradient(90deg, #f97316, #f59e0b, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              Motivated
            </span>
            {" "}While Learning
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            Earn points, unlock badges, maintain streaks, and compete with peers to supercharge your learning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          <StreakCard inView={inView} />
          <PointsCard inView={inView} />
          <BadgesCard />
          <LeaderboardCard />
        </div>
      </div>
    </section>
  );
}