# Leadveyra — all 146 page routes: release evidence matrix

**Updated:** 21 November 2026 | **Baseline main:** `532160fd40c983478d2f84292401cc1c9a2dbe03` | **Branch:** `fix/leadveyra-full-route-audit-security-20261118`

**Scope:** Every page **path** was retrieved from the repository tree and classified conservatively using **known implementation and CI evidence**. This is NOT a manual in-browser or per-file functional certification of all 146 pages. Unqualified does not mean missing; it means there is not yet adequate evidence to call it working.

## Classification

- Explicitly unavailable on this branch: **14**
- Not yet end-to-end qualified: **112**
- DB-backed preview: **16**
- Limited/disabled preview utility: **4**

- **DB-backed preview:** Existing or new endpoints backed by scoped PostgreSQL records, with selective synthetic CI checks. This now includes a limited, transactional core CRM audit history for `/audit`. Still needs deployed browser acceptance, production RBAC and privacy approval.
- **Limited/disabled preview utility:** Admin login, scoped real CSV export, disabled bulk import and unverified email format suggestions.
- **Explicitly unavailable:** Known deceptive examples (fake MFA, integrations, consent, scoring, billing and others) replaced with truthful nonfunctional messages in the current branch. The underlying features remain to be developed.
- **Not yet end-to-end qualified:** UI route is present, but tested server-side persistence and complete E2E behavior have not been established. Do not treat simulated buttons, local-only states or sample data as real.

## Inventory

