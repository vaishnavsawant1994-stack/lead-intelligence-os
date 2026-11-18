import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, validId, requiredString, optionalString, emailString, PERSON_STATUSES, enumString, verifyCompany, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    const person = await prisma.person.findFirst({
      where: { id: validId(id), organizationId },
      include: { company: { select: { id: true, name: true } }, activities: { orderBy: { createdAt: "desc" }, take: 30 } },
    });
    return person ? NextResponse.json({ person }) : NextResponse.json({ error: "Person not found" }, { status: 404 });
  });
}

export async function PATCH(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const body = await jsonBody(request);
    const data: { name?: string; title?: string | null; email?: string | null; phone?: string | null; notes?: string | null; status?: string; tier?: string | null; companyId?: string | null } = {};
    if ("name" in body) data.name = requiredString(body.name, "Name");
    if ("title" in body) data.title = optionalString(body.title, "Title", 160);
    if ("email" in body) data.email = emailString(body.email);
    if ("phone" in body) data.phone = optionalString(body.phone, "Phone", 40);
    if ("notes" in body) data.notes = optionalString(body.notes, "Notes", 4000);
    if ("tier" in body) data.tier = optionalString(body.tier, "Tier", 16);
    if ("status" in body) data.status = enumString(body.status, PERSON_STATUSES, "Status");
    if ("companyId" in body) data.companyId = await verifyCompany(organizationId, optionalString(body.companyId, "Company", 50));
    if (!Object.keys(data).length) throw new InputError("No fields to update");
    const changed = await prisma.$transaction(async (tx) => {
      const count = await tx.person.updateMany({ where: { id, organizationId }, data });
      if (count.count) await recordAudit(tx, organizationId, "person", id, "updated");
      return count;
    });
    if (!changed.count) return NextResponse.json({ error: "Person not found" }, { status: 404 });
    const person = await prisma.person.findFirst({ where: { id, organizationId }, include: { company: { select: { id: true, name: true } } } });
    return NextResponse.json({ person });
  }, request);
}

export async function DELETE(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const exists = await prisma.person.findFirst({ where: { id, organizationId }, select: { id: true } });
    if (!exists) return NextResponse.json({ error: "Person not found" }, { status: 404 });
    const removed = await prisma.$transaction(async (tx) => {
      await tx.appearance.deleteMany({ where: { personId: id } });
      await tx.activity.deleteMany({ where: { personId: id } });
      const deleted = await tx.person.deleteMany({ where: { id, organizationId } });
      if (deleted.count) await recordAudit(tx, organizationId, "person", id, "deleted");
      return deleted.count;
    });
    return removed ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Person not found" }, { status: 404 });
  }, request);
}
