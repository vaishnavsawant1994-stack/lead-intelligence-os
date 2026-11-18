import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, moneyString, DEAL_STAGES, enumString } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET() {
  return runCrm(async (organizationId) => {
    const deals = await prisma.deal.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ deals }, { headers: { "Cache-Control": "no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const deal = await prisma.$transaction(async (tx) => {
      const created = await tx.deal.create({
      data: {
        organizationId,
        name: requiredString(body.name, "Name"),
        value: moneyString(body.value),
        stage: body.stage === undefined ? "New" : enumString(body.stage, DEAL_STAGES, "Stage"),
      },
      });
      await recordAudit(tx, organizationId, "deal", created.id, "created");
      return created;
    });
    return NextResponse.json({ deal }, { status: 201 });
  }, request);
}
