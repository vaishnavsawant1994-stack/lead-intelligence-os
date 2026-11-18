import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, optionalString, listPage, listSearch, pageResult } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const term = listSearch(request);
    const { page, pageSize, skip } = listPage(request);
    const where = { organizationId, ...(term ? { name: { contains: term, mode: "insensitive" as const } } : {}) };
    const [companies, total] = await Promise.all([
      prisma.company.findMany({ where, include: { _count: { select: { people: true } } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip, take: pageSize }),
      prisma.company.count({ where }),
    ]);
    return NextResponse.json({ companies, pagination: pageResult(total, page, pageSize) },
      { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const company = await prisma.$transaction(async (tx) => {
      const created = await tx.company.create({
        data: { organizationId, name: requiredString(body.name, "Name"),
          website: optionalString(body.website, "Website", 250),
          industry: optionalString(body.industry, "Industry", 140) },
      });
      await recordAudit(tx, organizationId, "company", created.id, "created");
      return created;
    });
    return NextResponse.json({ company }, { status: 201 });
  }, request);
}
