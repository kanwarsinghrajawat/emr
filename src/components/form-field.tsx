import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, description, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
        {description && <p className="text-xs text-[var(--ink-500)]">{description}</p>}
      </div>
      {children}
      {error && <p className="text-xs text-[var(--accent-red)]">{error}</p>}
    </div>
  );
}
