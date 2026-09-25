import React, { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useContactForm } from "@/lib/ContactFormContext";

const STORAGE_KEY = "kyk_home_apply_popup_v1";

export default function HomeApplyPopup() {
  const { open, openContactForm } = useContactForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return undefined;
    } catch {
      /* ignore */
    }

    let scrolled = false;
    let waited = false;
    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
    };

    const maybeShow = () => {
      if (scrolled && waited) show();
    };

    const onScroll = () => {
      if (window.scrollY > 220) {
        scrolled = true;
        maybeShow();
      }
    };

    const timer = window.setTimeout(() => {
      waited = true;
      maybeShow();
    }, 4500);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (open) setVisible(false);
  }, [open]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const applyNow = () => {
    dismiss();
    openContactForm({
      source: "home-scroll-apply",
      heading: "Apply Now",
      description:
        "Share your name, phone, mail ID, and the internship course you want. Our team will contact you soon.",
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4" style={{ background: "rgba(2,8,23,0.72)" }}>
      <div
        role="dialog"
        aria-labelledby="kyk-apply-popup-title"
        className="relative w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl"
        style={{ background: "#0b1224", border: "1px solid rgba(167,139,250,0.35)" }}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 p-2 rounded-lg"
          style={{ color: "#94a3b8" }}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 id="kyk-apply-popup-title" className="text-xl font-black text-white pr-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Apply now for internships
        </h2>
        <p className="text-sm mt-2" style={{ color: "#94a3b8" }}>
          Development, AI & Prompt Engineering, Business Analytics, and Advanced Digital Marketing — start your application in a minute.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={applyNow}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            Apply Now
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="h-11 px-4 rounded-xl text-sm font-medium"
            style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)" }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
