import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

export const onboardingSchema = z.object({
  name: z.string().min(2),
  handle: z.string().min(2),
  openclawBaseUrl: z.string().url().optional().or(z.literal('')),
  openclawToken: z.string().min(8).optional().or(z.literal('')),
  workspacePath: z.string().optional(),
  mode: z.enum(['mock', 'real'])
});

export const commandSchema = z.object({
  command: z.enum([
    'health',
    'scan-repo',
    'index-md',
    'validate-routes',
    'run-tests',
    'generate-wiring-md'
  ]),
  payload: z.record(z.any()).optional().default({})
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  columnId: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  labels: z.array(z.string()).default([]),
  dueDate: z.string().optional(),
  assigneeType: z.enum(['ME', 'OPENCLAW_BOT']).default('ME')
});
