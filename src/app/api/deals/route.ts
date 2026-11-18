import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, moneyString, DEAL_STAGES, enumString, listPage, listSearch, pageResult } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const term = listSearch(request);
    const { page, pageSize, skip } = listPage(request);
    const requestedStage = new URL(request.url).searchParams.get("stage");
    const stage = requestedStage ? enumString(requestedStage, DEAL_STAGES, "Stage") : null;
    const where = {
      organizationId,
      ...(term ? { name: { contains: term, mode: "insensitive" as const } } : {}),
      ...(stage ? { stage } : {}),
    };
    const [deals, total] = await Promise.all([
      prisma.deal.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip, take: pageSize }),
      prisma.deal.count({ where }),
    ]);
    return NextResponse.json({ deals, pagination: pageResult(total, page, pageSize) },
      { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const deal = await prisma.$transaction(async (tx) => {
      const created = await tx.deal.create({
        data: { organizationId, name: requiredString(body.name, "Name"), value: moneyString(body.value),
          stage: body.stage === undefined ? "New" : enumString(body.stage, DEAL_STAGES, "Stage") },
      });
      await recordAudit(tx, organizationId, "deal", created.id, "created");
      return created;
    });
    return NextResponse.json({ deal }, { status: 201 });
  }, request);
}
