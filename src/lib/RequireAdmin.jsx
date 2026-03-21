import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

/**
 * Must be used inside RequireAuth (or after auth is known).
 * Allows only users with role "admin".
 */
export default function RequireAdmin({ children }) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <div className="w-8 h-8 border-4 border-slate-600 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
}
