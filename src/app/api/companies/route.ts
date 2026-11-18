import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, optionalString } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET() {
  return runCrm(async (organizationId) => {
    const companies = await prisma.company.findMany({
      where: { organizationId },
      include: { _count: { select: { people: true } } },
      orderBy: { createdAt: "desc" }, take: 100,
    });
    return NextResponse.json({ companies }, { headers: { "Cache-Control": "no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const company = await prisma.$transaction(async (tx) => {
      const created = await tx.company.create({
      data: { organizationId, name: requiredString(body.name, "Name"), website: optionalString(body.website, "Website", 250), industry: optionalString(body.industry, "Industry", 140) },
      });
      await recordAudit(tx, organizationId, "company", created.id, "created");
      return created;
    });
    return NextResponse.json({ company }, { status: 201 });
  }, request);
}
