'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', handle: '', openclawBaseUrl: '', openclawToken: '', workspacePath: '', mode: 'mock' });

  return (
    <main className="mx-auto mt-12 max-w-xl rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-4 text-xl font-semibold">Welcome setup</h1>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch('/api/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
          router.push('/');
        }}
      >
        <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Handle" value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} />
        <input placeholder="OpenClaw Base URL" value={form.openclawBaseUrl} onChange={(e) => setForm({ ...form, openclawBaseUrl: e.target.value })} />
        <input placeholder="OpenClaw Token" value={form.openclawToken} onChange={(e) => setForm({ ...form, openclawToken: e.target.value })} />
        <input placeholder="Workspace path (optional)" value={form.workspacePath} onChange={(e) => setForm({ ...form, workspacePath: e.target.value })} />
        <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
          <option value="mock">Mock mode</option>
          <option value="real">Real mode</option>
        </select>
        <Button type="submit">Save setup</Button>
      </form>
    </main>
  );
}
