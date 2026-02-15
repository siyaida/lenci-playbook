import { AppShell } from '@/components/layout/app-shell';
import { BoardView } from '@/components/board/board-view';
import { prisma } from '@/lib/db/prisma';
import { requireWorkspace } from '@/lib/auth/session';

export default async function HomePage() {
  const { workspaceId } = await requireWorkspace();
  const board = await prisma.board.findFirst({
    where: { workspaceId },
    include: { columns: { include: { tasks: true } } }
  });

  if (!board) return <AppShell>No board found.</AppShell>;

  return (
    <AppShell>
      <BoardView boardId={board.id} columns={board.columns as never} />
    </AppShell>
  );
}
