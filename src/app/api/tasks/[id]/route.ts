import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, validId, requiredString, dateString, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const body = await jsonBody(request);
    const data: { title?: string; completed?: boolean; dueAt?: Date | null } = {};
    if ("title" in body) data.title = requiredString(body.title, "Title", 240);
    if ("completed" in body) {
      if (typeof body.completed !== "boolean") throw new InputError("Completed must be true or false");
      data.completed = body.completed;
    }
    if ("dueAt" in body) data.dueAt = dateString(body.dueAt);
    if (!Object.keys(data).length) throw new InputError("No fields to update");
    const changed = await prisma.$transaction(async (tx) => {
      const count = await tx.task.updateMany({ where: { id, organizationId }, data });
      if (count.count) await recordAudit(tx, organizationId, "task", id, "updated");
      return count;
    });
    if (!changed.count) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    return NextResponse.json({ task: await prisma.task.findFirst({ where: { id, organizationId } }) });
  }, request);
}

export async function DELETE(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const changed = await prisma.$transaction(async (tx) => {
      const deleted = await tx.task.deleteMany({ where: { id, organizationId } });
      if (deleted.count) await recordAudit(tx, organizationId, "task", id, "deleted");
      return deleted;
    });
    return changed.count ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: "Task not found" }, { status: 404 });
  }, request);
}
