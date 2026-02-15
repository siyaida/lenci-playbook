'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');

  return (
    <main className="mx-auto mt-24 max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn('credentials', { email, password, callbackUrl: '/' });
        }}
      >
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <Button type="submit">Sign in</Button>
      </form>
      <p className="mt-3 text-sm"><a href="/auth/register">Create account</a></p>
    </main>
  );
}
