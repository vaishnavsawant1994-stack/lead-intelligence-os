import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm } from "@/lib/crm";

export const dynamic = "force-dynamic";
export async function GET() {
  return runCrm(async (organizationId) => {
    const [leads, deals, tasks] = await Promise.all([
      prisma.person.groupBy({ by: ["status"], where: { organizationId }, _count: { _all: true } }),
      prisma.deal.groupBy({ by: ["stage"], where: { organizationId }, _count: { _all: true }, _sum: { value: true } }),
      prisma.task.groupBy({ by: ["completed"], where: { organizationId }, _count: { _all: true } }),
    ]);
    return NextResponse.json({
      report: {
        leadStages: leads.map((r) => ({ stage: r.status, count: r._count._all })),
        dealStages: deals.map((r) => ({ stage: r.stage, count: r._count._all, value: r._sum.value?.toString() || "0" })),
        tasks: { completed: tasks.find((x) => x.completed)?._count._all || 0, pending: tasks.find((x) => !x.completed)?._count._all || 0 },
      },
      note: "Values are entered amounts; no currency, probability-weighted forecast or revenue recognition has been configured.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  });
}
