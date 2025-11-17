import { Badge } from "@/components/ui/badge";

const statusToneMap: Record<string, React.ComponentProps<typeof Badge>["tone"]> = {
  ordered: "ordered",
  open: "open",
  missed: "missed",
  qc_retest: "qc_retest",
  admin_retest: "admin_retest",
  collected: "collected",
  released: "released",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase().replace(/\s+/g, "_");
  const tone = statusToneMap[key] ?? "open";
  const label = status.replace(/_/g, " ");
  return <Badge tone={tone}>{label}</Badge>;
}
