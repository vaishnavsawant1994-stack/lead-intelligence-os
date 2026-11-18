import { NextResponse } from "next/server";

// Deliberately fail closed until production identity/authorization, signed provider
// event handling, consent evidence, suppression enforcement, abuse prevention,
// and auditable delivery are independently certified.
// A deployment flag or provider key MUST NOT bypass these safeguards.
export async function POST() {
  return NextResponse.json({
    error: "Outbound email is disabled until production authorization, consent and suppression controls are verified",
  }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
