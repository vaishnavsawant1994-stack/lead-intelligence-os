# Lead Intelligence OS

Professional multi-tenant SaaS platform for lead intelligence and client data management.

## Features Implemented

- Dashboard with real metrics
- People list + detail views with notes
- Companies
- Sources & Appearances
- Segments
- CSV Import with preview
- Full data Export
- Audit Log
- Settings + Team invite UI
- Prisma schema (Organization, User, Person, Company, Source, Appearance, Activity)
- Mock authentication foundation
- Clean professional UI

## Run Locally

```bash
cd lead-intelligence-os
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open http://localhost:3000

## Status

Frontend and feature structure are complete.  
Database layer is ready (Prisma).  
Run the commands above on your machine for a fully working local system.

Next optional enhancements: real NextAuth, Google Sheet live sync, billing.