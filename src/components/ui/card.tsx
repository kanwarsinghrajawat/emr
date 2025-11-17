import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--ink-100)] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]",
        className
      )}
      {...props}
    />
  );
}
