'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <main className="mx-auto mt-24 max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-4 text-xl font-semibold">Create account</h1>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
          if (!res.ok) return setError('Failed to register');
          router.push('/auth/login');
        }}
      >
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit">Create account</Button>
      </form>
    </main>
  );
}
