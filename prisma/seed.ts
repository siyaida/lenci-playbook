import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const workspace = await prisma.workspace.create({ data: { name: 'Default Workspace' } });
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Admin',
      handle: 'admin',
      passwordHash: await bcrypt.hash('password123', 10),
      workspaceId: workspace.id
    }
  });

  const board = await prisma.board.create({ data: { name: 'OpenClaw Command Board', workspaceId: workspace.id } });

  const [todo, inProgress, done] = await Promise.all([
    prisma.column.create({ data: { name: 'Backlog', order: 1, boardId: board.id } }),
    prisma.column.create({ data: { name: 'In Progress', order: 2, boardId: board.id } }),
    prisma.column.create({ data: { name: 'Done', order: 3, boardId: board.id } })
  ]);

  await prisma.task.createMany({
    data: [
      { title: 'Configure OpenClaw', boardId: board.id, columnId: todo.id, labels: ['setup'], assigneeId: user.id, assigneeType: 'ME' },
      { title: 'Run diagnostics', boardId: board.id, columnId: inProgress.id, labels: ['quality'], assigneeType: 'OPENCLAW_BOT' },
      { title: 'Generate wiring pack', boardId: board.id, columnId: done.id, labels: ['docs'], assigneeId: user.id, assigneeType: 'ME' }
    ]
  });

  await prisma.openClawConfig.create({ data: { workspaceId: workspace.id, mode: 'mock' } });
}

main().finally(async () => prisma.$disconnect());
