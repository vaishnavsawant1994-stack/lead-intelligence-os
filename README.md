# Lead Intelligence OS

Lead intelligence and sales-workflow SaaS **under development**, built with Next.js, React, TypeScript and Prisma. This README describes the source in this repository, not a certified production service.

## What is present in source

- App Router pages for dashboard, people, companies, pipeline, tasks, deals, analytics, imports/exports, communications and settings.
- A broad set of additional AI, marketing, sales, reporting and integration page directories. **A route or screen existing does not mean its end-to-end workflow is implemented.**
- Prisma schema for structured records including organizations, users, people, companies and activities.
- Local setup scripts for development, database schema sync and optional test/seed workflows.
- UI foundations for sign-in, team administration, and lead operations.

## Authentication, data and maturity

**Not production-ready or security-qualified.** The `src/middleware.ts` currently allows requests through without an authorization check. The previous README described the platform as a fully working local system and the dashboard as having real metrics; those statements were not established by this audit. A populated UI, demo record or Prisma schema is not sufficient proof of persistence, tenant isolation, correct analytics, provider integration or working authentication.

Before handling real lead or customer records: implement and test server-side authentication/authorization, organization boundaries, reliable persistence, audit logging, privacy controls, provider access and backup/restore. Complete a route-by-route functional audit and exact-commit verification. External email/calling/AI workflows must remain unconfigured until approved and tested.

## Local development

Requires a suitable Node.js environment and a disposable database configured through environment variables (consult `DATABASE_SETUP.md`, `NEON_SETUP.md`, and `COMPLETE_SETUP.md`).

```bash
npm install
npx prisma generate
# Set DATABASE_URL to an isolated local/test database before the next step.
npx prisma db push
# Optional, only if a seed script exists and you intend to insert sample data:
# npm run db:seed
npm run dev
```

Open http://localhost:3000. Do not run schema sync or seed commands against production data without an approved migration/backup plan.

## Next engineering priorities

1. Inventory routes and classify each as verified working, partial, preview-only, or missing.
2. Implement authenticated, server-enforced tenant boundaries with negative tests.
3. Connect representative journeys to persistent data and document API contracts.
4. Test imports/exports, messaging/provider integrations and workflow failure paths using synthetic records.
5. Record reproducible test, security and deployment evidence before any production claim.

Documentation audit: 14 November 2026. Application code and live environments were not changed by this README update.
