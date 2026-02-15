import { AppShell } from '@/components/layout/app-shell';
import { collectDiagnostics } from '@/lib/diagnostics';
import { requireWorkspace } from '@/lib/auth/session';

export default async function DiagnosticsPage() {
  await requireWorkspace();
  const diagnostics = await collectDiagnostics();

  return (
    <AppShell>
      <h2 className="mb-4 text-xl font-semibold">Diagnostics</h2>
      <pre className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs">{JSON.stringify(diagnostics, null, 2)}</pre>
    </AppShell>
  );
}
