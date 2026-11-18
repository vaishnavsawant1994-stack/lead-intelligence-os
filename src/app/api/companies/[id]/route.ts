import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, validId, requiredString, optionalString, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    const company = await prisma.company.findFirst({
      where: { id: validId(id), organizationId },
      include: { people: { select: { id: true, name: true, title: true, status: true }, take: 100, orderBy: { createdAt: "desc" } } },
    });
    return company ? NextResponse.json({ company }) : NextResponse.json({ error: "Company not found" }, { status: 404 });
  });
}

export async function PATCH(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const body = await jsonBody(request);
    const data: { name?: string; website?: string | null; industry?: string | null } = {};
    if ("name" in body) data.name = requiredString(body.name, "Name");
    if ("website" in body) data.website = optionalString(body.website, "Website", 250);
    if ("industry" in body) data.industry = optionalString(body.industry, "Industry", 140);
    if (!Object.keys(data).length) throw new InputError("No fields to update");
    const changed = await prisma.$transaction(async (tx) => {
      const count = await tx.company.updateMany({ where: { id, organizationId }, data });
      if (count.count) await recordAudit(tx, organizationId, "company", id, "updated");
      return count;
    });
    if (!changed.count) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    const company = await prisma.company.findFirst({ where: { id, organizationId } });
    return NextResponse.json({ company });
  }, request);
}

export async function DELETE(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const company = await prisma.company.findFirst({ where: { id, organizationId }, include: { _count: { select: { people: true } } } });
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    if (company._count.people > 0) return NextResponse.json({ error: "Remove linked people before deleting this company" }, { status: 409 });
    const removed = await prisma.$transaction(async (tx) => {
      const deleted = await tx.company.deleteMany({ where: { id, organizationId } });
      if (deleted.count) await recordAudit(tx, organizationId, "company", id, "deleted");
      return deleted.count;
    });
    return removed ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Company not found" }, { status: 404 });
  }, request);
}
