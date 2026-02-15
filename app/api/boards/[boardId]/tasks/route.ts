import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireWorkspace } from '@/lib/auth/session';
import { taskSchema } from '@/lib/validation/schemas';

export async function POST(request: Request, { params }: { params: { boardId: string } }) {
  await requireWorkspace();
  const parsed = taskSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const task = await prisma.task.create({
    data: {
      ...parsed.data,
      boardId: params.boardId,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      attachments: [],
      activities: { create: { message: 'Task created' } }
    }
  });

  return NextResponse.json(task);
}

export async function PATCH(request: Request) {
  await requireWorkspace();
  const body = (await request.json()) as { taskId: string; targetColumnId: string };
  const task = await prisma.task.update({
    where: { id: body.taskId },
    data: { columnId: body.targetColumnId, activities: { create: { message: `Moved to column ${body.targetColumnId}` } } }
  });
  return NextResponse.json(task);
}
