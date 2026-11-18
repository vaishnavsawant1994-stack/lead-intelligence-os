# Leadveyra — Hostinger deployment runbook

Status: deployment preparation only. Do not claim a public production release without verified authentication, authorization, functional and security tests. This branch implements only a **single-administrator private preview gate**, not per-user or per-organization authorization.

## Hostinger prerequisites
- A plan supporting **Node.js Web Apps** (Business/Unlimited or Cloud), not ordinary static webspace. Confirm the exact plan in hPanel.
- The Hostinger GitHub integration installed for `vaishnavsawant1994-stack/lead-intelligence-os`.
- Use a disposable **PostgreSQL** database for preview. The Prisma schema is PostgreSQL; a SQLite URL will not work.
- Confirm who controls `leadveyra.com` and its authoritative DNS before changing records.

## Import the application
1. Hostinger dashboard → Websites → Create site → Web App.
2. Set the domain to `leadveyra.com` or initially use a temporary Hostinger domain.
3. Import Git repository → connect GitHub → select `vaishnavsawant1994-stack/lead-intelligence-os`, branch `main` **only after** the build and security gates are accepted.
4. Choose the **Next.js Node.js preset** (server-rendered application), Node.js 22, install command `npm ci`, build command `npm run build`, output `.next` (review Hostinger's auto-detected preset settings).
5. Do not upload `.next` into `public_html` as a static website. Use the Node.js runtime/deployment system.

## Environment variables
Set these through Hostinger's protected environment settings (never commit values):
- `DATABASE_URL` = PostgreSQL connection string (pooled URL when applicable)
- `DIRECT_URL` = PostgreSQL direct connection string
- `APP_ADMIN_EMAIL` = administrator email for private preview
- `APP_ADMIN_PASSWORD` = unique random password, minimum 16 characters
- `AUTH_SESSION_SECRET` = unique random secret, minimum 32 characters
- `APP_PREVIEW_ORG_SLUG` = lowercase, unique workspace slug (required for CRM API, e.g. `leadveyra-preview`)
- `APP_PREVIEW_ORG_NAME` = display name (optional, e.g. `Leadveyra Preview`)
- `NEXTAUTH_URL` = `https://leadveyra.com` (reserved for later NextAuth implementation)
- `NEXTAUTH_SECRET` = unique random string (reserved, not currently used)
- `EMAIL_SENDING_ENABLED` = `false` until provider consent, authentication, rate controls, verification and auditing are complete

## Database
Prisma model changes are not covered by a managed migration history in this repo. Before touching any existing database: inspect it and back it up. For a new empty **test** PostgreSQL database only, run `npx prisma db push` from a trusted environment with `DATABASE_URL` and `DIRECT_URL` set. The database-backed CRM requires tables for Organization, Person, Company, Task and Deal; `APP_PREVIEW_ORG_SLUG` is required. The API creates the configured organization record on first authenticated request. Do not attempt `prisma db seed`: this repo has no `prisma/seed.ts`.

See [CRM preview](CRM_PREVIEW.md) for scope, validations and CI integration tests.

## DNS and TLS
After confirming the live Hostinger-provided destination and existing zone, set the apex record using the correct **actual** Hostinger A/ALIAS instructions and `www` as directed. Never invent an IP or overwrite MX, SPF, DKIM, DMARC or unrelated records. Enable and verify HTTPS/TLS and redirect HTTP to HTTPS.

## Release gates
1. GitHub build workflow passes on the intended exact commit; run browser UI and API smoke tests.
2. Confirm login fails closed without configuration, rejects invalid credentials and protects API routes without a valid session.
3. Verify the preview contains no real customer/lead data, outbound mail remains disabled, and no sensitive provider token is disclosed.
4. Test correct database isolation, backups and restore using synthetic data. Implement full user auth and tenant-scoped access before public customer use.
5. Check public `GET /api/health` for HTTP 200 as **liveness only**; authenticated `GET /api/ready` must return HTTP 200 to verify the configured PostgreSQL workspace. It returns 401 without a preview login and 503 if database configuration/connectivity is invalid. Check production deploy logs, hostname, SSL chain, mobile and desktop display and rollback path.
6. After login, verify `/export` downloads the current private-preview organization's CSV records, not invented files. Do not import or export actual customer contacts until privacy and data handling controls are certified. Provider web search, email tracking and bounce handling must fail closed unless genuinely integrated.

Official Hostinger guide: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
