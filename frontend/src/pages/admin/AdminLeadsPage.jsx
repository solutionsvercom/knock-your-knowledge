import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
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
          {leads.length} submissions from Get Started / contact form
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[720px]">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Phone</th>
                <th className="px-3 py-3 font-medium">Interest</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white font-medium">{l.name || "—"}</td>
                  <td className="px-3 py-3 text-slate-400">{l.email}</td>
                  <td className="px-3 py-3 text-slate-400">{l.phone || "—"}</td>
                  <td className="px-3 py-3 text-slate-300 text-xs">
                    {l.internshipInterest || l.program || l.message || "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDate(l.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 ? <p className="p-5 text-xs text-slate-500">No leads yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
