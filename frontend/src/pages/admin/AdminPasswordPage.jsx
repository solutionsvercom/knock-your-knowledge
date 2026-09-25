import React, { useEffect, useState } from "react";
import { api } from "@/api/apiClient";
import { useAuth } from "@/lib/AuthContext";
import { KeyRound } from "lucide-react";

export default function AdminPasswordPage() {
  const { user, checkAppState } = useAuth();
  const [email, setEmail] = useState(() => user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    const nextEmail = email.trim().toLowerCase();
    if (!nextEmail.includes("@")) {
      setError("Enter a valid Gmail / email address.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (nextEmail === String(user?.email || "").toLowerCase() && !newPassword) {
      setError("Change the Gmail, the password, or both.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.changePassword({
        currentPassword,
        email: nextEmail,
        newPassword: newPassword || undefined,
      });
      await checkAppState();
      const parts = [];
      if (nextEmail !== String(user?.email || "").toLowerCase()) parts.push("Gmail");
      if (newPassword) parts.push("password");
      setOk(`${parts.join(" and ")} updated. Use these details next time you sign in at /admin/login.`);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.message || "Could not update login details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Admin Gmail &amp; password
        </h1>
        <p className="text-sm mt-0.5 text-slate-500">
          Change the email, the password, or both. Current login:{" "}
          <span className="text-slate-300">{user?.email || "admin"}</span>
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl p-6 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <label className="block">
          <span className="text-xs text-slate-400">Admin Gmail / email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="you@gmail.com"
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Current password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">New password (leave blank to keep the current one)</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </label>
        <label className="block">
          <span className="text-xs text-slate-400">Confirm new password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="mt-1.5 w-full h-11 px-3 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </label>

        {error ? (
          <p className="text-sm text-red-300 border border-red-900/40 bg-red-950/30 rounded-md p-3">{error}</p>
        ) : null}
        {ok ? (
          <p className="text-sm text-emerald-300 border border-emerald-900/40 bg-emerald-950/30 rounded-md p-3">{ok}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !currentPassword || !email.trim()}
          className="inline-flex items-center gap-2 h-11 px-4 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          <KeyRound className="w-4 h-4" />
          {loading ? "Saving…" : "Update Gmail & password"}
        </button>
      </form>
    </div>
  );
}
