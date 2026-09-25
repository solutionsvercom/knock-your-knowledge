import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { whatsappCoursesInquiryUrl } from "@/config/contact";

const STORAGE_KEY = "kyk_search_wa_prompt_v1";

function landedFromSearch() {
  try {
    const ref = String(document.referrer || "");
    if (/google\.|bing\.|yahoo\.|duckduckgo|yandex|baidu/i.test(ref)) return true;
    const params = new URLSearchParams(window.location.search);
    const src = `${params.get("utm_source") || ""} ${params.get("utm_medium") || ""}`;
    if (/google|bing|yahoo|organic/i.test(src)) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.86 11.86 0 0 0 5.74 1.46h.01c6.54 0 11.88-5.34 11.88-11.9 0-3.18-1.24-6.16-3.41-8.43ZM12.05 21.15h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.45-4.44 9.87-9.91 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

export default function SearchWhatsAppPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return undefined;
    } catch {
      /* ignore */
    }
    if (!landedFromSearch()) return undefined;

    const timer = window.setTimeout(() => setVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const openWhatsApp = () => {
    dismiss();
    window.open(whatsappCoursesInquiryUrl(), "_blank", "noopener,noreferrer");
  };

  if (!visible) return null;

  return (
    <div className="fixed z-[210] bottom-4 right-4 left-4 sm:left-auto sm:w-[340px]">
      <div
        className="relative rounded-2xl p-4 shadow-2xl"
        style={{ background: "#0b1224", border: "1px solid rgba(52,211,153,0.35)" }}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-2 p-1.5 rounded-lg"
          style={{ color: "#94a3b8" }}
          aria-label="Close WhatsApp prompt"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex gap-3 pr-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#25D366" }}
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Chat about our courses</p>
            <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
              Send a ready message on WhatsApp for Development, AI, Analytics, and Digital Marketing internships.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openWhatsApp}
          className="mt-3 w-full h-10 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#25D366" }}
        >
          Message on WhatsApp
        </button>
      </div>
    </div>
  );
}
