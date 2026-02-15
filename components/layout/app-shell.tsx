import Link from 'next/link';
import { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-semibold">OpenClaw Command Center</h1>
          <nav className="flex gap-4 text-sm text-slate-300">
            <Link href="/">Board</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/settings/diagnostics">Diagnostics</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
