import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const personas = [
  {
    title: "Provider",
    description: "Create & progress CyPath Lung episodes end-to-end.",
    cta: "Go to Provider",
    href: "/provider",
  },
  {
    title: "Lab / QC",
    description: "Trigger QC / admin retests and validate timelines.",
    cta: "Open QC",
    href: "/lab-qc",
  },
  {
    title: "Sales",
    description: "Upsert reps, assign clinics, watch quotas in real time.",
    cta: "Manage Sales",
    href: "/sales",
  },
  {
    title: "Executive",
    description: "Track revenue, outcomes, RO milestones, and pipeline.",
    cta: "View KPIs",
    href: "/executive",
  },
  {
    title: "CRM",
    description: "360° provider records with notes, stats, and insights.",
    cta: "Launch CRM",
    href: "/crm",
  },
];

const flows = [
  { title: "Flow A — Core Order", summary: "Create order, mark days 1-3, release result." },
  { title: "Flow B — Missed Day", summary: "Auto-open new attempt when a day is missed." },
  { title: "Flow C — QC Retest", summary: "Flag microfuge / leaky cup & restart attempt." },
  { title: "Flow D — Sales Enablement", summary: "Upsert rep, assign clinic, see notifications + KPIs." },
  { title: "Flow E — CRM 360", summary: "Search NPI, add notes/interactions, study insights." },
];

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="gradient-hero rounded-[32px] px-10 py-14 text-white shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">Demo Ready</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight">
          Prudent EMR Lite · CyPath®️ Lung Workflow Portal
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">
          Switch between personas to explore Provider, Lab/QC, Sales, Executive, and CRM workflows in one streamlined portal.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/10 px-4 py-1 font-semibold">White-label ready</span>
          <span className="rounded-full bg-white/10 px-4 py-1 font-semibold">Role aware</span>
          <span className="rounded-full bg-white/10 px-4 py-1 font-semibold">FastAPI parity</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/provider" className="inline-flex items-center gap-2">
              Launch Provider Flow <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/90-prototype" className="inline-flex items-center gap-2">
              Prototype Spec <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {personas.map((persona) => (
          <Card key={persona.title} className="flex flex-col justify-between bg-[var(--panel)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">
                Persona
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{persona.title}</h3>
              <p className="mt-2 text-sm text-[var(--ink-600)]">{persona.description}</p>
            </div>
            <Button variant="secondary" className="mt-6 w-fit" asChild>
              <Link href={persona.href}>{persona.cta}</Link>
            </Button>
          </Card>
        ))}
      </section>

      <section className="rounded-[32px] bg-white p-10 shadow-card">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">
            Prototype coverage
          </p>
          <h2 className="text-3xl font-semibold text-[var(--ink-900)]">Flows A–E</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {flows.map((flow) => (
            <div key={flow.title} className="rounded-2xl border border-[var(--ink-100)] bg-[var(--surface)] p-5">
              <p className="text-sm font-semibold text-[var(--brand-indigo)]">{flow.title}</p>
              <p className="text-sm text-[var(--ink-600)]">{flow.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
