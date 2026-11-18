import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, optionalString, emailString, PERSON_STATUSES, enumString, verifyCompany, listPage, listSearch, pageResult } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const term = listSearch(request);
    const { page, pageSize, skip } = listPage(request);
    const stage = new URL(request.url).searchParams.get("status");
    const status = stage ? enumString(stage, PERSON_STATUSES, "Status") : null;
    const where = {
      organizationId,
      ...(term ? { name: { contains: term, mode: "insensitive" as const } } : {}),
      ...(status ? { status } : {}),
    };
    const [people, total] = await Promise.all([
      prisma.person.findMany({ where, include: { company: { select: { id: true, name: true } } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip, take: pageSize }),
      prisma.person.count({ where }),
    ]);
    return NextResponse.json({ people, pagination: pageResult(total, page, pageSize) },
      { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const name = requiredString(body.name, "Name");
    const companyId = await verifyCompany(organizationId, optionalString(body.companyId, "Company", 50));
    const status = body.status === undefined ? "New" : enumString(body.status, PERSON_STATUSES, "Status");
    const person = await prisma.$transaction(async (tx) => {
      const created = await tx.person.create({
        data: {
          organizationId, name, companyId, status,
          title: optionalString(body.title, "Title", 160),
          email: emailString(body.email),
          phone: optionalString(body.phone, "Phone", 40),
          notes: optionalString(body.notes, "Notes", 4000),
        },
        include: { company: { select: { id: true, name: true } } },
      });
      await recordAudit(tx, organizationId, "person", created.id, "created");
      return created;
    });
    return NextResponse.json({ person }, { status: 201 });
  }, request);
}
