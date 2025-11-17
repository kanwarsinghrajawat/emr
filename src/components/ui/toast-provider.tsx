"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "warning" | "info";

export type ToastPayload = {
  tone: ToastTone;
  title: string;
  message?: string;
};

export type ToastRecord = ToastPayload & { id: string };

type ToastContextValue = {
  toasts: ToastRecord[];
  pushToast: (toast: ToastPayload) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toneMap: Record<ToastTone, { icon: React.ReactNode; bg: string; border: string }> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    bg: "bg-[var(--accent-green)]/10",
    border: "border-[var(--accent-green)]/40",
  },
  error: {
    icon: <CircleAlert className="h-4 w-4" />,
    bg: "bg-[var(--accent-red)]/10",
    border: "border-[var(--accent-red)]/40",
  },
  warning: {
    icon: <TriangleAlert className="h-4 w-4" />,
    bg: "bg-[var(--accent-amber)]/10",
    border: "border-[var(--accent-amber)]/40",
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    bg: "bg-[var(--brand-cyan)]/10",
    border: "border-[var(--brand-cyan)]/40",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const pushToast = useCallback((toast: ToastPayload) => {
    setToasts((prev) => [...prev, { ...toast, id: uuid() }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, pushToast, dismiss }), [toasts, pushToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => {
          const tone = toneMap[toast.tone];
          return (
            <div
              key={toast.id}
              className={cn(
                "flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg",
                tone.bg,
                tone.border
              )}
            >
              <span className="mt-1 text-[var(--ink-900)]">{tone.icon}</span>
              <div className="flex-1 text-sm text-[var(--ink-900)]">
                <p className="font-semibold">{toast.title}</p>
                {toast.message && <p className="text-[var(--ink-700)]">{toast.message}</p>}
              </div>
              <button
                aria-label="Dismiss"
                onClick={() => dismiss(toast.id)}
                className="text-xs font-semibold text-[var(--ink-500)]"
              >
                Close
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
