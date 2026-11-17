import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  // Public liveness only, not proof of database readiness or release qualification.
  return NextResponse.json({ service: "leadveyra", status: "ok", check: "liveness" }, {
    headers: { "Cache-Control": "no-store" },
  });
}
