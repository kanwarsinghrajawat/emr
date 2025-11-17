"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast-provider";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";

interface Attempt {
  id: string;
  attemptNo: number;
  status: string;
  qcReason?: string | null;
  day1Status?: string | null;
  day2Status?: string | null;
  day3Status?: string | null;
}

interface Episode {
  id: string;
  clinic: string;
  provider: string;
  status: string;
  attempts: Attempt[];
}

const qcReasons = [
  { label: "QC: Low Microfuge", value: "QC: Low Microfuge", endpoint: "/api/qc/retest" },
  { label: "QC: Leaky Cup", value: "QC: Leaky Cup", endpoint: "/api/qc/retest" },
  { label: "Admin Retest", value: "Admin Retest", endpoint: "/api/admin/retest" },
];

export default function LabQcPage() {
  const [episodeId, setEpisodeId] = useState("");
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeReason, setActiveReason] = useState<typeof qcReasons[number] | null>(null);
  const { pushToast } = useToast();

  const fetchEpisode = async () => {
    setLoading(true);
    try {
      const data = await api<Episode>(`/api/episode?episode_id=${episodeId}`);
      setEpisode(data);
      pushToast({ tone: "success", title: "Episode loaded", message: data.id });
    } catch (error) {
      pushToast({ tone: "error", title: "Episode lookup failed", message: (error as Error).message });
      setEpisode(null);
    } finally {
      setLoading(false);
    }
  };

  const triggerReason = async () => {
    if (!episode || !activeReason) return;
    try {
      await api(activeReason.endpoint, {
        method: "POST",
        body: JSON.stringify({ episodeId: episode.id, reason: activeReason.value }),
      });
      pushToast({ tone: "info", title: `${activeReason.label} triggered` });
      await fetchEpisode();
    } catch (error) {
      pushToast({ tone: "error", title: "Retest failed", message: (error as Error).message });
    } finally {
      setActiveReason(null);
    }
  };

  const timeline = useMemo(() => episode?.attempts ?? [], [episode]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">Lab / QC</p>
        <h1 className="text-3xl font-semibold">Quality Control</h1>
        <p className="text-sm text-[var(--ink-600)]">Search by Episode ID, then trigger QC/Admin retests with one click.</p>
      </div>

      <Card className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-[var(--ink-700)]">Current Episode</p>
          <Input placeholder="EPISODE-ID" value={episodeId} onChange={(event) => setEpisodeId(event.target.value)} />
        </div>
        <Button className="self-start" onClick={fetchEpisode} disabled={!episodeId}>
          {loading ? "Loading..." : "Find Episode"}
        </Button>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--ink-500)]">Episode</p>
              <p className="text-lg font-semibold text-[var(--ink-900)]">{episode?.id ?? "Not loaded"}</p>
            </div>
            {episode && <StatusBadge status={episode.status.toLowerCase()} />}
          </div>
          <div className="flex flex-wrap gap-3">
            {qcReasons.map((reason) => (
              <Button key={reason.label} variant="secondary" disabled={!episode} onClick={() => setActiveReason(reason)}>
                {reason.label}
              </Button>
            ))}
          </div>
          <p className="rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-600)]">
            Flag Low Microfuge or Leaky Cup conditions to open a replacement attempt. Admin Retest is reserved for back-office overrides.
          </p>
        </Card>
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Timeline</h3>
          {timeline.length === 0 && <p className="text-sm text-[var(--ink-500)]">No attempts yet—load an episode.</p>}
          <div className="space-y-4">
            {timeline.map((attempt) => (
              <div key={attempt.id} className="rounded-2xl border border-[var(--ink-100)] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold">Attempt {attempt.attemptNo}</p>
                  <StatusBadge status={attempt.status.toLowerCase()} />
                  {attempt.qcReason && <Badge tone="qc_retest">{attempt.qcReason}</Badge>}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[var(--ink-600)]">
                  <span>Day 1: {attempt.day1Status ?? "—"}</span>
                  <span>Day 2: {attempt.day2Status ?? "—"}</span>
                  <span>Day 3: {attempt.day3Status ?? "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-[var(--surface)]">
        <h3 className="text-lg font-semibold">Retest Policy</h3>
        <p className="mt-2 text-sm text-[var(--ink-600)]">
          • Low Microfuge — close current attempt and auto-open new kit.
          <br />• Leaky Cup — ship replacement cup within 24h.
          <br />• Admin Retest — requires approval from Ops Director before firing.
        </p>
      </Card>

      <Modal
        open={Boolean(activeReason)}
        title={activeReason?.label ?? ""}
        description={activeReason?.value}
        confirmLabel="Trigger"
        tone={activeReason?.label === "Admin Retest" ? "danger" : "info"}
        onCancel={() => setActiveReason(null)}
        onConfirm={triggerReason}
      />
    </div>
  );
}
