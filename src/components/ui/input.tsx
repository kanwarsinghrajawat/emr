import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-[var(--ink-300)] bg-white px-4 py-2.5 text-sm text-[var(--ink-900)] shadow-sm transition focus:border-[var(--brand-indigo)] focus:ring-4 focus:ring-[var(--brand-indigo)]/20",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
