import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-[var(--brand-royal)] text-white hover:bg-[var(--brand-indigo)] focus-visible:outline-[var(--brand-cyan)]",
        secondary:
          "border border-[var(--ink-300)] bg-white text-[var(--brand-royal)] hover:border-[var(--brand-royal)] focus-visible:outline-[var(--brand-indigo)]",
        tertiary: "text-[var(--brand-royal)] hover:text-[var(--brand-indigo)] focus-visible:outline-[var(--brand-indigo)]",
        destructive: "bg-[var(--accent-red)] text-white hover:bg-red-600 focus-visible:outline-red-200",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
