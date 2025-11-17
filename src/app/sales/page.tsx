"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/form-field";
import { KpiCard } from "@/components/kpi-card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-provider";
import { api } from "@/lib/api";

const aggressivenessOptions = [
  { label: "Base", value: "BASE" },
  { label: "Aggressive", value: "AGGRESSIVE" },
  { label: "Stretch", value: "STRETCH" },
];

interface Notification {
  id: string;
  kind: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export default function SalesPage() {
  const { pushToast } = useToast();
  const repForm = useForm({
    defaultValues: {
      name: "Jordan Patel",
      email: "jordan@prudenthealth.com",
      territory: "Southwest",
      monthlyGoal: 12,
      aggressiveness: "BASE",
    },
  });

  const assignForm = useForm({
    defaultValues: {
      clinic: "CyPath Demo Clinic",
      repEmail: "jordan@prudenthealth.com",
    },
  });

  const [repEmail, setRepEmail] = useState(repForm.getValues("email"));
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metrics, setMetrics] = useState<{ orders: number; released: number; goal: number; percentToGoal: number } | null>(null);
  const [filter, setFilter] = useState("ALL");

  const loadNotifications = useCallback(
    async (email: string) => {
      try {
        const data = await api<Notification[]>(`/api/sales/notifications?rep_email=${email}`);
        setNotifications(data);
      } catch (error) {
        pushToast({ tone: "error", title: "Notifications failed", message: (error as Error).message });
      }
    },
    [pushToast]
  );

  const loadMetrics = useCallback(
    async (email: string) => {
      try {
        const data = await api<{ orders: number; released: number; goal: number; percentToGoal: number }>(
          `/api/sales/metrics?rep_email=${email}`
        );
        setMetrics(data);
      } catch (error) {
        pushToast({ tone: "error", title: "Metrics failed", message: (error as Error).message });
      }
    },
    [pushToast]
  );

  useEffect(() => {
    if (!repEmail) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load latest inbox and KPIs when rep changes
    void loadNotifications(repEmail);
    void loadMetrics(repEmail);
  }, [loadMetrics, loadNotifications, repEmail]);

  const submitRep = repForm.handleSubmit(async (values) => {
    try {
      await api("/api/sales/rep/upsert", { method: "POST", body: JSON.stringify({ ...values, monthlyGoal: Number(values.monthlyGoal) }) });
      setRepEmail(values.email);
      pushToast({ tone: "success", title: "Rep saved", message: values.email });
    } catch (error) {
      pushToast({ tone: "error", title: "Rep save failed", message: (error as Error).message });
    }
  });

  const submitAssignment = assignForm.handleSubmit(async (values) => {
    try {
      await api("/api/sales/assign", { method: "POST", body: JSON.stringify(values) });
      setRepEmail(values.repEmail);
      pushToast({ tone: "success", title: "Clinic assigned" });
    } catch (error) {
      pushToast({ tone: "error", title: "Assignment failed", message: (error as Error).message });
    }
  });

  const filteredNotifications = notifications.filter((item) => filter === "ALL" || item.kind === filter);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">Sales</p>
        <h1 className="text-3xl font-semibold">Rep & Territory</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={submitRep} className="space-y-4">
            <h3 className="text-lg font-semibold">Upsert Rep</h3>
            <FormField label="Name">
              <Input {...repForm.register("name")} />
            </FormField>
            <FormField label="Email">
              <Input type="email" {...repForm.register("email")} />
            </FormField>
            <FormField label="Territory">
              <Input {...repForm.register("territory")} />
            </FormField>
            <FormField label="Monthly Goal">
              <Input type="number" {...repForm.register("monthlyGoal", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Aggressiveness">
              <Select {...repForm.register("aggressiveness")}> 
                {aggressivenessOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <Button type="submit">Save Rep</Button>
          </form>
        </Card>

        <Card>
          <form onSubmit={submitAssignment} className="space-y-4">
            <h3 className="text-lg font-semibold">Assign Clinic to Rep</h3>
            <FormField label="Clinic">
              <Input {...assignForm.register("clinic")} />
            </FormField>
            <FormField label="Rep Email">
              <Input type="email" {...assignForm.register("repEmail")} />
            </FormField>
            <Button type="submit">Assign</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex gap-2 text-xs">
              {["ALL", "ORDER_CREATED", "RETEST_TRIGGERED", "RESULT_RELEASED"].map((pill) => (
                <button
                  type="button"
                  key={pill}
                  className={`rounded-full border px-3 py-1 ${filter === pill ? "bg-[var(--brand-royal)] text-white" : "text-[var(--ink-600)]"}`}
                  onClick={() => setFilter(pill)}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredNotifications.length === 0 && (
              <p className="text-sm text-[var(--ink-500)]">No notifications. Create an order to trigger events.</p>
            )}
            {filteredNotifications.map((note) => (
              <div key={note.id} className="rounded-2xl border border-[var(--ink-100)] p-4">
                <div className="flex items-center justify-between text-xs text-[var(--ink-500)]">
                  <Badge tone="open">{note.kind}</Badge>
                  <span>{new Date(note.createdAt).toLocaleString()}</span>
                </div>
                <pre className="mt-2 text-xs text-[var(--ink-700)]">
                  {JSON.stringify(note.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Quota Progress</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard label="Orders" value={`${metrics?.orders ?? 0}`} />
            <KpiCard label="Released" value={`${metrics?.released ?? 0}`} />
            <KpiCard label="Goal" value={`${metrics?.goal ?? 0}`} />
            <KpiCard label="% to Goal" value={`${metrics?.percentToGoal ?? 0}%`} />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--ink-500)]">
              <span>Progress</span>
              <span>{metrics?.percentToGoal ?? 0}%</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-[var(--ink-100)]">
              <div
                className="h-3 rounded-full bg-[var(--brand-indigo)]"
                style={{ width: `${metrics?.percentToGoal ?? 0}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
