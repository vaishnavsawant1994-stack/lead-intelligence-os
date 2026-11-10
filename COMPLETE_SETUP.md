# Complete Setup Checklist

## Step 1: Create Neon Database (2 minutes)

1. Open [https://neon.tech](https://neon.tech)
2. Click **Sign up** (use GitHub)
3. Create a project named `lead-intelligence-os`
4. Click **Connect**
5. Copy the **Pooled** connection string
6. Copy the **Direct** connection string

## Step 2: Add Environment Variables in Netlify (1 minute)

1. Go to [https://app.netlify.com/projects/lead-intelligence-os](https://app.netlify.com/projects/lead-intelligence-os)
2. Click **Site configuration** → **Environment variables**
3. Click **Add a variable** and add these four:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste your **pooled** Neon connection string |
| `DIRECT_URL` | Paste your **direct** Neon connection string |
| `NEXTAUTH_SECRET` | Any random string (e.g. `my-secret-key-123`) |
| `NEXTAUTH_URL` | `https://lead-intelligence-os.netlify.app` |

4. Click **Save**

## Step 3: Push Schema & Seed (from your computer)

```bash
git clone https://github.com/vaishnavsawant1994-stack/lead-intelligence-os.git
cd lead-intelligence-os
npm install

# Create .env file with your Neon URLs
echo 'DATABASE_URL="your-pooled-url"' > .env
echo 'DIRECT_URL="your-direct-url"' >> .env

npx prisma db push
npx tsx prisma/seed.ts
```

## Step 4: Redeploy on Netlify

1. In Netlify, go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**

## Done

Your app is live at: **https://lead-intelligence-os.netlify.app**

Login page: `/login` (any email + password works in demo mode)
Import page: `/import`
