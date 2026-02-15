import { decrypt } from '@/lib/security/crypto';
import { prisma } from '@/lib/db/prisma';

type CommandResult = { ok: boolean; message: string; data?: Record<string, unknown> };

export class OpenClawClient {
  constructor(private workspaceId: string) {}

  private async getConfig() {
    return prisma.openClawConfig.findUnique({ where: { workspaceId: this.workspaceId } });
  }

  private async mode() {
    const config = await this.getConfig();
    return config?.mode ?? (process.env.OPENCLAW_DEFAULT_MODE === 'real' ? 'real' : 'mock');
  }

  private deterministicResponse(action: string, payload?: Record<string, unknown>): CommandResult {
    return {
      ok: true,
      message: `[mock] ${action} completed`,
      data: {
        action,
        payload: payload ?? {},
        timestamp: '2025-01-01T00:00:00.000Z',
        summary: `Deterministic mock execution for ${action}`
      }
    };
  }

  async health() {
    const mode = await this.mode();
    if (mode === 'mock') return this.deterministicResponse('health');
    const config = await this.getConfig();
    if (!config?.tokenEncrypted || !config.baseUrl) return this.deterministicResponse('health-fallback');
    const token = decrypt(config.tokenEncrypted);
    const response = await fetch(`${config.baseUrl}/health`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    return { ok: response.ok, message: response.ok ? 'OpenClaw reachable' : 'OpenClaw unavailable' };
  }

  async scanRepo(params: Record<string, unknown>) { return this.deterministicResponse('scanRepo', params); }
  async indexMd(params: Record<string, unknown>) { return this.deterministicResponse('indexMd', params); }
  async validateRoutes(params: Record<string, unknown>) { return this.deterministicResponse('validateRoutes', params); }
  async runTests(params: Record<string, unknown>) { return this.deterministicResponse('runTests', params); }
  async generateWiringMd(params: Record<string, unknown>) { return this.deterministicResponse('generateWiringMd', params); }
}
