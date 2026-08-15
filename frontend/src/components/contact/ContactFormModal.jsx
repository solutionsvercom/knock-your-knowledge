import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INTERNSHIP_OPTIONS, submitContactLead } from "@/api/contactApi";
import { Loader2, CheckCircle2, Mail, Phone, GraduationCap } from "lucide-react";

const empty = { email: "", phone: "", internshipInterest: "" };

export default function ContactFormModal({ open, onOpenChange }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const reset = () => {
    setForm(empty);
    setError("");
    setDone(false);
    setSubmitting(false);
  };

  const handleOpenChange = (next) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitContactLead({
        email: form.email,
        phone: form.phone,
        internshipInterest: form.internshipInterest,
        source: "get-started",
      });
      setDone(true);
    } catch (err) {
      setError(err?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md border text-white"
        style={{
          background: "#0b1224",
          borderColor: "rgba(167,139,250,0.25)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Get Started
          </DialogTitle>
          <DialogDescription style={{ color: "#64748b" }}>
            Share your details and the internship you are interested in. We will contact you soon.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: "#34d399" }} />
            <p className="text-white font-semibold mb-1">Thank you!</p>
            <p className="text-sm mb-6" style={{ color: "#64748b" }}>
              Your details were saved. Our team will reach out shortly.
            </p>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="w-full h-11 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: "#a78bfa" }}>
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: "#a78bfa" }}>
                <Phone className="w-3.5 h-3.5" /> Phone number
              </label>
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="10-digit mobile number"
                className="w-full h-11 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: "#a78bfa" }}>
                <GraduationCap className="w-3.5 h-3.5" /> Internship interested in
              </label>
              <select
                required
                name="internshipInterest"
                value={form.internshipInterest}
                onChange={onChange}
                className="w-full h-11 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: form.internshipInterest ? "#e2e8f0" : "#64748b",
                }}
              >
                <option value="" disabled>
                  Select a program
                </option>
                {INTERNSHIP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} style={{ color: "#0f172a" }}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <div className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(248,113,113,0.1)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.25)" }}>
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
