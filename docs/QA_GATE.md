# Leadveyra — current QA gate

The application includes **145 page route definitions** but not 145 qualified product workflows. GitHub CI now performs two separate kinds of checks:

1. `scripts/smoke-crm.mjs` exercises signed-session CRUD, negative cross-organization access, real global lookup, CSV, reporting and core audit records with a disposable PostgreSQL database.
2. `scripts/smoke-pages.mjs` discovers all non-dynamic `src/app/**/page.tsx` routes and fetches each under an authenticated preview session. It flags non-200 responses and missing HTML. It **does not** simulate clicking buttons, test client hydration, measure pixels or prove the business feature works. Dynamic People and Companies detail pages are rendered in CRM smoke using created test records.

## Shared UI fixes

- Global header search queries real, scoped People and Companies records; no fabricated contact or `/people/1` link.
- Desktop sidebar, keyboard command palette and mobile menu share the same navigation registry, including CSV export, audit and Settings.
- Mobile now has a complete accessible menu and sign-out action. The previous three-link-only mobile footer is removed.
- The previous dark-mode toggle was removed from the shell because it did not restyle the whole app. A future dark mode requires full light/dark per-route visual regression acceptance before it can be offered.

## Still required for full release

- Automated **real-browser** interactions across desktop/tablet/mobile and verified screenshot artifacts, plus visual acceptance against approved design reference images. Server-side HTTP tests cannot provide pixel-by-pixel evidence.
- Multi-user authentication, roles/RBAC, privacy, consent, provider integrations, durable migrations, backups/restore, monitoring and real customer acceptance.
- Authenticated Hostinger hPanel access, a dedicated remote PostgreSQL DB and DNS/SSL. No live deployment or domain acceptance has been completed.

See `docs/ROUTE_QUALIFICATION_MATRIX.md` for the conservative release inventory.

## Negative-contact protection — 18 November 2026

The do-not-contact screen has real preview PostgreSQL persistence, server-side authorization, organization scoping and audit records, with browser create/duplicate tests. It must **not** be interpreted as verified consent or outreach authorization. Email sending is deliberately fail-closed in code, independent of a deployment flag.

Remaining blockers include a durable consent-evidence workflow, signed provider events, suppression enforcement inside a production mail queue, data-subject identity verification and production audit retention. There is **no** proof of full compliance or real-customer readiness.
