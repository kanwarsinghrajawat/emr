"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form-field";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { useToast } from "@/components/ui/toast-provider";
import { api } from "@/lib/api";

const defaultValues = {
  clinic: "CyPath Demo Clinic",
  provider: "Dr. Elena Cruz",
  patientName: "Jonah Example",
  patientDob: "1988-02-02",
  patientMrn: "MRN-7783",
  icd10: "J98.4",
  mobile: "+1 (555) 111-3434",
  email: "patient@example.com",
  address: "77 Demo Street, Austin, TX",
};

const formFields: { name: keyof typeof defaultValues; label: string; type?: string; description?: string }[] = [
  { name: "clinic", label: "Clinic" },
  { name: "provider", label: "Provider" },
  { name: "patientName", label: "Patient Name" },
  { name: "patientDob", label: "Patient DOB", type: "date" },
  { name: "patientMrn", label: "MRN" },
  { name: "icd10", label: "ICD-10" },
  { name: "mobile", label: "Mobile" },
  { name: "email", label: "Email" },
  { name: "address", label: "Address", description: "Ship-to / FedEx return kit" },
];

type OrderResponse = { episode_id: string; attempt_id: string };

export default function ProviderPage() {
  const form = useForm({ defaultValues });
  const { pushToast } = useToast();
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [status, setStatus] = useState("Empty");

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await api<OrderResponse>("/api/order", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setEpisodeId(response.episode_id);
      setAttemptId(response.attempt_id);
      setStatus("Open");
      pushToast({ tone: "success", title: "Order created", message: `Episode ${response.episode_id}` });
    } catch (error) {
      pushToast({ tone: "error", title: "Unable to create order", message: (error as Error).message });
    }
  });

  const markDay = async (day: string) => {
    if (!episodeId) return;
    try {
      await api(`/api/progress?episode_id=${episodeId}&day=${day}`, { method: "POST" });
      setStatus(day === "3" ? "Collected" : `Day ${day} Completed`);
      pushToast({ tone: "info", title: `Day ${day} marked`, message: "Status advanced." });
    } catch (error) {
      pushToast({ tone: "error", title: "Progress failed", message: (error as Error).message });
    }
  };

  const release = async (classification: "positive" | "negative") => {
    if (!episodeId) return;
    try {
      await api(`/api/release?episode_id=${episodeId}`, {
        method: "POST",
        body: JSON.stringify({ classification, romScore: classification === "positive" ? 72 : 18 }),
      });
      setStatus(`Released ${classification}`);
      pushToast({ tone: "success", title: "Result released", message: classification });
    } catch (error) {
      pushToast({ tone: "error", title: "Release failed", message: (error as Error).message });
    }
  };

  const triggerMiss = async () => {
    if (!episodeId) return;
    try {
      const response = await api<{ attempt_id: string }>("/api/miss", {
        method: "POST",
        body: JSON.stringify({ episodeId }),
      });
      setAttemptId(response.attempt_id);
      setStatus("Missed — new attempt opened");
      pushToast({ tone: "warning", title: "Missed day", message: "New attempt opened." });
    } catch (error) {
      pushToast({ tone: "error", title: "Miss flow failed", message: (error as Error).message });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">
          Provider Persona
        </p>
        <h1 className="text-3xl font-semibold">Create Order</h1>
        <p className="text-sm text-[var(--ink-600)]">
          Three consecutive days required. Missed day auto-opens a new attempt.
        </p>
      </div>

      <Card className="space-y-8">
        <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
          {formFields.map((field) => (
            <FormField key={field.name} label={field.label} description={field.description}>
              <Input type={field.type ?? "text"} {...form.register(field.name)} />
            </FormField>
          ))}
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit">Create Order</Button>
            <Button type="button" variant="secondary" onClick={() => markDay("1")} disabled={!episodeId}>
              Mark Day 1
            </Button>
            <Button type="button" variant="secondary" onClick={() => markDay("2")} disabled={!episodeId}>
              Mark Day 2
            </Button>
            <Button type="button" variant="secondary" onClick={() => markDay("3")} disabled={!episodeId}>
              Mark Day 3
            </Button>
            <Button type="button" onClick={() => release("positive")} disabled={!episodeId}>
              Release Positive
            </Button>
            <Button type="button" onClick={() => release("negative")} disabled={!episodeId}>
              Release Negative
            </Button>
            <Button type="button" variant="tertiary" onClick={triggerMiss} disabled={!episodeId}>
              Missed Day
            </Button>
          </div>
        </form>
      </Card>

      <Card className="flex flex-wrap items-center gap-4">
        {episodeId ? <StatusBadge status={status} /> : <Badge tone="ordered">No order yet</Badge>}
        <p className="text-sm text-[var(--ink-600)]">
          Episode ID: <span className="font-semibold">{episodeId ?? "—"}</span>
        </p>
        <p className="text-sm text-[var(--ink-600)]">
          Attempt ID: <span className="font-semibold">{attemptId ?? "—"}</span>
        </p>
        <p className="text-sm text-[var(--ink-600)]">Status: {status}</p>
      </Card>
    </div>
  );
}
