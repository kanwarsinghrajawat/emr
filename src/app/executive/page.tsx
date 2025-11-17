"use client";

import { useCallback, useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { useToast } from "@/components/ui/toast-provider";
import { api } from "@/lib/api";

interface ExecMetrics {
  bookedRevenue: number;
  projectedRevenue: number;
  outcomes: { positive: number; negative: number };
  pipeline: { open: number; collected: number; released: number };
  lastUpdated: string;
}

const PIE_COLORS = ["#3B4BD6", "#0EA5E9"];

export default function ExecutivePage() {
  const [metrics, setMetrics] = useState<ExecMetrics | null>(null);
  const { pushToast } = useToast();

  const loadMetrics = useCallback(async () => {
    try {
      const data = await api<ExecMetrics>("/api/exec/metrics");
      setMetrics(data);
      pushToast({ tone: "success", title: "KPIs refreshed" });
    } catch (error) {
      pushToast({ tone: "error", title: "Failed to load KPIs", message: (error as Error).message });
    }
  }, [pushToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount
    void loadMetrics();
  }, [loadMetrics]);

  const pipelineData = metrics
    ? [
        { name: "Open", value: metrics.pipeline.open },
        { name: "Collected", value: metrics.pipeline.collected },
        { name: "Released", value: metrics.pipeline.released },
      ]
    : [];

  const pieData = metrics
    ? [
        { name: "Positive", value: metrics.outcomes.positive },
        { name: "Negative", value: metrics.outcomes.negative },
      ]
    : [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">Executive</p>
          <h1 className="text-3xl font-semibold">KPIs</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={loadMetrics}>Refresh KPIs</Button>
          <p className="text-xs text-[var(--ink-500)]">
            Last updated: {metrics ? new Date(metrics.lastUpdated).toLocaleString() : "—"}
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Booked" value={`$${metrics?.bookedRevenue ?? 0}`} />
        <KpiCard label="Projected" value={`$${metrics?.projectedRevenue ?? 0}`} />
        <KpiCard label="Positive" value={`${metrics?.outcomes.positive ?? 0}`} />
        <KpiCard label="Negative" value={`${metrics?.outcomes.negative ?? 0}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Outcomes</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Pipeline</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={pipelineData}>
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#3B4BD6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {!metrics && <Card>No data yet—run a test flow to populate KPIs.</Card>}
    </div>
  );
}
