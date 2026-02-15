'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const presets = [
  ['scan-repo', 'Scan repo'],
  ['index-md', 'Index MD files'],
  ['validate-routes', 'Run route checks'],
  ['run-tests', 'Run tests'],
  ['generate-wiring-md', 'Generate wiring MD']
] as const;

export function CommandCenterPanel({ pending }: { pending: boolean }) {
  const [command, setCommand] = useState('health');
  const [output, setOutput] = useState('Ready.');

  async function run(cmd: string) {
    const response = await fetch('/api/command-center', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd, payload: {} })
    });
    const data = await response.json();
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-3 font-semibold">Command Center</h3>
      <div className="space-y-2">
        <input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="Enter command" />
        <Button onClick={() => run(command)} disabled={pending}>Run</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map(([value, label]) => (
          <button key={value} onClick={() => run(value)} className="rounded border border-slate-700 px-2 py-1 text-xs">
            {label}
          </button>
        ))}
      </div>
      <pre className="mt-4 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-emerald-300">{output}</pre>
    </aside>
  );
}
