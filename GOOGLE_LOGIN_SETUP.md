# Google Login Setup

## 1. Create Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Authorized JavaScript origins:
   - `https://lead-intelligence-os.netlify.app`
7. Authorized redirect URIs:
   - `https://lead-intelligence-os.netlify.app/api/auth/callback/google`
8. Copy **Client ID** and **Client Secret**

## 2. Add to Netlify

In Netlify → Site configuration → Environment variables, add:

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | Your Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Client Secret |
| `NEXTAUTH_SECRET` | Any random string |
| `NEXTAUTH_URL` | `https://lead-intelligence-os.netlify.app` |

## 3. Redeploy

Trigger a redeploy in Netlify.

## Done

The **Continue with Google** button on `/login` will work.
