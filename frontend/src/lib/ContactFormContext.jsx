import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import ContactFormModal from "@/components/contact/ContactFormModal";

const ContactFormContext = createContext(null);

export function ContactFormProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openContactForm = useCallback(() => setOpen(true), []);
  const closeContactForm = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openContactForm, closeContactForm, setOpen }),
    [open, openContactForm, closeContactForm]
  );

  return (
    <ContactFormContext.Provider value={value}>
      {children}
      <ContactFormModal open={open} onOpenChange={setOpen} />
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  const ctx = useContext(ContactFormContext);
  if (!ctx) throw new Error("useContactForm must be used within ContactFormProvider");
  return ctx;
}