| Route | Qualification |
|---|---|
| `/2fa` | Explicitly unavailable on this branch |
| `/ab-testing` | Not yet end-to-end qualified |
| `/activity-goals` | Not yet end-to-end qualified |
| `/activity` | Not yet end-to-end qualified |
| `/agent-settings` | Not yet end-to-end qualified |
| `/ai-insights` | Not yet end-to-end qualified |
| `/ai-reply` | Not yet end-to-end qualified |
| `/ai-schedule` | Not yet end-to-end qualified |
| `/ai-scoring` | Explicitly unavailable on this branch |
| `/ai` | Not yet end-to-end qualified |
| `/alerts` | Not yet end-to-end qualified |
| `/analytics` | DB-backed preview (CRM counts only; no marketing attribution) |
| `/api-docs` | Not yet end-to-end qualified |
| `/api-keys` | Explicitly unavailable on this branch |
| `/assignments` | Not yet end-to-end qualified |
| `/audit` | DB-backed preview |
| `/automation` | DB-backed preview (person-created internal task rules only; no scheduler or external action) |
| `/battle-cards` | Not yet end-to-end qualified |
| `/billing` | Explicitly unavailable on this branch |
| `/bookmarks` | Not yet end-to-end qualified |
| `/bounces` | Not yet end-to-end qualified |
| `/bulk` | Not yet end-to-end qualified |
| `/calendar` | Not yet end-to-end qualified |
| `/call-history` | Not yet end-to-end qualified |
| `/changelog` | Not yet end-to-end qualified |
| `/chat-team` | Not yet end-to-end qualified |
| `/chat` | Not yet end-to-end qualified |
| `/cleanup` | Not yet end-to-end qualified |
| `/comments` | Not yet end-to-end qualified |
| `/committee` | Not yet end-to-end qualified |
| `/companies/[id]` | DB-backed preview |
| `/companies` | DB-backed preview |
| `/conditional-sequences` | Not yet end-to-end qualified |
| `/consent` | DB-backed preview (do-not-contact only; no affirmative consent) |
| `/crm` | Explicitly unavailable on this branch |
| `/custom-dashboard` | Not yet end-to-end qualified |
| `/custom-fields` | Not yet end-to-end qualified |
| `/deal-aging` | Not yet end-to-end qualified |
| `/deal-health` | Not yet end-to-end qualified |
| `/deal-rooms` | Not yet end-to-end qualified |
| `/deals` | DB-backed preview |
| `/digest` | Not yet end-to-end qualified |
| `/duplicates` | Not yet end-to-end qualified |
| `/dynamic-fields` | Not yet end-to-end qualified |
| `/email-finder` | Limited/disabled preview utility |
| `/email-tracking` | Not yet end-to-end qualified |
| `/email` | Not yet end-to-end qualified |
| `/engagement` | Not yet end-to-end qualified |
| `/export-templates` | Not yet end-to-end qualified |
| `/export` | Limited/disabled preview utility |
| `/extension` | Not yet end-to-end qualified |
| `/favorites` | Not yet end-to-end qualified |
| `/fields` | Not yet end-to-end qualified |
| `/files` | Not yet end-to-end qualified |
| `/forecast` | Explicitly unavailable on this branch |
| `/forms` | Not yet end-to-end qualified |
| `/funnel` | Not yet end-to-end qualified |
| `/gdpr` | Explicitly unavailable on this branch |
| `/goals` | Not yet end-to-end qualified |
| `/groups` | Not yet end-to-end qualified |
| `/heatmap` | Not yet end-to-end qualified |
| `/help` | Not yet end-to-end qualified |
| `/hierarchy` | Not yet end-to-end qualified |
| `/hot-leads` | Not yet end-to-end qualified |
| `/import-history` | Not yet end-to-end qualified |
| `/import` | Limited/disabled preview utility |
| `/inbox` | Explicitly unavailable on this branch |
| `/integrations` | Explicitly unavailable on this branch |
| `/invitations` | Not yet end-to-end qualified |
| `/leaderboard` | Not yet end-to-end qualified |
| `/link-tracking` | Not yet end-to-end qualified |
| `/login` | Limited/disabled preview utility |
| `/loss-reasons` | Not yet end-to-end qualified |
| `/meeting-notes` | Not yet end-to-end qualified |
| `/meetings` | Explicitly unavailable on this branch |
| `/metrics` | Not yet end-to-end qualified |
| `/news` | Not yet end-to-end qualified |
| `/next-steps` | Not yet end-to-end qualified |
| `/note-templates` | Not yet end-to-end qualified |
| `/notification-settings` | Not yet end-to-end qualified |
| `/notifications` | Not yet end-to-end qualified |
| `/objections` | Not yet end-to-end qualified |
| `/` | DB-backed preview |
| `/people/[id]` | DB-backed preview |
| `/people` | DB-backed preview |
| `/phone-finder` | Explicitly unavailable on this branch |
| `/pinned` | Not yet end-to-end qualified |
| `/pipeline` | DB-backed preview |
| `/playbooks` | Not yet end-to-end qualified |
| `/portal` | Not yet end-to-end qualified |
| `/predictive` | Not yet end-to-end qualified |
| `/quick-add` | Not yet end-to-end qualified |
| `/quota` | Not yet end-to-end qualified |
| `/quotes` | Not yet end-to-end qualified |
| `/recent` | Not yet end-to-end qualified |
| `/recommendations` | Not yet end-to-end qualified |
| `/referrals` | Not yet end-to-end qualified |
| `/relationship` | Not yet end-to-end qualified |
| `/reminders` | Not yet end-to-end qualified |
| `/rep-performance` | Not yet end-to-end qualified |
| `/reports` | DB-backed preview |
| `/research` | DB-backed preview (manual appearances only; no crawling or verification) |
| `/roi-calculator` | Not yet end-to-end qualified |
| `/roles-contact` | Not yet end-to-end qualified |
| `/roles` | Explicitly unavailable on this branch |
| `/routing` | Not yet end-to-end qualified |
| `/sales-cycle` | Not yet end-to-end qualified |
| `/saved-searches` | Not yet end-to-end qualified |
| `/schedule-email` | Not yet end-to-end qualified |
| `/scheduled-reports` | Not yet end-to-end qualified |
| `/scheduler` | Not yet end-to-end qualified |
| `/scoring` | Not yet end-to-end qualified |
| `/scripts` | Not yet end-to-end qualified |
| `/segments` | Explicitly unavailable on this branch |
| `/sentiment` | Not yet end-to-end qualified |
| `/sequences` | Not yet end-to-end qualified |
| `/sessions` | Not yet end-to-end qualified |
| `/settings` | DB-backed preview |
| `/shortcuts` | Not yet end-to-end qualified |
| `/signatures` | Not yet end-to-end qualified |
| `/slack` | Not yet end-to-end qualified |
| `/smart-reminders` | Not yet end-to-end qualified |
| `/sms` | Not yet end-to-end qualified |
| `/source-roi` | Not yet end-to-end qualified |
| `/sources` | DB-backed preview (source catalog only; not verified research) |
| `/stages` | Not yet end-to-end qualified |
| `/tags` | Not yet end-to-end qualified |
| `/task-templates` | Not yet end-to-end qualified |
| `/tasks` | DB-backed preview |
| `/templates-library` | Not yet end-to-end qualified |
| `/templates` | Not yet end-to-end qualified |
| `/territories` | Not yet end-to-end qualified |
| `/timeline` | Not yet end-to-end qualified |
| `/today` | Not yet end-to-end qualified |
| `/unsubscribe` | Not yet end-to-end qualified |
| `/usage` | Not yet end-to-end qualified |
| `/verify` | Not yet end-to-end qualified |
| `/views` | Not yet end-to-end qualified |
| `/voice-call` | Not yet end-to-end qualified |
| `/webhooks` | Explicitly unavailable on this branch |
| `/weighted` | Not yet end-to-end qualified |
| `/white-label` | Not yet end-to-end qualified |
| `/win-loss` | Not yet end-to-end qualified |
| `/win-reasons` | Not yet end-to-end qualified |
| `/workflows` | Not yet end-to-end qualified |
| `/zapier` | Not yet end-to-end qualified |

## Production blockers

1. Hostinger hPanel browser connection unavailable in this ChatGPT environment; account, plan, site/runtime, DNS and SSL not inspected.
2. No Leadveyra-dedicated remote PostgreSQL provisioned or migrations/deployment applied; **no public site deployment is verified**.
3. Current authentication is one signed preview admin cookie, **not** full user accounts, server-enforced roles, MFA, revocation or robust login protection.
4. Real consent, privacy requests, audit trail, opt-out suppression, mail/call provider integrations, automation reliability and independent security review remain incomplete.
5. Most routes still require functional, API, security, mobile browser and failure-path acceptance tests.
6. Migration history, backup/restore, monitoring and rollback evidence must be recorded before production launch.

**Release decision:** PRIVATE ADMIN PREVIEW CODE ONLY. Do not accept real customer/lead data yet. The GitHub CI runner's ephemeral PostgreSQL tests are not evidence of production deployment.
