import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { whatsappDigitsFromPhone, whatsappProspectFollowUpUrl } from "@/config/contact";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.86 11.86 0 0 0 5.74 1.46h.01c6.54 0 11.88-5.34 11.88-11.9 0-3.18-1.24-6.16-3.41-8.43ZM12.05 21.15h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.45-4.44 9.87-9.91 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function openProspectWhatsApp(lead) {
  const url = whatsappProspectFollowUpUrl({
    name: lead.name,
    phone: lead.phone,
    internshipInterest: lead.internshipInterest || lead.program,
  });
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function AdminLeadsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => adminApi.leads(),
  });

  const leads = data?.leads || [];

  if (isLoading) return <p className="text-slate-400 text-sm">Loading leads…</p>;
  if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Contact leads
        </h1>
        <p className="text-sm mt-0.5 text-slate-500">
          {leads.length} submissions from Get Started and internship Apply Now. WhatsApp opens a ready course message to their number.
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[860px]">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Phone</th>
                <th className="px-3 py-3 font-medium">Internship course</th>
                <th className="px-3 py-3 font-medium">Source</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const canWa = Boolean(whatsappDigitsFromPhone(l.phone));
                return (
                  <tr key={l._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white font-medium">{l.name || "—"}</td>
                    <td className="px-3 py-3 text-slate-400">{l.email}</td>
                    <td className="px-3 py-3 text-slate-400">{l.phone || "—"}</td>
                    <td className="px-3 py-3 text-slate-300 text-xs">
                      {l.internshipInterest || l.program || l.message || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">{l.source || "—"}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{formatDate(l.createdAt)}</td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        disabled={!canWa}
                        onClick={() => openProspectWhatsApp(l)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: canWa ? "#25D366" : "rgba(255,255,255,0.08)" }}
                        title={canWa ? "Send course message on WhatsApp" : "No valid phone number"}
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        Message
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {leads.length === 0 ? <p className="p-5 text-xs text-slate-500">No leads yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
