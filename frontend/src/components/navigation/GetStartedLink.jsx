import React from "react";
import { useContactForm } from "@/lib/ContactFormContext";

/**
 * Opens the Get Started contact form (email, phone, internship interest).
 */
export default function GetStartedLink({ children, className, style, withNext: _withNext, onClick, ...rest }) {
  const { openContactForm } = useContactForm();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    openContactForm();
  };

  return (
    <button
      type="button"
      className={className}
      style={{ ...style, cursor: "pointer" }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
