import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, previewConfigured, safePasswordMatch, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

const KEY = "single-preview-administrator"; // No submitted email/IP is stored.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

function invalidCredentials() {
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: { "Cache-Control": "no-store" } });
}
function retryAfter(until: Date) {
  return NextResponse.json({ error: "Too many failed login attempts. Try again later." },
    { status: 429, headers: {
      "Retry-After": String(Math.max(1, Math.ceil((until.getTime() - Date.now()) / 1000))),
      "Cache-Control": "no-store",
    } });
}

function sameSiteLoginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin && request.headers.get("sec-fetch-site") === "cross-site") return false;
  if (!origin) return true;
  const parsed = new URL(request.url);
  const allowed = new Set([parsed.origin]);
  const host = request.headers.get("host");
  if (host && /^[a-z0-9.:[\\]-]+$/i.test(host)) {
    allowed.add(`${parsed.protocol}//${host}`);
    const proxyProto = request.headers.get("x-forwarded-proto");
    if (proxyProto === "https" || proxyProto === "http") allowed.add(`${proxyProto}://${host}`);
  }
  if (process.env.NEXTAUTH_URL) {
    try { allowed.add(new URL(process.env.NEXTAUTH_URL).origin); } catch { /* no alternate origin */ }
  }
  return allowed.has(origin);
}

export async function POST(request: NextRequest) {
  if (!previewConfigured()) {
    return NextResponse.json({ error: "Administrator access is not configured" }, { status: 503 });
  }
  if (!sameSiteLoginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, {
      status: 403, headers: { "Cache-Control": "no-store" },
    });
  }
  const type = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json") return NextResponse.json({ error: "Expected JSON" }, { status: 400 });
  const raw = await request.text();
  if (raw.length > 2048) return NextResponse.json({ error: "Request too large" }, { status: 413 });
  let credentials: unknown;
  try { credentials = JSON.parse(raw); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { email, password } = credentials as Record<string, unknown>;
  if (typeof email !== "string" || email.length > 254 ||
      typeof password !== "string" || password.length > 512) return invalidCredentials();

  const emailMatches = email.trim().toLowerCase() === process.env.APP_ADMIN_EMAIL!.toLowerCase();
  // Evaluate the password match even for a different email to reduce account-enumeration timing variation.
  const passwordMatches = await safePasswordMatch(password);
  if (!emailMatches) return invalidCredentials();

  try {
    const now = new Date();
    const state = await prisma.previewLoginThrottle.findUnique({ where: { id: KEY } });
    const activeWindow = Boolean(state && now.getTime() - state.windowStart.getTime() < WINDOW_MS);
    if (state && activeWindow && (state.failureCount >= MAX_FAILURES ||
      (state.lockedUntil && state.lockedUntil.getTime() > now.getTime()))) {
      return retryAfter(state.lockedUntil && state.lockedUntil.getTime() > now.getTime()
        ? state.lockedUntil : new Date(state.windowStart.getTime() + WINDOW_MS));
    }

    if (!passwordMatches) {
      const count = activeWindow && state ? state.failureCount + 1 : 1;
      const lock = count >= MAX_FAILURES ? new Date(now.getTime() + WINDOW_MS) : null;
      await prisma.previewLoginThrottle.upsert({
        where: { id: KEY },
        create: { id: KEY, failureCount: count, windowStart: now, lockedUntil: lock },
        update: activeWindow
          ? { failureCount: { increment: 1 }, lockedUntil: lock }
          : { failureCount: 1, windowStart: now, lockedUntil: null },
      });
      return invalidCredentials();
    }

    // Successful login clears a previous failed-attempt window.
    await prisma.previewLoginThrottle.deleteMany({ where: { id: KEY } });
    const token = await createSessionToken(process.env.APP_ADMIN_EMAIL!.toLowerCase());
    const response = NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      path: "/", maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch {
    // A missing database must never bypass the login attempt counter.
    return NextResponse.json({ error: "Administrator login is temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
