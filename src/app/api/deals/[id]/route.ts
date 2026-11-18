import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, validId, requiredString, moneyString, DEAL_STAGES, enumString, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const body = await jsonBody(request);
    const data: { name?: string; value?: string; stage?: string } = {};
    if ("name" in body) data.name = requiredString(body.name, "Name");
    if ("value" in body) data.value = moneyString(body.value);
    if ("stage" in body) data.stage = enumString(body.stage, DEAL_STAGES, "Stage");
    if (!Object.keys(data).length) throw new InputError("No fields to update");
    const changed = await prisma.$transaction(async (tx) => {
      const count = await tx.deal.updateMany({ where: { id, organizationId }, data });
      if (count.count) await recordAudit(tx, organizationId, "deal", id, "updated");
      return count;
    });
    if (!changed.count) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    return NextResponse.json({ deal: await prisma.deal.findFirst({ where: { id, organizationId } }) });
  }, request);
}

export async function DELETE(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const changed = await prisma.$transaction(async (tx) => {
      const deleted = await tx.deal.deleteMany({ where: { id, organizationId } });
      if (deleted.count) await recordAudit(tx, organizationId, "deal", id, "deleted");
      return deleted;
    });
    return changed.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }, request);
}
