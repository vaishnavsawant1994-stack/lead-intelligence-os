# Private-preview administrator login protection

**Scope:** one-administrator private preview only. This is **not** production authentication, multi-user accounts, MFA, RBAC, tenant membership, or revocable sessions.

## Login behavior

- The existing administrator email/password remain stored only in protected environment variables.
- Eight failed password attempts **for the configured administrator email** within a 15-minute window are tracked in the dedicated PostgreSQL `PreviewLoginThrottle` record. Further attempts receive HTTP **429** with a `Retry-After` header until the lockout expires.
- State is **database-backed** and survives application restarts and parallel server instances. A successful login clears the counter. Incorrect non-administrator email addresses are rejected without creating arbitrary database records.
- Password comparisons continue using the preview constant-time hash comparison.
- Login fails closed (HTTP 503) when the database or throttle table is unavailable. No credentials or submitted email address are stored in the throttle record.
- The rate limit is a **preview hardening measure**, not a complete defense against distributed attacks. A person who knows the administrator email can induce a temporary lockout. Production needs identity-provider rate limits, origin/IP controls configured at trusted ingress, account recovery, MFA and security monitoring.

## Database and deployment constraints

The `PreviewLoginThrottle` model adds a new database table. It is applied automatically **only** to a disposable CI PostgreSQL 16 instance. For an existing database, perform a backup, review a real migration and verify rollback before changing the schema. Do not use `prisma db push` blindly against production.

## Evidence and limits

CI exercises failed attempts, 429 lockout, `Retry-After`, database persistence, recovery and successful-login reset. Chromium retains existing preview login/logout tests.

**Before real customers:** migrate away from the shared preview credential and build production user identities, membership and server-side RBAC, MFA, password-reset processes, revocable sessions and tenant-negative tests. Until then, Leadveyra remains PRIVATE PREVIEW ONLY.

## Login origin protection — 21 November 2026

The preview login route rejects cross-origin browser POST requests using the actual request destination host, request origin and trusted application origin configuration; it also rejects `Sec-Fetch-Site: cross-site` requests when no Origin is supplied. It keeps CLI/health smoke checks working when Origin is absent and does not bypass the existing PostgreSQL login throttle. Cross-site login POSTs return HTTP 403 with no session cookie. This is not a substitute for production account management, CSRF protection on every state-changing route, an identity provider, MFA or RBAC.
