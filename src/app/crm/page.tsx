"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/form-field";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast-provider";
import { api } from "@/lib/api";

interface ProviderProfile {
  npi: string;
  firstName: string;
  lastName: string;
  specialty: string;
  org: string;
  city: string;
  state: string;
  repEmail?: string | null;
  notes: { id: string; body: string; createdAt: string }[];
  interactions: { id: string; channel: string; summary: string; createdAt: string }[];
  stats: { id: string; period: string; icd10: string; count: number; reimb: number }[];
}

export default function CrmPage() {
  const [npi, setNpi] = useState("1760458211");
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [activeTab, setActiveTab] = useState("Notes");
  const [noteText, setNoteText] = useState("Completed onboarding, waiting on first order.");
  const [interaction, setInteraction] = useState({ channel: "Call", summary: "Left voicemail." });
  const [repEmail, setRepEmail] = useState("jordan@prudenthealth.com");
  const [insights, setInsights] = useState<{ title: string; body: string }[]>([]);
  const { pushToast } = useToast();

  const loadProvider = async () => {
    try {
      const data = await api<ProviderProfile>(`/api/crm/provider/get?npi=${npi}`);
      setProvider(data);
      setRepEmail(data.repEmail ?? repEmail);
      const insightData = await api<{ title: string; body: string }[]>(`/api/crm/provider/insights?npi=${npi}`);
      setInsights(insightData);
      pushToast({ tone: "success", title: "Provider loaded" });
    } catch (error) {
      pushToast({ tone: "error", title: "Lookup failed", message: (error as Error).message });
    }
  };

  const addNote = async () => {
    if (!provider) return;
    try {
      await api("/api/crm/provider/note/add", {
        method: "POST",
        body: JSON.stringify({ npi: provider.npi, body: noteText }),
      });
      pushToast({ tone: "success", title: "Note added" });
      setNoteText("");
      loadProvider();
    } catch (error) {
      pushToast({ tone: "error", title: "Note failed", message: (error as Error).message });
    }
  };

  const logInteraction = async () => {
    if (!provider) return;
    try {
      await api("/api/crm/provider/interaction/log", {
        method: "POST",
        body: JSON.stringify({ npi: provider.npi, ...interaction }),
      });
      pushToast({ tone: "success", title: "Interaction logged" });
      loadProvider();
    } catch (error) {
      pushToast({ tone: "error", title: "Interaction failed", message: (error as Error).message });
    }
  };

  const assignRep = async () => {
    if (!provider) return;
    try {
      await api("/api/crm/provider/assign-rep", {
        method: "POST",
        body: JSON.stringify({ npi: provider.npi, repEmail }),
      });
      pushToast({ tone: "success", title: "Rep assigned" });
      loadProvider();
    } catch (error) {
      pushToast({ tone: "error", title: "Assignment failed", message: (error as Error).message });
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-royal)]">CRM</p>
        <h1 className="text-3xl font-semibold">Provider 360</h1>
        <div className="flex flex-wrap gap-3">
          <Input value={npi} onChange={(event) => setNpi(event.target.value)} placeholder="Enter NPI" className="max-w-xs" />
          <Button onClick={loadProvider}>Search NPI</Button>
        </div>
      </header>

      {provider ? (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="space-y-2">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-2xl font-semibold">
                  {provider.firstName} {provider.lastName}
                </h2>
                <Badge tone="open">{provider.specialty}</Badge>
              </div>
              <p className="text-sm text-[var(--ink-600)]">
                {provider.org} · {provider.city}, {provider.state}
              </p>
              {provider.repEmail && <p className="text-sm text-[var(--ink-600)]">Assigned Rep: {provider.repEmail}</p>}
              <div className="flex gap-4 text-xs text-[var(--ink-500)]">
                {['Notes', 'Interactions', 'Stats', 'Insights'].map((tab) => (
                  <button
                    key={tab}
                    className={`rounded-full px-3 py-1 font-semibold ${activeTab === tab ? 'bg-[var(--brand-royal)] text-white' : 'text-[var(--ink-600)]'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </Card>

            {activeTab === 'Notes' && (
              <Card className="space-y-4">
                <h3 className="text-lg font-semibold">Notes</h3>
                <div className="space-y-3">
                  {provider.notes.map((note) => (
                    <div key={note.id} className="rounded-2xl border border-[var(--ink-100)] p-4">
                      <p className="text-sm text-[var(--ink-700)]">{note.body}</p>
                      <p className="text-xs text-[var(--ink-400)]">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                  {provider.notes.length === 0 && <p className="text-sm text-[var(--ink-500)]">No notes yet.</p>}
                </div>
              </Card>
            )}

            {activeTab === 'Interactions' && (
              <Card className="space-y-4">
                <h3 className="text-lg font-semibold">Interactions</h3>
                {provider.interactions.length === 0 && <p className="text-sm text-[var(--ink-500)]">No interactions logged.</p>}
                {provider.interactions.map((interaction) => (
                  <div key={interaction.id} className="rounded-2xl border border-[var(--ink-100)] p-4">
                    <p className="text-sm font-semibold">{interaction.channel}</p>
                    <p className="text-sm text-[var(--ink-600)]">{interaction.summary}</p>
                    <p className="text-xs text-[var(--ink-400)]">{new Date(interaction.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </Card>
            )}

            {activeTab === 'Stats' && (
              <Card>
                <h3 className="text-lg font-semibold">Stats</h3>
                <Table>
                  <THead>
                    <TR>
                      <TH>Period</TH>
                      <TH>ICD-10</TH>
                      <TH>Count</TH>
                      <TH>Reimb</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {provider.stats.map((stat) => (
                      <TR key={stat.id}>
                        <TD>{stat.period}</TD>
                        <TD>{stat.icd10}</TD>
                        <TD>{stat.count}</TD>
                        <TD>${stat.reimb}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </Card>
            )}

            {activeTab === 'Insights' && (
              <Card className="space-y-3">
                <h3 className="text-lg font-semibold">Insights</h3>
                {insights.length === 0 && <p className="text-sm text-[var(--ink-500)]">No insights yet.</p>}
                {insights.map((insight) => (
                  <div key={insight.title} className="rounded-2xl border border-[var(--ink-100)] p-4">
                    <p className="text-sm font-semibold text-[var(--brand-indigo)]">{insight.title}</p>
                    <p className="text-sm text-[var(--ink-600)]">{insight.body}</p>
                  </div>
                ))}
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="space-y-3">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <FormField label="Assign Rep">
                <div className="flex gap-2">
                  <Input value={repEmail} onChange={(event) => setRepEmail(event.target.value)} />
                  <Button type="button" onClick={assignRep}>
                    Assign
                  </Button>
                </div>
              </FormField>
              <FormField label="Add Note">
                <Textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} rows={3} />
                <Button type="button" onClick={addNote} className="mt-2">
                  Add Note
                </Button>
              </FormField>
              <FormField label="Log Interaction">
                <div className="space-y-2">
                  <Input
                    value={interaction.channel}
                    onChange={(event) => setInteraction((prev) => ({ ...prev, channel: event.target.value }))}
                    placeholder="Channel"
                  />
                  <Textarea
                    value={interaction.summary}
                    onChange={(event) => setInteraction((prev) => ({ ...prev, summary: event.target.value }))}
                    rows={3}
                  />
                </div>
                <Button type="button" onClick={logInteraction} className="mt-2">
                  Log Interaction
                </Button>
              </FormField>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="text-sm text-[var(--ink-500)]">
          Search for an NPI to load the 360° view.
        </Card>
      )}
    </div>
  );
}
