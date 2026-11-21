# Preview login hardening — 21 November 2026

This implements a **database-backed temporary sign-in throttle for the existing single-admin preview**. It is **not** production multi-user authentication.

- Failed attempts are counted per normalized attempted email in PostgreSQL. Five failures in a 15-minute window cause a 15-minute block and HTTP 429 with `Retry-After`.
- The database stores a keyed SHA-256 HMAC of the attempted email, not plaintext attempted usernames or IP addresses.
- A successful login clears the relevant counter.
- Login enforces a small JSON body limit, exact content type and request-Origin comparison. Responses disable caching.
- Authentication fails closed with HTTP 503 if the database or throttle is unavailable.
- The identifier-only limiter may allow attackers to temporarily lock a known admin account. Production abuse controls should also use provider-based rate limiting, appropriate trusted edge IP signals and account recovery.
- The throttle does not grant user accounts, MFA, permissions, session revocation, security event history or hardened production authorization.

**Schema migration warning:** `PreviewLoginAttempt` must be created using a reviewed migration. Never run `prisma db push` against an existing production database. Disposable PostgreSQL CI is allowed.

**Still blocked:** Provider OAuth, production identity, role enforcement, privacy and import certification, backup/restore and deployment.
