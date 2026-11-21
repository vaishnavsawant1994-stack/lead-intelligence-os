import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, previewConfigured, safePasswordMatch, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";
import { checkPreviewLoginLimit, clearPreviewLoginFailures, notePreviewLoginFailure } from "@/lib/preview-login-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reply(message: string, status: number, retryAfter?: number) {
  return NextResponse.json({ error: message }, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    },
  });
}

function sameSiteRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const url = new URL(request.url);
  const expected = new Set([url.origin]);
  const host = request.headers.get("host");
  if (host) {
    expected.add(`${url.protocol}//${host}`);
    const forwarded = request.headers.get("x-forwarded-proto");
    if (forwarded === "https" || forwarded === "http") expected.add(`${forwarded}://${host}`);
  }
  if (process.env.NEXTAUTH_URL) {
    try { expected.add(new URL(process.env.NEXTAUTH_URL).origin); } catch { /* disallow invalid alternate origin */ }
  }
  return expected.has(origin);
}

export async function POST(request: NextRequest) {
  if (!previewConfigured()) return reply("Administrator access is not configured", 503);
  if (!sameSiteRequest(request)) return reply("Invalid request origin", 403);
  const type = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  if (type !== "application/json") return reply("Expected a JSON request", 415);
  const raw = await request.text();
  if (raw.length > 2048) return reply("Request too large", 413);
  let credentials: unknown;
  try { credentials = JSON.parse(raw); } catch { return reply("Invalid request", 400); }
  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) return reply("Invalid request", 400);
  const { email, password } = credentials as Record<string, unknown>;
  if (typeof email !== "string" || email.length > 254 || typeof password !== "string" || password.length > 512) {
    return reply("Invalid credentials", 401);
  }
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return reply("Invalid credentials", 401);

  try {
    const delay = await checkPreviewLoginLimit(normalized);
    if (delay) return reply("Too many sign-in attempts. Try again later.", 429, delay);

    const emailMatches = normalized === process.env.APP_ADMIN_EMAIL!.trim().toLowerCase();
    const passwordMatches = await safePasswordMatch(password);
    if (!emailMatches || !passwordMatches) {
      const retryAfter = await notePreviewLoginFailure(normalized);
      if (retryAfter) return reply("Too many sign-in attempts. Try again later.", 429, retryAfter);
      return reply("Invalid credentials", 401);
    }
    await clearPreviewLoginFailures(normalized);
    const token = await createSessionToken(normalized);
    const response = NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      path: "/", maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch {
    // Never fall back to unthrottled logins if the rate-limit database is unavailable.
    return reply("Authentication temporarily unavailable", 503);
  }
}
