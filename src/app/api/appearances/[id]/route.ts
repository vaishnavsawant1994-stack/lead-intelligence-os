import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, validId, InputError } from "@/lib/crm";
import { appearanceDate, appearanceUrl } from "@/lib/appearance";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
const include = {
  person: { select: { id: true, name: true } },
  source: { select: { id: true, name: true, type: true } },
} as const;

export async function PATCH(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const body = await jsonBody(request);
    const data: { date?: string | null; url?: string | null } = {};
    if ("date" in body) data.date = appearanceDate(body.date);
    if ("url" in body) data.url = appearanceUrl(body.url);
    if (!Object.keys(data).length) throw new InputError("No fields to update");
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.appearance.findFirst({
        where: { id, person: { is: { organizationId } }, source: { is: { organizationId } } },
        select: { id: true },
      });
      if (!existing) return null;
      const result = await tx.appearance.update({ where: { id }, data, include });
      await recordAudit(tx, organizationId, "appearance", id, "updated");
      return result;
    });
    return updated
      ? NextResponse.json({ appearance: updated }, { headers: { "Cache-Control": "private, no-store" } })
      : NextResponse.json({ error: "Research appearance not found" }, { status: 404 });
  }, request);
}

export async function DELETE(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const removed = await prisma.$transaction(async (tx) => {
      const existing = await tx.appearance.findFirst({
        where: { id, person: { is: { organizationId } }, source: { is: { organizationId } } },
        select: { id: true },
      });
      if (!existing) return false;
      await tx.appearance.delete({ where: { id } });
      await recordAudit(tx, organizationId, "appearance", id, "deleted");
      return true;
    });
    return removed
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json({ error: "Research appearance not found" }, { status: 404 });
  }, request);
}
