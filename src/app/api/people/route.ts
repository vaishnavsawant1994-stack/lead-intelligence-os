import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, optionalString, emailString, PERSON_STATUSES, enumString, verifyCompany } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const search = (new URL(request.url).searchParams.get("q") || "").trim().slice(0, 80);
    const where = { organizationId, ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}) };
    const people = await prisma.person.findMany({ where, include: { company: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
    return NextResponse.json({ people }, { headers: { "Cache-Control": "no-store" } });
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
