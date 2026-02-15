import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validation/schemas';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'local';
  const check = rateLimit(`register:${ip}`, 10, 60_000);
  if (!check.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });

  const workspace = await prisma.workspace.create({ data: { name: `${parsed.data.name}'s Workspace` } });
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      workspaceId: workspace.id
    }
  });

  await prisma.openClawConfig.create({ data: { workspaceId: workspace.id, mode: 'mock' } });

  return NextResponse.json({ ok: true });
}
