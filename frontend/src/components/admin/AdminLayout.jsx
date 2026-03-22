import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import {
  GraduationCap,
  LogOut,
  Menu,
  LayoutDashboard,
  BookOpen,
  Layers,
  Shield,
  Home,
} from "lucide-react";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/bundles", label: "Bundles", icon: Layers },
  { to: "/admin/users", label: "Users", icon: Shield },
];

const ACCENT = "#a78bfa";

export default function AdminLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => api.auth.logout("/");

  return (
    <div className="min-h-screen flex" style={{ background: "#020817" }}>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "rgba(5,10,30,0.98)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #2563eb)` }}
          >
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-black text-white">KYK Admin</span>
            <p className="text-xs" style={{ color: ACCENT }}>
              Control panel
            </p>
          </div>
        </div>

        <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #4f46e5)` }}
            >
              {user?.full_name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name || "Admin"}</p>
              <p className="text-xs truncate" style={{ color: "#475569" }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    isActive
                      ? "bg-[rgba(167,139,250,0.12)] border-[rgba(167,139,250,0.25)]"
                      : "border-transparent"
                  }`
                }
                style={({ isActive }) => ({ color: isActive ? ACCENT : "#475569" })}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-red-500/10"
            style={{ color: "#475569" }}
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-14 border-b"
          style={{
            background: "rgba(2,8,23,0.9)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <button
            type="button"
            className="md:hidden p-2 rounded-lg"
            style={{ color: "#64748b" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: ACCENT }} />
            <span className="text-sm font-medium truncate" style={{ color: ACCENT }}>
              Admin
            </span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="text-xs text-slate-500 truncate hidden sm:inline">{location.pathname}</span>
          </div>
          <Link
            to="/"
            className="text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#475569",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Home className="w-3.5 h-3.5" /> Site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
