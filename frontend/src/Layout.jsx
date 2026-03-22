import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { GraduationCap, Menu, X, Sparkles, ShoppingCart } from "lucide-react";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import GetStartedLink from "@/components/navigation/GetStartedLink";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { count: cartCount } = useCart();

  const navLinks = [
    { name: "Courses", page: "Courses" },
    { name: "Bundles", page: "Bundles" },
    { name: "Internships", page: "Internships" },
    { name: "Live Classes", page: "LiveClasses" },
    { name: "AI Tutor", page: "AITutor" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(2,8,23,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(167,139,250,0.15)",
        }}>
        {/* Top neon line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.6), rgba(167,139,250,0.6), transparent)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-16">

            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 0 16px rgba(124,58,237,0.5)" }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black"
                style={{ fontFamily: "'Poppins', sans-serif", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Knock Your Knowledge 
              </span>
            </Link>

            {/* Desktop Nav */}
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
              <Link
                to="/Checkout"
                className="relative p-2 rounded-lg transition-colors"
                style={{ color: "#64748b" }}
                title="Cart"
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center px-1 text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              <Link
                to={isAuthenticated ? "/Dashboard" : "/login"}
                className="text-sm cursor-pointer transition-colors"
                style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
              >
                {isAuthenticated ? "Dashboard" : "Sign In"}
              </Link>
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
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: "#64748b" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — animated slide-down drawer */}
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
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      color: currentPageName === link.page ? "#a78bfa" : "#94a3b8",
                      background: currentPageName === link.page ? "rgba(167,139,250,0.1)" : "transparent",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/Checkout"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ color: "#94a3b8", background: "rgba(255,255,255,0.03)" }}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Cart
                  </span>
                  {cartCount > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#7c3aed" }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="pt-3 pb-1 flex gap-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <Link to={isAuthenticated ? "/Dashboard" : "/login"} className="flex-1">
                    <span className="flex w-full items-center justify-center py-3.5 rounded-xl text-base border transition-colors min-h-[52px]" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                      {isAuthenticated ? "Dashboard" : "Sign In"}
                    </span>
                  </Link>
                  <GetStartedLink
                    className="flex-1 flex w-full items-center justify-center py-3.5 rounded-xl text-base font-semibold text-white min-h-[52px]"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    Get Started
                  </GetStartedLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page content */}
      <main className="overflow-x-hidden w-full max-w-[100vw]">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}