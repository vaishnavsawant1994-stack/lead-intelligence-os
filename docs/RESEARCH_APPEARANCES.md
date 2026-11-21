# Research appearances — administrator-recorded private-preview references

The `/research` screen links existing People and Research Sources to manually recorded appearance dates and article/event URLs.

## Qualified functionality

- `GET/POST /api/appearances` and `PATCH/DELETE /api/appearances/:id` require a signed private-preview administrator.
- People and Sources must **both** belong to the configured workspace. The API scopes read/edit/delete checks to both linked entities, rejects foreign associations, and never exposes cross-organization entries.
- Bounded pagination (default 25, maximum 100); optional filters by person/source ID.
- Reference dates are validated real calendar dates; URLs must be absolute HTTP(S) with no embedded credentials.
- Transactional audit events for create, update and delete.
- Frontend provides searchable Person/Source controls and an edit/delete workflow.

## Limitations

This tracks **administrator-entered references only**; it is not a crawler, discovery engine, content verifier, licensed data-enrichment integration, lead score, consent system, or outreach sender. Reference URLs are not fetched by the server. Data entered in the preview should remain synthetic until production identity, privacy controls, hosting and backup/restore are certified.

It reuses the existing Prisma `Appearance` model and does not need a new database table. Existing indexes and production migrations still require a deliberate review for real deployments.
