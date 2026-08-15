import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { Tag, UserPlus, Copy, Check } from "lucide-react";

const ACCENT = "#a78bfa";

/** Preview: Ashiya → Ashiyakyk2024 */
function previewCode(name) {
  const cleaned = String(name || "")
    .trim()
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "";
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}kyk2024`;
}

export default function AdminSalesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    discountPercent: 30,
    notes: "",
  });
  const [copied, setCopied] = useState("");
  const [msg, setMsg] = useState("");

  const { data: salesData, isLoading } = useQuery({
    queryKey: ["admin-sales"],
    queryFn: () => adminApi.sales.list(),
  });
  const { data: couponsData } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => adminApi.coupons.list(),
  });

  const createMut = useMutation({
    mutationFn: (body) => adminApi.sales.create(body),
    onSuccess: (res) => {
      setMsg(`Created ${res.sales?.fullName} with coupon ${res.couponCode}`);
      setForm({ fullName: "", email: "", phone: "", discountPercent: 30, notes: "" });
      qc.invalidateQueries({ queryKey: ["admin-sales"] });
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (err) => setMsg(err.message),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, active }) => adminApi.sales.update(id, { active }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sales"] });
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* ignore */
    }
  };

  const sales = salesData?.sales || [];
  const coupons = couponsData?.coupons || [];
  const preview = previewCode(form.fullName);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Sales staff &amp; coupons
        </h1>
        <p className="text-sm mt-0.5 text-slate-500">
          Auto-generate codes like <span className="text-violet-300 font-mono">Ashiyakyk2024</span> from first name
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <form
          className="lg:col-span-2 rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          onSubmit={(e) => {
            e.preventDefault();
            setMsg("");
            createMut.mutate(form);
          }}
        >
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4" style={{ color: ACCENT }} /> Add sales staff
          </h2>
          <label className="block">
            <span className="text-xs text-slate-500">Full name *</span>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
              placeholder="Ashiya"
            />
          </label>
          {preview ? (
            <p className="text-xs text-slate-400">
              Coupon preview:{" "}
              <span className="font-mono text-violet-300">{preview}</span>
            </p>
          ) : null}
          <label className="block">
            <span className="text-xs text-slate-500">Email *</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Phone</span>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Discount %</span>
            <input
              type="number"
              min={0}
              max={100}
              value={form.discountPercent}
              onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none resize-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </label>
          <button
            type="submit"
            disabled={createMut.isPending}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #2563eb)` }}
          >
            {createMut.isPending ? "Creating…" : "Create staff + coupon"}
          </button>
          {msg ? <p className="text-xs text-slate-300">{msg}</p> : null}
        </form>

        <div className="lg:col-span-3 space-y-6">
          <section
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="px-5 py-3 border-b border-white/5">
              <h2 className="text-sm font-bold text-white">Sales team</h2>
            </div>
            {isLoading ? (
              <p className="p-5 text-xs text-slate-500">Loading…</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-white/5">
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-3 py-3 font-medium">Contact</th>
                      <th className="px-3 py-3 font-medium">Coupon</th>
                      <th className="px-3 py-3 font-medium">Off</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((s) => (
                      <tr key={s._id} className="border-b border-white/5">
                        <td className="px-5 py-3 text-white font-medium">{s.fullName}</td>
                        <td className="px-3 py-3 text-xs text-slate-400">
                          {s.email}
                          <br />
                          {s.phone || "—"}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => copyCode(s.couponCode)}
                            className="inline-flex items-center gap-1.5 font-mono text-xs text-violet-300 hover:text-white"
                          >
                            {s.couponCode}
                            {copied === s.couponCode ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-50" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-3 text-slate-300">{s.discountPercent}%</td>
                        <td className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => toggleMut.mutate({ id: s._id, active: !s.active })}
                            className="text-xs font-semibold"
                            style={{ color: s.active ? "#34d399" : "#f87171" }}
                          >
                            {s.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sales.length === 0 ? <p className="p-5 text-xs text-slate-500">No sales staff yet.</p> : null}
              </div>
            )}
          </section>

          <section
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: ACCENT }} />
              <h2 className="text-sm font-bold text-white">All coupons</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[560px]">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-white/5">
                    <th className="px-5 py-3 font-medium">Code</th>
                    <th className="px-3 py-3 font-medium">Type</th>
                    <th className="px-3 py-3 font-medium">Owner</th>
                    <th className="px-3 py-3 font-medium">Uses</th>
                    <th className="px-5 py-3 font-medium">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id || c._id} className="border-b border-white/5">
                      <td className="px-5 py-3 font-mono text-xs text-violet-300">{c.code}</td>
                      <td className="px-3 py-3 text-slate-400 text-xs uppercase">{c.type}</td>
                      <td className="px-3 py-3 text-slate-300 text-xs">{c.salesStaffName || "—"}</td>
                      <td className="px-3 py-3 text-slate-400">{c.usedCount || 0}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: c.active ? "#34d399" : "#f87171" }}>
                        {c.active ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {coupons.length === 0 ? <p className="p-5 text-xs text-slate-500">No coupons in database.</p> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
