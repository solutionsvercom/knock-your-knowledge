import React from "react";

export default function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="rounded-2xl p-5 transition-all hover:scale-[1.02]"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: `0 0 20px ${color}11` }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: "#475569" }}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "#334155" }}>{sub}</p>}
    </div>
  );
}