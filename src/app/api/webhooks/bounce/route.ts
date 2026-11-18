import { NextResponse } from "next/server";

// A provider webhook must verify signatures and persist suppression before acknowledging events.
// The previous process-memory Set silently lost bounce/complaint data at restart.
export async function POST() {
  return NextResponse.json({ error: "Bounce webhook is disabled until verified provider signatures and durable suppression are implemented" }, { status: 503 });
}
export async function GET() {
  return NextResponse.json({ error: "Bounce tracking is not configured" }, { status: 503 });
}
