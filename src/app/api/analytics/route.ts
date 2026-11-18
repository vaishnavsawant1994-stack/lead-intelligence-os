import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
const WINDOWS = [7, 30, 90] as const;

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const requestedDays = new URL(request.url).searchParams.get("days") || "30";
    if (!WINDOWS.some((days) => String(days) === requestedDays)) {
      throw new InputError("Reporting window must be 7, 30 or 90 days");
    }
    const days = Number(requestedDays);
    const now = new Date();
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const organization = { organizationId };
    const [
      people, companies, deals, sources, tasks,
      recentPeople, recentCompanies, recentDeals, recentSources,
      statusGroups, stageGroups, typeGroups, taskGroups,
    ] = await Promise.all([
      prisma.person.count({ where: organization }),
      prisma.company.count({ where: organization }),
      prisma.deal.count({ where: organization }),
      prisma.source.count({ where: organization }),
      prisma.task.count({ where: organization }),
      prisma.person.count({ where: { organizationId, createdAt: { gte: start, lte: now } } }),
      prisma.company.count({ where: { organizationId, createdAt: { gte: start, lte: now } } }),
      prisma.deal.count({ where: { organizationId, createdAt: { gte: start, lte: now } } }),
      prisma.source.count({ where: { organizationId, createdAt: { gte: start, lte: now } } }),
      prisma.person.groupBy({ by: ["status"], where: organization, _count: { _all: true } }),
      prisma.deal.groupBy({ by: ["stage"], where: organization,
        _count: { _all: true }, _sum: { value: true } }),
      prisma.source.groupBy({ by: ["type"], where: organization, _count: { _all: true } }),
      prisma.task.groupBy({ by: ["completed"], where: organization, _count: { _all: true } }),
    ]);
    const completed = taskGroups.find((t) => t.completed)?._count._all || 0;
    const pending = taskGroups.find((t) => !t.completed)?._count._all || 0;
    return NextResponse.json({
      days, asOf: now.toISOString(), windowStart: start.toISOString(),
      totals: { people, companies, deals, sources, tasks },
      newInWindow: { people: recentPeople, companies: recentCompanies, deals: recentDeals, sources: recentSources },
      peopleByStatus: statusGroups.map((group) => ({ name: group.status, count: group._count._all })),
      dealsByStage: stageGroups.map((group) => ({
        name: group.stage, count: group._count._all,
        enteredAmount: group._sum.value?.toString() || "0",
      })),
      sourcesByType: typeGroups.map((group) => ({ name: group.type, count: group._count._all })),
      tasksByState: { completed, pending },
      limitations: "Database counts and entered deal values only. No configured currency, inferred revenue, marketing attribution, provider events, or forecasting.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  });
}
