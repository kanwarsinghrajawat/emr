import * as React from "react";
import { cn } from "@/lib/utils";

const badgeMap: Record<string, string> = {
  ordered: "bg-[var(--brand-royal)]/10 text-[var(--brand-royal)]",
  open: "bg-[var(--brand-cyan)]/10 text-[var(--brand-cyan)]",
  missed: "bg-[var(--accent-amber)]/15 text-[var(--accent-amber)]",
  qc_retest: "bg-[var(--brand-purple)]/15 text-[var(--brand-purple)]",
  admin_retest: "bg-[var(--ink-500)]/15 text-[var(--ink-700)]",
  collected: "bg-[var(--accent-green)]/15 text-[var(--accent-green)]",
  released: "bg-[var(--brand-indigo)]/15 text-[var(--brand-indigo)]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof badgeMap;
}

export function Badge({ tone = "open", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
        badgeMap[tone] ?? badgeMap.open,
        className
      )}
      {...props}
    />
  );
}
