import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, previewConfigured, safePasswordMatch, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export async function POST(request: NextRequest) {
  if (!previewConfigured()) return NextResponse.json({ error: "Administrator access is not configured" }, { status: 503 });
  let credentials: unknown;
  try { credentials = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (!credentials || typeof credentials !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { email, password } = credentials as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string" || password.length > 512) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const emailMatches = email.trim().toLowerCase() === process.env.APP_ADMIN_EMAIL!.toLowerCase();
  const passwordMatches = await safePasswordMatch(password);
  if (!emailMatches || !passwordMatches) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  const token = await createSessionToken(process.env.APP_ADMIN_EMAIL!.toLowerCase());
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE });
  return response;
}
