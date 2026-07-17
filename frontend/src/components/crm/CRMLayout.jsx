import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "@/api/apiClient";
import { GraduationCap, LogOut, Menu, X, ChevronRight } from "lucide-react";

export default function CRMLayout({ user, navItems, children, accentColor = "#a78bfa", roleLabel }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => api.auth.logout("/");

  return (
    <div className="min-h-screen flex" style={{ background: "#020817" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "rgba(5,10,30,0.98)", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #2563eb)` }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-black text-white">SkyBrisk</span>
            <p className="text-xs" style={{ color: accentColor }}>{roleLabel}</p>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #4f46e5)` }}>
              {user?.full_name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name || "User"}</p>
              <p className="text-xs truncate" style={{ color: "#475569" }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.hash === `#${item.id}` || (!location.hash && item.default);
            return (
              <a key={item.id} href={`#${item.id}`}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? `rgba(${accentColor === "#a78bfa" ? "167,139,250" : accentColor === "#34d399" ? "52,211,153" : accentColor === "#fb923c" ? "251,146,60" : "96,165,250"},0.12)` : "transparent",
                  color: active ? accentColor : "#475569",
                  border: active ? `1px solid ${accentColor}30` : "1px solid transparent",
                }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-500/10"
            style={{ color: "#475569" }}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-14 border-b"
          style={{ background: "rgba(2,8,23,0.9)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.07)" }}>
          <button className="md:hidden p-2 rounded-lg" style={{ color: "#64748b" }} onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accentColor }} />
            <span className="text-sm font-medium" style={{ color: accentColor }}>{roleLabel} Portal</span>
          </div>
          <Link to="/" className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", color: "#475569", border: "1px solid rgba(255,255,255,0.07)" }}>
            ← Public Site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}