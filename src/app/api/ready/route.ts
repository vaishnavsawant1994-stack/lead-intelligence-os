import { NextResponse } from "next/server";
import { runCrm } from "@/lib/crm";

export const dynamic = "force-dynamic";

// Administrator-only DB readiness. Public /api/health remains liveness-only.
export async function GET() {
  return runCrm(async () => NextResponse.json({
    service: "leadveyra",
    status: "ready",
    check: "postgresql-workspace",
  }, { headers: { "Cache-Control": "private, no-store" } }));
}
