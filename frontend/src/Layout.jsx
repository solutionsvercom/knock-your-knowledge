import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import GetStartedLink from "@/components/navigation/GetStartedLink";
import { KYK_LOGO_SRC } from "@/config/contact";
import { useAuth } from "@/lib/AuthContext";

function userInitial(user) {
  const name = String(user?.full_name || user?.name || "").trim();
  if (name) return name.charAt(0).toUpperCase();
  const email = String(user?.email || "").trim();
  if (email) return email.charAt(0).toUpperCase();
  return "U";
}

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const initial = useMemo(() => userInitial(user), [user]);

  const navLinks = [
    { name: "Internships", page: "Internships" },
    { name: "Internship Courses", page: "Courses" },
    { name: "Live Classes", page: "LiveClasses" },
    { name: "About Us", page: "About" },
    { name: "Blog", page: "Blog" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <nav className="sticky top-0 z-50 border-b isolate"
        style={{
          background: "rgba(2,8,23,0.92)",
          borderColor: "rgba(167,139,250,0.15)",
        }}>
        {/* Blur on a non-interactive layer so Safari does not offset hamburger taps */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: "rgba(2,8,23,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />
        <div className="h-px w-full pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.6), rgba(167,139,250,0.6), transparent)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 h-14 md:h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden relative z-0">
              <img
                src={KYK_LOGO_SRC}
                alt="Knock Your Knowledge"
                className="!w-10 !h-10 md:!w-11 md:!h-11 rounded-full object-cover flex-shrink-0"
                style={{ boxShadow: "0 0 16px rgba(251,146,60,0.4)" }}
              />
              <span className="text-base sm:text-xl font-black truncate"
                style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Knock Your Knowledge
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: currentPageName === link.page ? "#a78bfa" : "#64748b",
                    background: currentPageName === link.page ? "rgba(167,139,250,0.1)" : "transparent",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPageName !== link.page) {
                      e.currentTarget.style.color = "#e2e8f0";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPageName !== link.page) {
                      e.currentTarget.style.color = "#64748b";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <GetStartedLink
                className="inline-flex items-center gap-2 px-5 h-9 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" /> Get Started
              </GetStartedLink>

              {isAuthenticated && user ? (
                <div className="relative group">
                  <Link
                    to="/Dashboard"
                    title={user.full_name || user.email || "Account"}
                    aria-label={`Account: ${user.full_name || user.email || "User"}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white transition-transform hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      boxShadow: "0 0 14px rgba(124,58,237,0.45)",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {initial}
                  </Link>
                  <div
                    className="absolute right-0 top-full mt-2 w-44 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                    style={{
                      background: "rgba(15,23,42,0.98)",
                      border: "1px solid rgba(167,139,250,0.25)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
                    }}
                  >
                    <p className="px-3 pb-2 text-xs truncate" style={{ color: "#94a3b8" }}>
                      {user.full_name || user.email}
                    </p>
                    <Link
                      to="/Dashboard"
                      className="block px-3 py-2 text-sm hover:bg-white/5"
                      style={{ color: "#e2e8f0" }}
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => logout(true)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-white/5"
                      style={{ color: "#f87171" }}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="md:hidden relative z-20 flex items-center gap-2 shrink-0">
              {isAuthenticated && user ? (
                <Link
                  to="/Dashboard"
                  title={user.full_name || user.email || "Account"}
                  aria-label={`Account: ${user.full_name || user.email || "User"}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    boxShadow: "0 0 12px rgba(124,58,237,0.4)",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {initial}
                </Link>
              ) : null}
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="relative flex items-center justify-center h-11 w-11 shrink-0 rounded-lg"
                style={{ color: "#e2e8f0", WebkitTapHighlightColor: "transparent" }}
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <span className="absolute -inset-3" aria-hidden />
                {mobileMenuOpen ? <X className="w-6 h-6 relative z-10 pointer-events-none" /> : <Menu className="w-6 h-6 relative z-10 pointer-events-none" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t"
              style={{ background: "rgba(2,8,23,0.97)", borderColor: "rgba(167,139,250,0.15)" }}
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className="flex items-center px-4 min-h-12 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: currentPageName === link.page ? "#a78bfa" : "#94a3b8",
                      background: currentPageName === link.page ? "rgba(167,139,250,0.1)" : "transparent",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {isAuthenticated && user ? (
                  <div className="px-4 py-2 flex items-center justify-between gap-3">
                    <Link
                      to="/Dashboard"
                      className="flex items-center gap-2 text-sm min-w-0"
                      style={{ color: "#e2e8f0" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                      >
                        {initial}
                      </span>
                      <span className="truncate">{user.full_name || user.email}</span>
                    </Link>
                    <button
                      type="button"
                      className="text-xs font-medium flex-shrink-0"
                      style={{ color: "#f87171" }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout(true);
                      }}
                    >
                      Log out
                    </button>
                  </div>
                ) : null}
                <div className="pt-3 pb-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <GetStartedLink
                    className="flex w-full items-center justify-center py-3.5 rounded-xl text-base font-semibold text-white min-h-[52px]"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </GetStartedLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="overflow-x-hidden w-full max-w-[100vw]">{children}</main>
      <Footer />
    </div>
  );
}
