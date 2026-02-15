import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { encrypt } from '@/lib/security/crypto';
import { onboardingSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  const user = await requireUser();
  const parsed = onboardingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const workspaceId = user.workspaceId ?? (await prisma.workspace.create({ data: { name: `${parsed.data.name}'s Workspace` } })).id;

  await prisma.user.update({ where: { id: user.id }, data: { name: parsed.data.name, handle: parsed.data.handle, workspaceId } });

  await prisma.openClawConfig.upsert({
    where: { workspaceId },
    update: {
      baseUrl: parsed.data.openclawBaseUrl || null,
      tokenEncrypted: parsed.data.openclawToken ? encrypt(parsed.data.openclawToken) : undefined,
      workspacePath: parsed.data.workspacePath || null,
      mode: parsed.data.mode
    },
    create: {
      workspaceId,
      baseUrl: parsed.data.openclawBaseUrl || null,
      tokenEncrypted: parsed.data.openclawToken ? encrypt(parsed.data.openclawToken) : null,
      workspacePath: parsed.data.workspacePath || null,
      mode: parsed.data.mode
    }
  });

  return NextResponse.json({ ok: true });
}
