"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-[var(--am-teal)]" />,
  error: <XCircle className="h-5 w-5 text-[var(--am-primary)]" />,
  info: <Info className="h-5 w-5 text-[var(--am-primary)]" />,
};

const toastStyles: Record<ToastType, string> = {
  success: "border-[var(--am-teal)]",
  error: "border-[var(--am-sunset)]",
  info: "border-[var(--am-edge)]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => remove(id), 5000);
    },
    [remove]
  );

  const success = useCallback((t: string, m?: string) => toast("success", t, m), [toast]);
  const error = useCallback((t: string, m?: string) => toast("error", t, m), [toast]);
  const info = useCallback((t: string, m?: string) => toast("info", t, m), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-[var(--am-radius)] border-2 p-4 shadow-[var(--am-shadow)] bg-[var(--am-surface)]",
              "animate-slide-in-right pointer-events-auto",
              toastStyles[t.type]
            )}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--am-ink)]">{t.title}</p>
              {t.message && (
                <p className="text-xs text-[var(--am-muted)] mt-0.5">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
