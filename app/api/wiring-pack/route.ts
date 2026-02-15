import { NextResponse } from 'next/server';
import { requireWorkspace } from '@/lib/auth/session';
import { collectDiagnostics } from '@/lib/diagnostics';
import { buildWiringPack, zipWiringPack } from '@/lib/wiring/generator';
import { prisma } from '@/lib/db/prisma';

export async function POST() {
  const { workspaceId } = await requireWorkspace();
  const diagnostics = await collectDiagnostics();
  const files = buildWiringPack({
    routes: diagnostics.routes,
    envVars: diagnostics.env.map((e) => `${e.name}: ${e.present ? 'present' : 'missing'}`),
    schemasSummary: 'Prisma models: User, Workspace, OpenClawConfig, Board, Column, Task, TaskActivity, WiringPack.',
    commandsSummary: 'health, scan-repo, index-md, validate-routes, run-tests, generate-wiring-md.'
  });

  await prisma.wiringPack.create({
    data: {
      workspaceId,
      readme: files['README.md'],
      routes: files['ROUTES.md'],
      commands: files['COMMANDS.md'],
      schemas: files['SCHEMAS.md'],
      testing: files['TESTING.md'],
      integration: files['INTEGRATION.md']
    }
  });

  const zip = await zipWiringPack(files);
  return new NextResponse(zip, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="wiring-pack.zip"'
    }
  });
}
