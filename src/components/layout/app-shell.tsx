import { MainHeader } from "@/components/header/main-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <MainHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">{children}</main>
    </div>
  );
}
