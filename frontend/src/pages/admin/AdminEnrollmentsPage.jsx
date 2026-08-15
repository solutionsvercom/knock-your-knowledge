import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { Search } from "lucide-react";

function formatInr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminEnrollmentsPage() {
  const [q, setQ] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-enrollments"],
    queryFn: () => adminApi.enrollments(),
  });

  const list = data?.enrollments || [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (e) =>
        e.studentName?.toLowerCase().includes(s) ||
        e.studentEmail?.toLowerCase().includes(s) ||
        e.studentPhone?.includes(s) ||
        e.itemTitle?.toLowerCase().includes(s) ||
        e.invoiceNumber?.toLowerCase().includes(s)
    );
  }, [list, q]);

  const students = useMemo(() => {
    const map = new Map();
    for (const e of list) {
      const key = e.studentEmail || e._id;
      if (!map.has(key)) {
        map.set(key, {
          email: e.studentEmail,
          name: e.studentName,
          phone: e.studentPhone,
          courses: [],
          total: 0,
        });
      }
      const row = map.get(key);
      row.courses.push(e.itemTitle);
      row.total += e.amountPaid || 0;
    }
    return Array.from(map.values());
  }, [list]);

  if (isLoading) return <p className="text-slate-400 text-sm">Loading enrollments…</p>;
  if (error) return <p className="text-red-400 text-sm">{error.message}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Enrolled students
        </h1>
        <p className="text-sm mt-0.5 text-slate-500">
          {students.length} students · {list.length} course enrollments from database
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, course, invoice…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="px-5 py-3 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Students summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Phone</th>
                <th className="px-3 py-3 font-medium">Courses</th>
                <th className="px-5 py-3 font-medium">Total paid</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.email} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white font-medium">{s.name || "—"}</td>
                  <td className="px-3 py-3 text-slate-400">{s.email}</td>
                  <td className="px-3 py-3 text-slate-400">{s.phone || "—"}</td>
                  <td className="px-3 py-3 text-slate-400 text-xs">{s.courses.join(", ")}</td>
                  <td className="px-5 py-3 text-emerald-400 font-semibold">{formatInr(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 ? <p className="p-5 text-xs text-slate-500">No enrolled students yet.</p> : null}
        </div>
      </section>

      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="px-5 py-3 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Enrollment / invoice rows</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Course</th>
                <th className="px-3 py-3 font-medium">Coupon</th>
                <th className="px-3 py-3 font-medium">Paid</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-violet-300 font-mono text-xs">{e.invoiceNumber || "—"}</td>
                  <td className="px-3 py-3">
                    <p className="text-white">{e.studentName || "—"}</p>
                    <p className="text-xs text-slate-500">{e.studentEmail}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{e.itemTitle}</td>
                  <td className="px-3 py-3 text-slate-400 text-xs">{e.coupon || "—"}</td>
                  <td className="px-3 py-3 text-emerald-400 font-semibold">{formatInr(e.amountPaid)}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 ? <p className="p-5 text-xs text-slate-500">No matching enrollments.</p> : null}
        </div>
      </section>
    </div>
  );
}
