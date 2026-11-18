import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, dateString, listPage, listSearch, pageResult, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const term = listSearch(request);
    const { page, pageSize, skip } = listPage(request);
    const filter = new URL(request.url).searchParams.get("state") || "all";
    if (!["all", "pending", "completed"].includes(filter)) throw new InputError("Invalid task state");
    const where = {
      organizationId,
      ...(term ? { title: { contains: term, mode: "insensitive" as const } } : {}),
      ...(filter !== "all" ? { completed: filter === "completed" } : {}),
    };
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, orderBy: [{ completed: "asc" }, { createdAt: "desc" }, { id: "desc" }], skip, take: pageSize }),
      prisma.task.count({ where }),
    ]);
    return NextResponse.json({ tasks, pagination: pageResult(total, page, pageSize) },
      { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const task = await prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: { organizationId, title: requiredString(body.title, "Title", 240), dueAt: dateString(body.dueAt) },
      });
      await recordAudit(tx, organizationId, "task", created.id, "created");
      return created;
    });
    return NextResponse.json({ task }, { status: 201 });
  }, request);
}
