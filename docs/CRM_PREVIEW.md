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

## 18 November UI functionality update — pagination and edit controls

All four main CRM lists now return a validated `pagination` object with exact organization-scoped total counts, numbered pages and size limits (default 25, maximum 100). People and Deals have stage filters, Tasks has a completion-state filter, and all four support case-insensitive name/title search. Invalid page inputs fail with HTTP 400 rather than silently truncating. Task title/due-date editing and Deal name/value/stage editing are now exposed through real PATCH APIs. No schema migration is required for this iteration.

CI must verify pages beyond the first 25 records, search/filter validation, tenant boundaries and real browser edit submissions. This does **not** add production RBAC, migration history or external provider integrations.

## Contact data integrity and editing

New contact email values are normalized to lowercase, with a database-level `@@unique([organizationId, email])` constraint. Multiple contacts **without** an email remain permitted. Duplicate contact email creates/updates within the same workspace return HTTP **409**, including case variants created through the application. Identical email addresses in separate organizations are permitted.

Person detail now supports changing the contact's name and linked company using a searchable company selector (the company API searches across the organization, with bounded result pages). It continues to support status, title, email, phone and notes changes.

**Migration warning:** This is a Prisma schema change, not an approved production migration. The CI runner applies `prisma db push` only to an empty disposable PostgreSQL database. Before applying to any existing database, back it up and identify contacts with duplicate case-folded email per organization; reconcile them through an audited procedure and review a real migration. Do not silently delete or merge records. Previously stored mixed-case emails are not retroactively normalized by this code.

## Do-not-contact/suppression foundation — 18 November 2026

The former mock consent page is now a **real signed-administrator, organization-scoped do-not-contact register** at `/consent`. The `/api/suppressions` POST validates and lowercases email addresses, accepts a restricted set of explicit negative-contact reasons, and records an append-only suppression entry plus an audit event in the **same** PostgreSQL transaction. GET supports bounded pagination and email/reason filtering and never reads another organization's records. Duplicate entries return **409** rather than silently overriding an earlier contact restriction. Suppression removal is unavailable in the preview.

**Crucial boundary:** This is a record of an internal reported restriction, **not proof of affirmative consent**, a compliant consent collection mechanism, or provider webhook enforcement. Outbound email has been **hard-disabled regardless of `EMAIL_SENDING_ENABLED`**, even when a provider key exists, until production identity/RBAC, signed provider events, suppression enforcement and lawful-basis review are certified. Do not collect real contact data or enable sending based on this page.

The new `SuppressionEntry` table requires a reviewed database migration and backup for any existing environment; CI `prisma db push` remains restricted to disposable PostgreSQL. Testing includes unauthorized/foreign-organization access, duplicate normalization, cross-origin POST denial, audit entry persistence and Chromium form interactions.

## Research sources catalog — 18 November 2026

The former mock source-performance screen is now a real administrator-managed **source catalog** at `/sources`. Organization-scoped PostgreSQL APIs support create, search/filter/paginate, read, edit and delete unlinked source records. Linked appearance records block source deletion with HTTP 409. Actions are transactionally audited. The server accepts only valid http(s) source URLs without embedded credentials and denies cross-organization reads or mutations.

**Scope limitation:** These are administrator-entered references. There is no web crawling, AI research, verification of the URL contents or publication rights, lead enrichment, marketing attribution or source-performance calculation. Passing browser/API tests does not certify an external research provider. No database schema change was required for this catalog because the Source model already existed.

## Scoped CRM analytics — 18 November 2026

`/analytics` and `/api/analytics` now compute real scoped PostgreSQL totals for People, Companies, Deals, Sources and Tasks, along with newly-created records in a selected **7/30/90-day window**. They report actual People statuses, Deal stages/entered amounts, Source types and current task completion state. The reporting window only applies to **new-record counts**; stage/status distributions are current, all-time values. The server denies unrecognized reporting periods and unauthorized requests. Synthetic PostgreSQL and Chromium selection tests are included.

**Scope boundary:** Deal amounts have no configured currency and are not recognized revenue. No marketing attribution, email provider events, AI prospect scores, forecasting, website visits, conversion rates or external enrichment are calculated. This feature is a private-preview CRM reporting foundation, not complete marketing intelligence.

## Event-driven internal task automation — 21 November 2026

`/automation` now provides administrator-managed rules that trigger **only when a new Person is created through the Leadveyra API**. An enabled rule creates a local CRM Task, records an `AutomationRun` with the Person/Task IDs, and writes task/run audit entries in the **same PostgreSQL transaction** as the new Person. A failed transaction creates neither the Person nor a partial task/run. The `[ruleId, personId]` unique index prevents duplicate rule execution for the same created Person. Rules are capped at 10 per private-preview organization.

The UI supports creating rules, editing their display/template fields, pausing/enabling them and deleting unused rules. Executed rules retain history and can be paused, **not erased**. Only `{name}` replacement in task title templates is supported; no external dynamic expressions are evaluated.

**This is limited internal event automation, not a general workflow engine:** no scheduled triggers, automatic web research, provider connections, email/SMS outreach, background queues, retry/delivery workflows, multi-user task assignments or notifications. Tests use synthetic records only. The new Prisma `AutomationRule` and `AutomationRun` tables require a reviewed migration and backup on any non-disposable database; CI uses ephemeral PostgreSQL only.
