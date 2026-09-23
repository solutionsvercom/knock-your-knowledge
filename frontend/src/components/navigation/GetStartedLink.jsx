import React from "react";
import { useContactForm } from "@/lib/ContactFormContext";

/**
 * Opens the contact form (name, phone, mail ID, internship course).
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
