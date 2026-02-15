'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { CommandCenterPanel } from '@/components/command-center/panel';

type Task = { id: string; title: string; priority: string; assigneeType: string; columnId: string };
type Column = { id: string; name: string; order: number; tasks: Task[] };

export function BoardView({ boardId, columns }: { boardId: string; columns: Column[] }) {
  const [state, setState] = useState(columns);
  const [pending, startTransition] = useTransition();

  async function moveTask(taskId: string, targetColumnId: string) {
    const prev = state;
    setState((current) =>
      current.map((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== taskId) })).map((c) =>
        c.id === targetColumnId
          ? { ...c, tasks: [...c.tasks, prev.flatMap((col) => col.tasks).find((task) => task.id === taskId)!] }
          : c
      )
    );

    startTransition(async () => {
      await fetch(`/api/boards/${boardId}/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, targetColumnId })
      });
    });
  }

  async function createTask(columnId: string) {
    const title = prompt('Task title');
    if (!title) return;
    await fetch(`/api/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, columnId, description: '', labels: [], priority: 'MEDIUM', assigneeType: 'ME' })
    });
    location.reload();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-4 md:grid-cols-3">
        {state
          .sort((a, b) => a.order - b.order)
          .map((column) => (
            <div
              key={column.id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const taskId = e.dataTransfer.getData('taskId');
                if (taskId) moveTask(taskId, column.id);
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{column.name}</h3>
                <Button className="px-2 py-1 text-xs" onClick={() => createTask(column.id)}>
                  + Task
                </Button>
              </div>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <article
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                    key={task.id}
                    className="cursor-move rounded-md border border-slate-700 bg-slate-800 p-2"
                  >
                    <h4 className="text-sm font-medium">{task.title}</h4>
                    <p className="text-xs text-slate-400">{task.priority} · {task.assigneeType}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
      </section>
      <CommandCenterPanel pending={pending} />
    </div>
  );
}
