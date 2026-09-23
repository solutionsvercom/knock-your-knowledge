import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import ContactFormModal from "@/components/contact/ContactFormModal";
import { matchInternshipOption } from "@/api/contactApi";

const ContactFormContext = createContext(null);

const DEFAULTS = {
  internshipInterest: "",
  source: "get-started",
  heading: "Get Started",
  description: "Share your details and the internship you are interested in. We will contact you soon.",
};

export function ContactFormProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [defaults, setDefaults] = useState(DEFAULTS);

  const openContactForm = useCallback((opts = {}) => {
    setDefaults({
      internshipInterest: matchInternshipOption(opts.internshipInterest || opts.internshipTitle || ""),
      source: opts.source || "get-started",
      heading: opts.heading || DEFAULTS.heading,
      description: opts.description || DEFAULTS.description,
    });
    setOpen(true);
  }, []);

  const closeContactForm = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openContactForm, closeContactForm, setOpen }),
    [open, openContactForm, closeContactForm]
  );

  return (
    <ContactFormContext.Provider value={value}>
      {children}
      <ContactFormModal open={open} onOpenChange={setOpen} defaults={defaults} />
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  const ctx = useContext(ContactFormContext);
  if (!ctx) throw new Error("useContactForm must be used within ContactFormProvider");
  return ctx;
}
