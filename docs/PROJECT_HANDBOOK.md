# Lead Intelligence OS — CRM SaaS Foundation — Complete Project Guide

**Repository:** `vaishnavsawant1994-stack/lead-intelligence-os` · **Review:** 15 November 2026  
**Evidence level:** current README, repository layout and manifest where available; no fresh deployed-end-to-end certification.

## Product identity and problem
Lead prospecting, research and client data operations platform with a broad planned sales and marketing UI surface.

**Primary users:** Sales teams, researchers and SaaS developers.

## Functional areas and intended user journeys
1. Lead/person and company views.
2. Pipeline, tasks, deals, reports, segments and source appearances.
3. Many additional AI, communications, forecasting and automation route directories.
4. Prisma structured-data model and CSV import/export foundations.

Features above describe documented capability areas, source/UI surfaces or product intents. A listed module is not necessarily a functioning integrated feature.

## System design and codebase
Next.js 16/React 19/TypeScript; `src/app/` contains over a hundred route folders, `prisma/schema.prisma`, `src/components/` and middleware. Presence of routes does not prove end-to-end functionality.

## Implementation status
Not production-ready. Current middleware passes requests through without enforcing authenticated authorization; connected real metrics, persistence and tenant isolation are not independently qualified.

**Do not conflate:** planned scope, code existence, passing old CI, live production deployment and independent release acceptance. They require separate evidence.

## Development and testing
`npm install`, `npx prisma generate`, configure disposable `DATABASE_URL`, then cautiously use `npm run db:push` only for test DB, `npm run dev`; build/lint via package scripts.

Before using any environment: examine .env examples and source code, use test accounts, protect secrets, and inspect the target database prior to migrations/seed commands.

## Data security, privacy and operations
- Enforce all user/organization scopes server-side.
- Do not ingest personal lead/contact data without data-basis, retention and access controls.
- Never claim live AI, email or telephony integration based only on pages.
Additionally validate backup/restore, audit logs, staging isolation, access reviews, monitoring and release rollback before production use.

## Priority development plan
1. Inventory every route as working/partial/static/missing.
2. Implement secure authentication/authorization and negative tenant tests.
3. Wire representative workflows to durable records.
4. Qualify imports/exports and report calculations.

## Where to read more
- [`README.md`](../README.md)
- [`COMPLETE_SETUP.md`](../COMPLETE_SETUP.md)
- [`DATABASE_SETUP.md`](../DATABASE_SETUP.md)
- [`package.json`](../package.json)
- [`prisma/schema.prisma`](../prisma/schema.prisma)

This guide should be revised after verified code, architecture, data schema, deployment or product-scope changes. The underlying source and gated engineering documents remain authoritative.
