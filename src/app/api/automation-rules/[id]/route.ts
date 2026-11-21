import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, validId, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const body = await jsonBody(request);
    const data: { name?: string; taskTitleTemplate?: string; enabled?: boolean } = {};
    if ("name" in body) data.name = requiredString(body.name, "Rule name", 120);
    if ("taskTitleTemplate" in body) data.taskTitleTemplate = requiredString(body.taskTitleTemplate, "Task title template", 160);
    if ("enabled" in body) {
      if (typeof body.enabled !== "boolean") throw new InputError("Enabled must be true or false");
      data.enabled = body.enabled;
    }
    if (!Object.keys(data).length) throw new InputError("No fields to update");
    const count = await prisma.$transaction(async (tx) => {
      const changed = await tx.automationRule.updateMany({ where: { id, organizationId }, data });
      if (changed.count) await recordAudit(tx, organizationId, "automation_rule", id, "updated");
      return changed.count;
    });
    if (!count) return NextResponse.json({ error: "Automation rule not found" }, { status: 404 });
    const rule = await prisma.automationRule.findFirst({ where: { id, organizationId },
      include: { _count: { select: { runs: true } } } });
    return NextResponse.json({ rule }, { headers: { "Cache-Control": "private, no-store" } });
  }, request);
}

export async function DELETE(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const result = await prisma.$transaction(async (tx) => {
      const rule = await tx.automationRule.findFirst({
        where: { id, organizationId },
        select: { id: true, _count: { select: { runs: true } } },
      });
      if (!rule) return "missing" as const;
      // Preserve event history. Executed rules can be paused, never deleted here.
      if (rule._count.runs) return "has-runs" as const;
      const removed = await tx.automationRule.deleteMany({ where: { id, organizationId } });
      if (removed.count) await recordAudit(tx, organizationId, "automation_rule", id, "deleted");
      return removed.count ? "deleted" as const : "missing" as const;
    });
    if (result === "has-runs") return NextResponse.json({
      error: "Executed automation rules have history. Pause this rule instead of deleting it.",
    }, { status: 409 });
    return result === "deleted"
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json({ error: "Automation rule not found" }, { status: 404 });
  }, request);
}
