# OpenClaw Command Center

Production-ready full-stack Kanban command center built with Next.js, Prisma, PostgreSQL, and Auth.js.

## Features
- Credentials auth + optional GitHub OAuth
- Forced onboarding to configure user identity + OpenClaw connection
- Kanban board (boards/columns/tasks) with drag-and-drop move
- Command Center panel with deterministic mock commands and OpenClaw client seam
- Wiring Pack generator (DB persistence + ZIP export)
- Diagnostics self-audit: routes, env vars, DB health, endpoint smoke map
- Rate limiting for auth + command endpoints

## Stack
- Next.js 14 (App Router) + TypeScript + TailwindCSS
- Prisma + PostgreSQL
- NextAuth (Auth.js)
- Zod validation
- Playwright smoke tests + Vitest unit tests
- Docker + docker-compose local DB
- GitHub Actions CI + Vercel-ready

## Local setup
1. Copy env:
   - PowerShell: `Copy-Item .env.example .env`
   - Bash: `cp .env.example .env`
2. Install dependencies: `npm install`
3. Start Postgres: `npm run db:up`
4. Run migrations (dev): `npm run db:migrate:dev`
5. Seed sample data: `npm run db:seed`
6. Start app: `npm run dev`
7. Login: `admin@example.com` / `password123`

### One-command dev flow (after env exists)
```powershell
npm install; npm run db:up; npm run db:migrate:dev; npm run db:seed; npm run dev
```

## Environment variables
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `ENCRYPTION_KEY` (server-only encryption key for OpenClaw token)
- Optional: `GITHUB_ID`, `GITHUB_SECRET`
- Optional: `OPENCLAW_DEFAULT_MODE=mock|real`

## Deployment (Vercel recommended)
1. Push repo to GitHub.
2. Import project in Vercel.
3. Set env vars (`DATABASE_URL`, `NEXTAUTH_SECRET`, `ENCRYPTION_KEY`, optional GitHub vars).
4. Ensure PostgreSQL is reachable from Vercel (Neon/Supabase/RDS/etc).
5. Run Prisma migrations in CI/CD or predeploy (`npx prisma migrate deploy`).
6. Deploy.

## Docker single-container runtime (optional)
Build and run web image:
```bash
docker build -t openclaw-command-center .
docker run -p 3000:3000 --env-file .env openclaw-command-center
```

## Scripts
- `npm run dev` - local development
- `npm run build` / `npm run start` - production build/runtime
- `npm run lint`
- `npm run test:unit`
- `npm run test:smoke`
- `npm run db:up` / `npm run db:down`
- `npm run db:migrate:dev` / `npm run db:migrate`
- `npm run db:seed`

## Troubleshooting
- **Prisma connection issues**: verify `DATABASE_URL` and that `docker compose ps` shows DB healthy.
- **Auth login fails**: verify seeded credentials and `NEXTAUTH_SECRET` is set.
- **OpenClaw real mode fails**: ensure onboarding base URL/token are valid and reachable.
- **Rate limit 429**: wait for window reset (60s default) or tune server limits.
