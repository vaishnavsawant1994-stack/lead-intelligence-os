import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm, PERSON_STATUSES } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET() {
  return runCrm(async (organizationId) => {
    const [people, companies, pendingTasks, deals, stages, recentPeople] = await Promise.all([
      prisma.person.count({ where: { organizationId } }),
      prisma.company.count({ where: { organizationId } }),
      prisma.task.count({ where: { organizationId, completed: false } }),
      prisma.deal.count({ where: { organizationId } }),
      prisma.person.groupBy({ by: ["status"], where: { organizationId }, _count: { _all: true } }),
      prisma.person.findMany({ where: { organizationId }, select: { id: true, name: true, status: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    const byStage = PERSON_STATUSES.map((stage) => ({ stage, count: stages.find((s) => s.status === stage)?._count._all || 0 }));
    return NextResponse.json({ overview: { people, companies, pendingTasks, deals, byStage, recentPeople } }, { headers: { "Cache-Control": "no-store" } });
  });
}
