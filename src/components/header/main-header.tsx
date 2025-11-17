"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Welcome", href: "/" },
  { label: "Provider", href: "/provider" },
  { label: "Lab/QC", href: "/lab-qc" },
  { label: "Sales", href: "/sales" },
  { label: "Executive", href: "/executive" },
  { label: "CRM", href: "/crm" },
];

export function MainHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--brand-royal)]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <Image src="/logos/prudent-logo.svg" alt="Prudent" width={40} height={40} />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">
              Prudent EMR Lite
            </p>
            <p className="text-xs text-white/70">AIIP-backed · CyPath®️ Lung</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Image src="/logos/cypath-logo.svg" alt="CyPath" width={32} height={32} />
          <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold">AIIP-backed</span>
          <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-[var(--brand-royal)]">
            CyPath®️ Lung
          </span>
        </div>
        <div className="flex items-center">
          <div className="rounded-full border border-white/20 px-4 py-1 text-xs text-white/80">
            User Menu
          </div>
        </div>
      </div>
      <nav className="bg-white">
        <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-6">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative border-b-2 px-2 py-3 text-sm font-semibold text-[var(--ink-500)]",
                  active
                    ? "border-[var(--brand-indigo)] text-[var(--brand-royal)]"
                    : "border-transparent hover:text-[var(--brand-royal)]"
                )}
              >
                {tab.label}
                {active && <span className="absolute inset-x-0 -bottom-[2px] h-0.5 bg-[var(--brand-indigo)]" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
