import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Standard loading / error wrapper for pages that use TanStack Query + API.
 */
export function ApiQueryStatus({
  isLoading,
  isError,
  error,
  onRetry,
  loadingLabel = "Loading…",
  children,
  className = "",
}) {
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" aria-hidden />
        <p className="text-sm text-slate-500">{loadingLabel}</p>
      </div>
    );
  }

  if (isError) {
    const msg = error?.message || "Something went wrong loading data.";
    return (
      <div
        className={`rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-6 text-center ${className}`}
        role="alert"
      >
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" aria-hidden />
        <p className="text-sm text-red-200 mb-4">{msg}</p>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry} className="border-red-800 text-red-200">
            Try again
          </Button>
        ) : null}
      </div>
    );
  }

  return children;
}
