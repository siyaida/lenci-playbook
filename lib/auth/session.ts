import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect('/auth/login');
  return user;
}

export async function requireWorkspace() {
  const user = await requireUser();
  if (!user.workspaceId || !user.handle) redirect('/onboarding');
  return { user, workspaceId: user.workspaceId };
}
