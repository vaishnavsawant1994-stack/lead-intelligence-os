# Neon Setup Guide

## 1. Create free Neon database

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub or Google
3. Create a new project (name it `lead-intelligence-os`)
4. Click **Connect** and copy both connection strings:
   - **Pooled** (has `-pooler` in the hostname) → `DATABASE_URL`
   - **Direct** → `DIRECT_URL`

## 2. Add environment variables in Netlify

1. Go to [app.netlify.com/projects/lead-intelligence-os](https://app.netlify.com/projects/lead-intelligence-os)
2. Site configuration → Environment variables
3. Add:
   - `DATABASE_URL` = your pooled connection string
   - `DIRECT_URL` = your direct connection string
   - `NEXTAUTH_SECRET` = any random string
   - `NEXTAUTH_URL` = `https://lead-intelligence-os.netlify.app`

## 3. Push schema to Neon

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

## 4. Redeploy on Netlify

Trigger a redeploy after adding the environment variables.
