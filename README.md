# Lead Intelligence OS

Lead intelligence and sales-workflow SaaS **under development**, built with Next.js, React, TypeScript and Prisma. This README describes the source in this repository, not a certified production service.

## What is present in source

- App Router pages for dashboard, people, companies, pipeline, tasks, deals, analytics, imports/exports, communications and settings.
- A broad set of additional AI, marketing, sales, reporting and integration page directories. **A route or screen existing does not mean its end-to-end workflow is implemented.**
- Prisma schema for organizations, users, people, companies, pipeline records, tasks, deals and activities.
- PostgreSQL-backed Dashboard, People, Companies, Pipeline, Tasks and Deals private-preview workflows.
- GitHub Actions build, production dependency audit, and PostgreSQL-backed CRUD/tenant-boundary smoke tests.
- UI foundations for sign-in, team administration, and lead operations.

## Authentication, data and maturity

**Not production-ready or multi-tenant security-qualified.** As of 18 November 2026, middleware protects pages and APIs with an environment-configured **single-administrator private-preview gate** using signed HttpOnly session cookies. Invalid credentials are rejected and the gate fails closed without configuration. The six core CRM screens above use a configured PostgreSQL organization scope, tested with isolated synthetic CI data. **This is not** production-grade multi-user login, RBAC, authentication throttling, or certification. Outbound email is off by default; most other app routes remain demonstrations.

Before handling real lead or customer records: implement and test server-side authentication/authorization, organization boundaries, reliable persistence, audit logging, privacy controls, provider access and backup/restore. Complete a route-by-route functional audit and exact-commit verification. External email/calling/AI workflows must remain unconfigured until approved and tested.

## Local development

Requires a suitable Node.js environment and a disposable database configured through environment variables (consult `DATABASE_SETUP.md`, `NEON_SETUP.md`, and `COMPLETE_SETUP.md`).

```bash
npm ci
npx prisma generate
# Set DATABASE_URL and DIRECT_URL to a new isolated empty test database.
# Set APP_ADMIN_EMAIL, APP_ADMIN_PASSWORD, AUTH_SESSION_SECRET and APP_PREVIEW_ORG_SLUG.
# Never apply db push to an existing production DB without migration review and backup.
npx prisma db push
npm run dev
```

Open http://localhost:3000. Do not run schema sync or seed commands against production data without an approved migration/backup plan.

## Next engineering priorities

1. Verify Hostinger hosting entitlement, provision a dedicated database, set protected credentials and deploy a **private preview**.
2. Inventory remaining demo routes and complete their real end-to-end data and provider workflows.
3. Replace the administrator preview gate with production user identity, RBAC, tenant permissions, audit logs and authentication abuse protections.
4. Test imports/exports, consent, outreach safety, privacy controls, backups and provider failure paths using synthetic records.
5. Record independent security, performance, browser and production deployment acceptance before handling customer data.

Repository status updated: 18 November 2026. GitHub now runs isolated PostgreSQL integration tests for the core CRM preview. Passing CI does not establish Hostinger, DNS, TLS or live production acceptance.

## Hostinger deployment preparation

The [Hostinger deployment runbook](docs/HOSTINGER_DEPLOYMENT.md) covers the supported Node.js Web App setup, PostgreSQL variables, preview access credentials, DNS, SSL and release verification. Do not deploy public customer data until proper user/tenant authorization and the security gates are complete.

## Database-backed CRM preview

See [CRM preview operational guide](docs/CRM_PREVIEW.md) for the implemented modules, isolated test setup and mandatory environment variables. It is **not** a certified production SaaS.

## Detailed project documentation

The [**Project Handbook**](docs/PROJECT_HANDBOOK.md) explains this repository individually: product objectives, user journeys, code and technology, current implementation scope, risks, local development, quality gates, and the next engineering milestones. Statements about planned features do not imply release acceptance.
