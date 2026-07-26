"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          An unexpected error occurred. The planets are misaligned — please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Go to home
          </Button>
        </div>
      </div>
    </div>
  );
}
