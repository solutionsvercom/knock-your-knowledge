import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { api } from "@/api/apiClient";
import { Ticket, Copy, Check } from "lucide-react";

const ACCENT = "#fbbf24";

function previewCode(name) {
  const cleaned = String(name || "")
    .trim()
    .split(/\s+/)[0]
    .replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "";
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}kyk2024`;
}

function formatInr(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminTicketsPage() {
  const qc = useQueryClient();
  const [selectedEmail, setSelectedEmail] = useState("");
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    notes: "",
    discountPercent: 30,
  });
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: () => adminApi.tickets.list(),
  });

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: () => adminApi.students(),
  });

  const { data: localUsers = [] } = useQuery({
    queryKey: ["crm-users-for-tickets"],
    queryFn: () => api.users.list(),
  });

  const students = useMemo(() => {
    const map = new Map();
    for (const s of studentsData?.students || []) {
      if (!s?.email) continue;
      map.set(String(s.email).toLowerCase(), {
        email: String(s.email).toLowerCase(),
        name: s.name || "",
        phone: s.phone || "",
        courses: s.courses || [],
        source: s.source || "db",
      });
    }
    for (const u of localUsers) {
      const role = String(u.role || "student").toLowerCase();
      if (role === "admin" || role === "teacher" || role === "sales") continue;
      const email = String(u.email || "").toLowerCase();
      if (!email) continue;
      if (!map.has(email)) {
        map.set(email, {
          email,
          name: u.full_name || u.name || "",
          phone: u.phone || "",
          courses: [],
          source: "registered",
        });
      } else {
        const row = map.get(email);
        if (!row.name && (u.full_name || u.name)) row.name = u.full_name || u.name;
        if (!row.phone && u.phone) row.phone = u.phone;
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      String(a.name || a.email).localeCompare(String(b.name || b.email))
    );
  }, [studentsData, localUsers]);

  const createMut = useMutation({
    mutationFn: (body) => adminApi.tickets.create(body),
    onSuccess: (res) => {
      setMsg(res.message || "Ticket raised.");
      setSelectedEmail("");
      setForm({ studentName: "", studentEmail: "", studentPhone: "", notes: "", discountPercent: 30 });
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (err) => setMsg(err.message),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }) => adminApi.tickets.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-tickets"] }),
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

  const onPickStudent = (email) => {
    setSelectedEmail(email);
    const s = students.find((x) => x.email === email);
    if (!s) {
      setForm((f) => ({ ...f, studentName: "", studentEmail: "", studentPhone: "" }));
      return;
    }
    setForm((f) => ({
      ...f,
      studentName: s.name || "",
      studentEmail: s.email,
      studentPhone: s.phone || "",
    }));
  };

  const tickets = data?.tickets || [];
  const preview = previewCode(form.studentName);

  const selectedStudent = useMemo(
    () => students.find((s) => s.email === selectedEmail) || null,
    [students, selectedEmail]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Student tickets &amp; referrals
        </h1>
        <p className="text-sm mt-0.5 text-slate-500">
          Choose which student gets the ticket · referral <span className="font-mono text-amber-300">Namekyk2024</span> ·{" "}
          <strong className="text-white">1 ticket = ₹500</strong> · shows on that student&apos;s dashboard
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-500 mb-1">Tickets</p>
          <p className="text-2xl font-black text-white">{data?.count ?? 0}</p>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-500 mb-1">Per ticket value</p>
          <p className="text-2xl font-black text-amber-300">{formatInr(data?.ticketValueInr ?? 500)}</p>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-500 mb-1">Wallet total</p>
          <p className="text-2xl font-black text-emerald-400">{formatInr(data?.walletValue)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <form
          className="lg:col-span-2 rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          onSubmit={(e) => {
            e.preventDefault();
            setMsg("");
            if (!form.studentEmail) {
              setMsg("Please select which student this ticket is for.");
              return;
            }
            createMut.mutate(form);
          }}
        >
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Ticket className="w-4 h-4" style={{ color: ACCENT }} /> Raise ticket
          </h2>

          <label className="block">
            <span className="text-xs text-slate-500">Which student is this ticket for? *</span>
            <select
              required
              value={selectedEmail}
              onChange={(e) => onPickStudent(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="">
                {studentsLoading ? "Loading students…" : "Select a student…"}
              </option>
              {students.map((s) => (
                <option key={s.email} value={s.email}>
                  {(s.name || "Student") + " — " + s.email}
                  {s.courses?.length ? ` (${s.courses[0]})` : ""}
                </option>
              ))}
            </select>
          </label>

          {students.length === 0 && !studentsLoading ? (
            <p className="text-xs text-amber-200/80">
              No students found yet. Ask the student to sign up (or complete checkout), then refresh this page.
            </p>
          ) : null}

          {selectedStudent ? (
            <div
              className="rounded-xl px-3 py-2.5 text-xs space-y-1"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              <p className="text-white font-semibold">{selectedStudent.name || "—"}</p>
              <p className="text-slate-400">{selectedStudent.email}</p>
              <p className="text-slate-500">{selectedStudent.phone || "No phone"}</p>
              {selectedStudent.courses?.length ? (
                <p className="text-slate-500">Courses: {selectedStudent.courses.join(", ")}</p>
              ) : null}
            </div>
          ) : null}

          {preview ? (
            <p className="text-xs text-slate-400">
              Referral code: <span className="font-mono text-amber-300">{preview}</span> · worth ₹500 · visible on
              student dashboard
            </p>
          ) : null}

          <label className="block">
            <span className="text-xs text-slate-500">Referral discount % (for friends)</span>
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
            <span className="text-xs text-slate-500">Notes (optional)</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm text-white outline-none resize-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
              placeholder="Why this ticket was raised…"
            />
          </label>
          <button
            type="submit"
            disabled={createMut.isPending || !form.studentEmail}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-slate-900 disabled:opacity-50"
            style={{ background: ACCENT }}
          >
            {createMut.isPending ? "Raising…" : "Raise ticket for selected student (₹500)"}
          </button>
          {msg ? <p className="text-xs text-slate-300">{msg}</p> : null}
        </form>

        <div
          className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="px-5 py-3 border-b border-white/5">
            <h2 className="text-sm font-bold text-white">All tickets</h2>
          </div>
          {isLoading ? (
            <p className="p-5 text-xs text-slate-500">Loading…</p>
          ) : error ? (
            <p className="p-5 text-xs text-red-400">{error.message}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-white/5">
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-3 py-3 font-medium">Referral code</th>
                    <th className="px-3 py-3 font-medium">Value</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Raised</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t._id} className="border-b border-white/5">
                      <td className="px-5 py-3">
                        <p className="text-white font-medium">{t.studentName}</p>
                        <p className="text-xs text-slate-500">{t.studentEmail}</p>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => copyCode(t.referralCode)}
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-amber-300"
                        >
                          {t.referralCode}
                          {copied === t.referralCode ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-50" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-emerald-400 font-semibold">{formatInr(t.valueInr)}</td>
                      <td className="px-3 py-3">
                        <select
                          value={t.status}
                          onChange={(e) => statusMut.mutate({ id: t._id, status: e.target.value })}
                          className="bg-transparent text-xs text-slate-300 outline-none border border-white/10 rounded-lg px-2 py-1"
                        >
                          <option value="open">open</option>
                          <option value="active">active</option>
                          <option value="used">used</option>
                          <option value="closed">closed</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500">{formatDate(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickets.length === 0 ? <p className="p-5 text-xs text-slate-500">No tickets yet.</p> : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
