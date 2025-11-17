import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "Flow A — Core Order",
    bullets: ["Provider creates order", "Mark Days 1–3", "Release result"],
  },
  {
    title: "Flow B — Missed Day Auto-Retest",
    bullets: ["Create order", "Mark only Day 1", "Trigger Missed Day", "Complete new attempt"],
  },
  {
    title: "Flow C — QC Retest",
    bullets: ["QC flags Low Microfuge or Leaky Cup", "System opens new attempt"],
  },
  {
    title: "Flow D — Sales Enablement",
    bullets: ["Upsert rep", "Assign clinic", "Watch inbox + KPIs"],
  },
  {
    title: "Flow E — CRM 360",
    bullets: ["Search NPI", "Add note", "Log interaction", "Review insights"],
  },
];

export default function PrototypeNotes() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">Prototype Notes</p>
        <h1 className="text-3xl font-semibold">Page 90 — Click Map</h1>
        <p className="text-sm text-[var(--ink-600)]">
          Reference for Kanwar: map these flows in Figma with hotspots between tabs/buttons.
        </p>
      </div>
      {steps.map((step) => (
        <Card key={step.title} className="space-y-2">
          <h3 className="text-lg font-semibold">{step.title}</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--ink-600)]">
            {step.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
