import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export const LOGIN_PATH = "/login";
export const DASHBOARD_PATH = "/Dashboard";

/**
 * @param {{ withNext?: boolean }} [opts]
 */
export function useGetStartedDestination(opts = {}) {
  const { withNext = false } = opts;
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return { to: null, isPending: true, isAuthenticated: false };
  }
  if (isAuthenticated) {
    return { to: DASHBOARD_PATH, isPending: false, isAuthenticated: true };
  }
  const loginTo = withNext
    ? `${LOGIN_PATH}?next=${encodeURIComponent(DASHBOARD_PATH)}`
    : LOGIN_PATH;
  return { to: loginTo, isPending: false, isAuthenticated: false };
}

/**
 * Guest → /login; authenticated → /Dashboard. Waits for auth so CTAs don’t flash the wrong target.
 */
export default function GetStartedLink({ children, className, style, withNext = false, ...rest }) {
  const { to, isPending } = useGetStartedDestination({ withNext });

  if (isPending) {
    return (
      <span
        className={className}
        style={{ ...style, opacity: 0.72, cursor: "wait" }}
        aria-busy="true"
        aria-label="Checking your session"
        {...rest}
      >
        {children}
      </span>
    );
  }

  return (
    <Link to={to} className={className} style={style} {...rest}>
      {children}
    </Link>
  );
}
