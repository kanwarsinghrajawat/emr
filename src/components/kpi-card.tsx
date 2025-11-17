import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  value: string;
  delta?: string;
  accent?: string;
}

export function KpiCard({ label, value, delta, accent = "var(--brand-indigo)" }: Props) {
  return (
    <Card className="space-y-3">
      <p className="text-sm font-medium text-[var(--ink-500)]">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold tracking-tight text-[var(--ink-900)]">{value}</p>
        {delta && (
          <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: accent }}>
            <TrendingUp className="h-4 w-4" /> {delta}
          </span>
        )}
      </div>
    </Card>
  );
}
