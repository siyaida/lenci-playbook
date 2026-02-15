import { prisma } from '@/lib/db/prisma';

export async function collectDiagnostics() {
  const requiredEnv = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'ENCRYPTION_KEY'];
  const env = requiredEnv.map((name) => ({ name, present: Boolean(process.env[name]) }));

  let db = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = true;
  } catch {
    db = false;
  }

  const routes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/onboarding',
    '/settings',
    '/settings/diagnostics',
    '/api/command-center',
    '/api/diagnostics',
    '/api/wiring-pack'
  ];

  return {
    env,
    db,
    routes,
    endpointSmoke: [
      { endpoint: '/api/diagnostics', method: 'GET' },
      { endpoint: '/api/command-center', method: 'POST' }
    ]
  };
}
