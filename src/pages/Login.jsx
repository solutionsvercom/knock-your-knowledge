import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/apiClient";
import { GraduationCap } from "lucide-react";

/** Learner / public account only. Admin panel is not linked here — use `/admin/login` directly (dev). */
export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nextUrl = useMemo(() => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.get("next") || "/Dashboard";
    } catch {
      return "/Dashboard";
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        await api.auth.signup({
          email: email.trim(),
          full_name: fullName.trim(),
          password,
        });
      } else {
        await api.auth.login({
          email: email.trim(),
          password,
        });
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 p-6">
      <div className="w-full max-w-md mb-6 flex items-center gap-2 text-violet-400">
        <GraduationCap className="w-7 h-7" />
        <span className="text-sm font-semibold tracking-wide">KYK Learners</span>
      </div>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-3 py-1.5 rounded-md text-sm ${mode === "login" ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-300"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`px-3 py-1.5 rounded-md text-sm ${mode === "signup" ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-300"}`}
          >
            Sign up
          </button>
        </div>
        <h1 className="text-xl font-semibold">{mode === "signup" ? "Create your learner account" : "Student sign in"}</h1>
        <p className="text-sm text-slate-400 mt-1">
          Access courses, bundles, and your dashboard. New here? Use <strong className="text-slate-300">Sign up</strong>.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <div className="text-sm text-slate-200">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          {mode === "signup" && (
            <label className="block">
              <div className="text-sm text-slate-200">Full name</div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          )}

          <label className="block">
            <div className="text-sm text-slate-200">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
          {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/" className="text-slate-400 hover:text-violet-400 hover:underline">
            ← Back to home
          </Link>
        </p>
      </form>
    </div>
  );
}

