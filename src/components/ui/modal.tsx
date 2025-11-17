"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "info" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function Modal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "info",
  onCancel,
  onConfirm,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (typeof document === "undefined" || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-royal)]">
          Confirm Action
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-[var(--ink-900)]">{title}</h3>
        {description && <p className="mt-2 text-sm text-[var(--ink-600)]">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="tertiary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={cn(tone === "danger" && "bg-[var(--accent-red)] hover:bg-red-600")}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
