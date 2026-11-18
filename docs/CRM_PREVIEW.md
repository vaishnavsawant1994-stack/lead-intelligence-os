# Leadveyra private-preview CRM — operational readiness

The current preview includes PostgreSQL-backed **Dashboard, People, Companies, Pipeline, Tasks, and Deals**, using single-administrator access. These are small validated workflows, **not** complete multi-user SaaS capabilities.

## Database and account configuration

- Start with an isolated **empty disposable PostgreSQL** database, then apply the Prisma schema with `npx prisma db push` after confirming it is empty. Do not run `db push` against any existing production database without an approved migration and backup.
- Set `DATABASE_URL` and `DIRECT_URL` to the **same dedicated database** through the hosting provider's protected environment settings (pooled vs direct URLs as appropriate).
- Set the required preview credentials `APP_ADMIN_EMAIL`, `APP_ADMIN_PASSWORD` (unique, at least 16 characters), and `AUTH_SESSION_SECRET` (unique, at least 32 characters).
- Set `APP_PREVIEW_ORG_SLUG` to a unique lowercase slug, e.g. `leadveyra-preview`; `APP_PREVIEW_ORG_NAME` can be `Leadveyra Preview`.
- The app creates only the configured organization record if it does not exist, then always queries and mutates data scoped to that organization.
- Set `EMAIL_SENDING_ENABLED=false` and leave outbound provider keys unset. `/api/health` verifies liveness only, **not** database readiness.
- Never commit passwords, connection strings, personal data, real customer records or production secrets.

## What is now wired to the database

- Dashboard: real people, companies, deals and pending task counts.
- People: create, list/search, view, update status/details, delete.
- Companies: create, list, view, update, delete only when unlinked.
- Pipeline: groups people by status and persists status changes.
- Tasks: create, list, update completion, delete.
- Deals: create, list, update stage, delete.

The API validates inputs, requires a signed preview session and scopes reads/writes by `organizationId`. Existing source/appearance/activity models are present but broader modules are still demonstration screens.

## CI verification

GitHub Actions creates a short-lived PostgreSQL 16 service, validates Prisma, builds Next.js, applies `prisma db push` ONLY to the isolated test database, starts the app, and executes API smoke tests with synthetic data (including negative cross-organization read/write attempts). This does not test Hostinger itself.

## Not yet public-production ready

This is a **single-admin preview** with basic authentication, not production-grade identity management. Before real customer use, implement multi-user roles and tenant authorization, persistent audit logging, privacy/consent controls, authentication throttling, migration history, backup/restore testing, email provider verification, and an end-to-end browser acceptance suite. Do not promote static AI/email/phone/integration pages as real services.

See [Hostinger runbook](HOSTINGER_DEPLOYMENT.md) and [deployment task #3](https://github.com/vaishnavsawant1994-stack/lead-intelligence-os/issues/3).
