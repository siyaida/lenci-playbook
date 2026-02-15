import { NextResponse } from 'next/server';
import { commandSchema } from '@/lib/validation/schemas';
import { requireWorkspace } from '@/lib/auth/session';
import { OpenClawClient } from '@/lib/openclaw/client';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'local';
  const check = rateLimit(`command:${ip}`, 30, 60_000);
  if (!check.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const { workspaceId } = await requireWorkspace();
  const parsed = commandSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const client = new OpenClawClient(workspaceId);
  const commandMap = {
    health: () => client.health(),
    'scan-repo': () => client.scanRepo(parsed.data.payload),
    'index-md': () => client.indexMd(parsed.data.payload),
    'validate-routes': () => client.validateRoutes(parsed.data.payload),
    'run-tests': () => client.runTests(parsed.data.payload),
    'generate-wiring-md': () => client.generateWiringMd(parsed.data.payload)
  };

  const result = await commandMap[parsed.data.command]();
  return NextResponse.json(result);
}
