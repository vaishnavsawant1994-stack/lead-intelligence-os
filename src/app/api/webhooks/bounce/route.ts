import { NextResponse } from "next/server";
const bouncedEmails = new Set<string>();
const bounceLog: any[] = [];
export async function POST(request: Request) {
  const body = await request.json();
  const { type, data } = body;
  if (type === "email.bounced" || type === "email.complained") {
    const email = data?.to?.[0] || data?.email;
    if (email) { bouncedEmails.add(email.toLowerCase()); bounceLog.unshift({ email, reason: data?.reason || "Bounced", time: new Date().toISOString() }); }
  }
  return NextResponse.json({ received: true });
}
export async function GET() { return NextResponse.json({ bounced: Array.from(bouncedEmails), log: bounceLog.slice(0, 50), count: bouncedEmails.size }); }
