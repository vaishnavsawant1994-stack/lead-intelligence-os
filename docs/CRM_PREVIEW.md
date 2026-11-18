# Leadveyra private-preview CRM — operational readiness

The current preview includes PostgreSQL-backed **Dashboard, People, Companies, Pipeline, Tasks, and Deals**, using single-administrator access. These are small validated workflows, **not** complete multi-user SaaS capabilities.

## Database and account configuration

- Start with an isolated **empty disposable PostgreSQL** database, then apply the Prisma schema with `npx prisma db push` after confirming it is empty. Do not run `db push` against any existing production database without an approved migration and backup.
- Set `DATABASE_URL` and `DIRECT_URL` to the **same dedicated database** through the hosting provider's protected environment settings (pooled vs direct URLs as appropriate).
- Set the required preview credentials `APP_ADMIN_EMAIL`, `APP_ADMIN_PASSWORD` (unique, at least 16 characters), and `AUTH_SESSION_SECRET` (unique, at least 32 characters).
- Set `APP_PREVIEW_ORG_SLUG` to a unique lowercase slug, e.g. `leadveyra-preview`; `APP_PREVIEW_ORG_NAME` can be `Leadveyra Preview`.
- The app creates only the configured organization record if it does not exist, then always queries and mutates data scoped to that organization.
- Set `EMAIL_SENDING_ENABLED=false` and leave outbound provider keys unset. `/api/health` is publicly accessible **liveness only**. Sign in with the preview admin and request `/api/ready` for an authenticated PostgreSQL-workspace readiness check; it returns 503 if the workspace/database is unavailable.
- Never commit passwords, connection strings, personal data, real customer records or production secrets.

## What is now wired to the database

- Dashboard: real people, companies, deals and pending task counts.
- People: create, list/search, view, update status/details, delete.
- Companies: create, list, view, update, delete only when unlinked.
- Pipeline: groups people by status and persists status changes.
- Tasks: create, list, update completion, delete.
- Deals: create, list, update stage, delete.
- Workspace settings: persisted organization display name.
- Reports: organization-scoped lead stage totals, deal stage amounts and task completion totals.
- CRM audit: core mutations for People, Companies, Tasks, Deals and Organization Settings recorded in the same database transaction. An authenticated admin can view the last 100 events at `/audit`; records have action, entity type/id and preview administrator email. No contents, PII snapshots or immutable audit guarantees are claimed.
- Export: actual organization-scoped CSV downloads for people, companies, tasks and deals at `/export`; downloads require a signed administrator session, neutralize spreadsheet formula-like cells, and refuse exports larger than 5,000 rows (no silent truncation).
- Email pattern suggestions: explicit **unverified** candidates only for a domain supplied by the administrator. No fake confidence or mailbox verification.
- Search: refuses requests when no real SERPER provider key is configured (no fabricated search results).
- Draft suggestions: local templates, explicitly marked as **not AI-generated and not sent**.
- Bounce webhook and email open tracking: disabled until signed provider events, durable suppression, appropriate consent and auditable delivery are implemented.

The API validates inputs, requires a signed preview session and scopes reads/writes by `organizationId`. Existing source/appearance/activity models are present but broader modules are still demonstration screens. `/import` now explains that bulk ingestion and external Google Sheet imports are unavailable; the old buttons were nonfunctional placeholders.

## CI verification

GitHub Actions creates a short-lived PostgreSQL 16 service, validates Prisma, builds Next.js, applies `prisma db push` ONLY to the isolated test database, starts the app, and executes API smoke tests with synthetic data (including negative cross-organization read/write attempts, CSV exports, formula-injection protection, database readiness and disabled provider behavior). This does not test Hostinger itself.

## Audit limitation

Audit events are transactionally recorded only for the specified core CRM mutation paths. They are not an immutable enterprise ledger, and do **not** cover login, exports, provider actions, or the many demonstration routes. No retrospective/backfilled history exists. Database admins can still alter the records; production retention, actor/user identity and independent tamper protection are outstanding.

## Not yet public-production ready

This is a **single-admin preview** with basic authentication, not production-grade identity management. Before real customer use, implement multi-user roles and tenant authorization, persistent audit logging, privacy/consent controls, authentication throttling, migration history, backup/restore testing, email provider verification, and an end-to-end browser acceptance suite. Do not promote static AI/email/phone/integration pages as real services.

See [Hostinger runbook](HOSTINGER_DEPLOYMENT.md) and [deployment task #3](https://github.com/vaishnavsawant1994-stack/lead-intelligence-os/issues/3).
