# PROJECT_CONTEXT — EduNexus Pro

> Generated: 2026-10-28 · Source: repo inspection (project-context skill) · Reused from `DEPLOY.md`, `CROSS-PROJECT-WORK-MAP.md`, memory

## Purpose
Commercial ed-tech training platform (courses, quizzes, practice arena, payments, certificates, internships, admin console). Public storefront + paid enrollment content + certificate issuance/verification. Live at `edunexus.kibm.in`.

## Architecture
React SPA (frontend container) → nginx TLS reverse proxy → Express API (backend container, port 5000) → Postgres + Redis, all via Docker Compose on a shared Hostinger VPS. Nginx serves the SPA at `/`, proxies `/api/` and (pending fix) `/static/` to the backend. Co-tenant containers also run on the same VPS.

## Stack
- Frontend: React 19, Vite 8, Tailwind 4
- Backend: Express 5, Prisma 6 (`@prisma/client ^6.4.1`)
- Database: PostgreSQL 15 (Docker volume), Redis 7
- Infra: Docker Compose (`docker-compose.yml`, `docker-compose.prod.yml`), nginx + Let's Encrypt

## Key Directories
- `backend/` — Express API, `backend/src/index.ts` (entry, `/health` route), `backend/public/` (static assets incl. `course-banners/`)
- `frontend/` — React SPA
- `nginx/edunexus.conf` — site config (TLS, `/api/`, `/static/`)
- `prisma/` — schema/seed (no `migrations/` directory locally)
- `docs/` — per-task reports (`taskN-*-report.md`)
- `scripts/deploy.sh` — backup → rsync → build → up → healthcheck
- `wrap_and_deploy.sh` — one-command deploy wrapper

## Key Scripts
| Script | What it does |
|--------|-------------|
| `wrap_and_deploy.sh` | deploy wrapper |
| `scripts/deploy.sh` | backup + build + docker compose up + healthcheck |
| `m049-prod-smoke.js` (repo root) | production smoke gate |

## Git
- Remote: `git@github.com:kunwaravi/edunexuspro.git`
- Local branch: `master` (HEAD `99c05ef`)
- Remote default branch: `master` (verified: `origin/master`, no `main`)

## Deployment
- Mechanism: rsync + Docker Compose via `wrap_and_deploy.sh` → `scripts/deploy.sh`
- Host: Hostinger VPS `srv1616850.hstgr.cloud` (`187.127.156.138`), root ssh
- Invariants: never overwrite `.env`; never wipe the DB volume; never disturb co-tenants (KIBM marketplace, Atlas, Openclaw); additive-only migrations

## Database & Migrations
- Production is migration-managed (per memory).
- Local repo has **no** `prisma/migrations/` directory; local dev DB `nexus` is **not** Prisma-managed — never run `prisma migrate deploy` locally; apply schema changes via psql.
- Paid content requires an `Enrollment` row — run `backfill_enrollments.ts` after deploy.

## Environment Assumptions
- Backend listens on `127.0.0.1:5000`; nginx proxies `/api/` to it.
- Env vars live in server `.env` files (names not recorded here).
- `DEPLOY.md` contains confidential SSH key / Hostinger token — **do not share; no values copied here**.

## Verification Mechanisms
- Playwright E2E harness (`m0XX-e2e/`, `m049-prod-smoke.js`)
- Per-task validation reports under `docs/`
- Manual health probes: `GET /api/courses`, SPA `GET /`

## Project-specific Invariants
- Never change remote default branch assumptions: it is `master`.
- Don't break co-tenant nginx sites or containers on the shared VPS.
- Certificate name (hardcoded switch) and catalog course title (DB) are independent.
