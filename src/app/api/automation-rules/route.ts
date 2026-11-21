import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET() {
  return runCrm(async (organizationId) => {
    const rules = await prisma.automationRule.findMany({
      where: { organizationId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 50,
      include: {
        _count: { select: { runs: true } },
        runs: { orderBy: { createdAt: "desc" }, take: 1,
          select: { id: true, personId: true, taskId: true, createdAt: true } },
      },
    });
    return NextResponse.json({ rules, limit: 10 }, { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const name = requiredString(body.name, "Rule name", 120);
    const taskTitleTemplate = requiredString(body.taskTitleTemplate, "Task title template", 160);
    const rule = await prisma.$transaction(async (tx) => {
      const count = await tx.automationRule.count({ where: { organizationId } });
      if (count >= 10) throw new InputError("Private preview permits up to 10 automation rules");
      const created = await tx.automationRule.create({
        data: { organizationId, name, taskTitleTemplate, trigger: "person_created", enabled: true },
      });
      await recordAudit(tx, organizationId, "automation_rule", created.id, "created");
      return created;
    });
    return NextResponse.json({ rule }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
