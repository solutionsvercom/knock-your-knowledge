import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/apiClient";
import { Shield } from "lucide-react";

/**
 * Developer / operator entry only — not linked anywhere on the public site.
 * Same auth API as learners; only users with role `admin` pass the gate.
 */
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nextUrl = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("next") || "/admin/dashboard";
    } catch {
      return "/admin/dashboard";
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await api.auth.adminLogin({
        email: email.trim(),
        password,
      });

      // Same password works for any account — only `role: "admin"` may use /admin
      if (!user || user.role !== "admin") {
        api.auth.clearSession();
        setError(
          "This account is not an administrator. Student and other accounts cannot open the admin panel. " +
            "Sign in here only with an admin account (create one with: cd backend && npm run seed:admin, or set role to admin in the database)."
        );
        return;
      }

      window.location.href = nextUrl;
    } catch (err) {
      const msg =
        err?.message ||
        err?.data?.message ||
        (Array.isArray(err?.data?.details) && err.data.details[0]?.message) ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 text-violet-400">
          <Shield className="w-6 h-6" />
          <span className="text-sm font-semibold uppercase tracking-wide">Admin</span>
        </div>
        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl"
        >
          <h1 className="text-xl font-semibold">Administrator sign in</h1>
          <p className="text-sm text-slate-400 mt-1">
            Student logins will be <strong className="text-amber-400/90">rejected</strong> — only accounts whose{" "}
            <strong className="text-slate-300">role</strong> is <code className="text-violet-300">admin</code> in the
            database can access this area.
          </p>
          {import.meta.env.DEV ? (
            <p className="mt-3 text-xs text-slate-500 rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2">
              <strong className="text-slate-400">Local test:</strong> run{" "}
              <code className="text-violet-300">cd backend && npm run seed:admin</code>, then sign in as{" "}
              <code className="text-slate-300">vinay@gmail.com</code> / <code className="text-slate-300">12345678</code>
              .
            </p>
          ) : null}

          <div className="mt-6 space-y-4">
            <label className="block">
              <div className="text-sm text-slate-200">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="vinay@gmail.com"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <div className="text-sm text-slate-200">Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
          </div>

          {error ? (
            <div className="mt-4 text-sm text-red-300 border border-red-900/40 bg-red-950/30 rounded-md p-3">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="mt-6 w-full rounded-md bg-violet-600 hover:bg-violet-500 disabled:opacity-60 px-4 py-2 font-medium"
          >
            {loading ? "Please wait..." : "Sign in to admin"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/" className="text-slate-400 hover:text-violet-400 hover:underline">
              ← Public website
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
