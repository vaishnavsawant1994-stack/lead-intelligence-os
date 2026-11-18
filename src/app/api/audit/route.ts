import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET() {
  return runCrm(async (organizationId) => {
    const events = await prisma.auditEvent.findMany({
      where: { organizationId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
      select: { id: true, actorEmail: true, entityType: true, entityId: true, action: true, createdAt: true },
    });
    return NextResponse.json({
      events,
      note: "Preview-only transactional audit of core CRM and organization settings mutations. This is not a complete immutable enterprise audit system.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  });
}
