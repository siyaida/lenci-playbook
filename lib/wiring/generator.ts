import JSZip from 'jszip';

type WiringInput = {
  routes: string[];
  envVars: string[];
  schemasSummary: string;
  commandsSummary: string;
};

export function buildWiringPack({ routes, envVars, schemasSummary, commandsSummary }: WiringInput) {
  const files = {
    'README.md': `# OpenClaw Wiring Pack\n\n## Environment Variables\n${envVars.map((v) => `- ${v}`).join('\n')}\n\n## Runbook\n1. Configure onboarding.\n2. Validate diagnostics.\n3. Execute command center actions.`,
    'ROUTES.md': `# Routes\n${routes.map((route) => `- ${route}`).join('\n')}`,
    'COMMANDS.md': `# Commands\n${commandsSummary}`,
    'SCHEMAS.md': `# Schemas\n${schemasSummary}`,
    'TESTING.md': '# Testing\nRun `npm run test:unit` and `npm run test:smoke`.',
    'INTEGRATION.md': '# Integration Contract\nAll OpenClaw commands are sent through `/api/command-center` with auth required and optional Bearer token to OpenClaw upstream.'
  };

  return files;
}

export async function zipWiringPack(files: Record<string, string>) {
  const zip = new JSZip();
  Object.entries(files).forEach(([name, content]) => zip.file(name, content));
  return zip.generateAsync({ type: 'nodebuffer' });
}
