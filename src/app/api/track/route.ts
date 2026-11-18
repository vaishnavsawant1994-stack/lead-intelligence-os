import { NextResponse } from "next/server";

// Open-tracking must not silently collect events without verified provider,
 // durable tracking consent and authenticated event processing.
export async function GET() {
  return NextResponse.json({ error: "Open tracking is disabled" }, { status: 404, headers: { "Cache-Control": "no-store" } });
}
