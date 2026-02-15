import { AppShell } from '@/components/layout/app-shell';
import { requireWorkspace } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export default async function SettingsPage() {
  const { workspaceId } = await requireWorkspace();
  const config = await prisma.openClawConfig.findUnique({ where: { workspaceId } });

  return (
    <AppShell>
      <h2 className="mb-4 text-xl font-semibold">Settings</h2>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <p>Mode: {config?.mode ?? 'mock'}</p>
        <p>Base URL: {config?.baseUrl ?? 'Not set'}</p>
        <a className="mt-3 inline-block text-indigo-300" href="/onboarding">Edit onboarding config</a>
              <form action="/api/wiring-pack" method="post" className="mt-3"><button className="rounded bg-brand px-3 py-2 text-sm">Generate Wiring Pack</button></form>
      </div>
    </AppShell>
  );
}
