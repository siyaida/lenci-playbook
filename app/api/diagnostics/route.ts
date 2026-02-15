import { NextResponse } from 'next/server';
import { collectDiagnostics } from '@/lib/diagnostics';
import { requireWorkspace } from '@/lib/auth/session';

export async function GET() {
  await requireWorkspace();
  const diagnostics = await collectDiagnostics();
  return NextResponse.json(diagnostics);
}
