# Lead Intelligence OS

Lead intelligence and sales-workflow SaaS **under development**, built with Next.js, React, TypeScript and Prisma. This README describes the source in this repository, not a certified production service.

## What is present in source

- App Router pages for dashboard, people, companies, pipeline, tasks, deals, analytics, imports/exports, communications and settings.
- A broad set of additional AI, marketing, sales, reporting and integration page directories. **A route or screen existing does not mean its end-to-end workflow is implemented.**
- Prisma schema for structured records including organizations, users, people, companies and activities.
- Local setup scripts for development and database schema sync, plus a GitHub Actions build and private-preview authentication smoke test.
- UI foundations for sign-in, team administration, and lead operations.

## Authentication, data and maturity

**Not production-ready or multi-tenant security-qualified.** As of 17 November 2026, the middleware protects application pages and APIs using an environment-configured **single-administrator private-preview gate** with an HttpOnly signed session cookie. Invalid credentials are rejected and the gate fails closed if configuration is missing. This is **not** multi-user sign-in, organization-based authorization, rate-limited authentication or certified production access. Outbound email is off by default. Many UI pages still show demonstration records, not durable CRM data.

Before handling real lead or customer records: implement and test server-side authentication/authorization, organization boundaries, reliable persistence, audit logging, privacy controls, provider access and backup/restore. Complete a route-by-route functional audit and exact-commit verification. External email/calling/AI workflows must remain unconfigured until approved and tested.

## Local development

Requires a suitable Node.js environment and a disposable database configured through environment variables (consult `DATABASE_SETUP.md`, `NEON_SETUP.md`, and `COMPLETE_SETUP.md`).

```bash
npm install
npx prisma generate
# Set DATABASE_URL to an isolated local/test database before the next step.
npx prisma db push
npm run dev
```

Open http://localhost:3000. Do not run schema sync or seed commands against production data without an approved migration/backup plan.

## Next engineering priorities

1. Inventory routes and classify each as verified working, partial, preview-only, or missing.
2. Implement authenticated, server-enforced tenant boundaries with negative tests.
3. Connect representative journeys to persistent data and document API contracts.
4. Test imports/exports, messaging/provider integrations and workflow failure paths using synthetic records.
5. Record reproducible test, security and deployment evidence before any production claim.

Repository status updated: 17 November 2026. GitHub build and preview smoke checks passed on the main-branch deployment-preparation commit. Hostinger hosting, DNS, TLS and live behavior are not yet verified.

## Hostinger deployment preparation

The [Hostinger deployment runbook](docs/HOSTINGER_DEPLOYMENT.md) covers the supported Node.js Web App setup, PostgreSQL variables, preview access credentials, DNS, SSL and release verification. Do not deploy public customer data until proper user/tenant authorization and the security gates are complete.

## Detailed project documentation

The [**Project Handbook**](docs/PROJECT_HANDBOOK.md) explains this repository individually: product objectives, user journeys, code and technology, current implementation scope, risks, local development, quality gates, and the next engineering milestones. Statements about planned features do not imply release acceptance.
