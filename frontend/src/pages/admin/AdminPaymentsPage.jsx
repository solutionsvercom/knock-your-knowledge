import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { Search, Receipt } from "lucide-react";

function formatInr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

const STATUS_COLOR = {
  paid: "#34d399",
  created: "#fbbf24",
  failed: "#f87171",
};

export default function AdminPaymentsPage() {
  const [q, setQ] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => adminApi.payments(),
  });

  const payments = data?.payments || [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return payments;
    return payments.filter(
      (p) =>
        p.invoiceNumber?.toLowerCase().includes(s) ||
        p.orderId?.toLowerCase().includes(s) ||
        p.paymentId?.toLowerCase().includes(s) ||
        p.customer?.name?.toLowerCase().includes(s) ||
        p.customer?.email?.toLowerCase().includes(s) ||
        p.coupon?.toLowerCase().includes(s)
    );
  }, [payments, q]);

  if (isLoading) return <p className="text-slate-400 text-sm">Loading payments…</p>;
  if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Payments &amp; invoices
        </h1>
        <p className="text-sm mt-0.5 text-slate-500">
          Cashfree orders (UPI, debit, credit) · bills generated after checkout
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-500 mb-1">Total revenue (paid)</p>
          <p className="text-2xl font-black text-emerald-400">{formatInr(data?.totalRevenue)}</p>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-500 mb-1">Paid invoices</p>
          <p className="text-2xl font-black text-white">{data?.paidCount ?? 0}</p>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-500 mb-1">All orders</p>
          <p className="text-2xl font-black text-white">{data?.count ?? 0}</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search invoice, order, customer…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 font-medium">
                  <Receipt className="w-3.5 h-3.5 inline mr-1" />
                  Invoice
                </th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Items</th>
                <th className="px-3 py-3 font-medium">Coupon</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <p className="text-violet-300 font-mono text-xs">{p.invoiceNumber}</p>
                    <p className="text-[10px] text-slate-600 truncate max-w-[140px]">{p.paymentId || p.orderId}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-white">{p.customer?.name || "—"}</p>
                    <p className="text-xs text-slate-500">{p.customer?.email}</p>
                    <p className="text-xs text-slate-600">{p.customer?.contact}</p>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-400 max-w-[200px]">
                    {(p.items || []).map((i) => i.title).join(", ") || "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-400 text-xs">{p.coupon || "—"}</td>
                  <td className="px-3 py-3 text-emerald-400 font-semibold">{formatInr(p.amountInr)}</td>
                  <td className="px-3 py-3">
                    <span
                      className="text-xs font-semibold uppercase"
                      style={{ color: STATUS_COLOR[p.status] || "#94a3b8" }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 ? <p className="p-5 text-xs text-slate-500">No payments found.</p> : null}
        </div>
      </div>
    </div>
  );
}
