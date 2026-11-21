# Contact CSV validation — private-preview dry run

The `/import` screen and signed `POST /api/import/validate` endpoint inspect synthetic CSV data **without persisting a contact, storing a file, or sending data to an external provider**.

## Validation rules
- UTF-8 text/csv only; uploaded size at most 50 KB, a strict streaming body limit, maximum 100 data rows.
- RFC-4180-style quoted fields, escaped quotation marks, CRLF and quoted line breaks supported.
- Required header `name`; optional `email`, `title`, `company`. Unknown/duplicate headers rejected.
- Validate name, email format, field lengths, row column counts, case-insensitive repeated emails in the file and organization-scoped duplicate emails already in PostgreSQL.
- Flag formula-looking spreadsheet values in contact text.
- Return per-row validation issues and counts only; do not return submitted names/emails in the response.
- Signed preview admin and same-origin request protection, no response caching.

## Important limits
**Not an import feature.** No rows are written. Do not submit real customer data until production identity, consent, secure data retention and provider/processing reviews are finished. Actual approved bulk ingestion, reviewable mapping, deduplication merge policy, transaction import rollback and audit history remain unfinished. Use the existing People form for synthetic preview records.
