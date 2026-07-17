import React from "react";
import { whatsappGetStartedUrl } from "@/config/contact";

/**
 * Opens WhatsApp so students can contact us directly.
 */
export default function GetStartedLink({ children, className, style, withNext: _withNext, onClick, ...rest }) {
  const openWhatsApp = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    window.open(whatsappGetStartedUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      className={className}
      style={{ ...style, cursor: "pointer" }}
      onClick={openWhatsApp}
      {...rest}
    >
      {children}
    </button>
  );
}
