import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm, jsonBody, requiredString, dateString } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET() {
  return runCrm(async (organizationId) => {
    const tasks = await prisma.task.findMany({ where: { organizationId }, orderBy: [{ completed: "asc" }, { createdAt: "desc" }], take: 100 });
    return NextResponse.json({ tasks }, { headers: { "Cache-Control": "no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const task = await prisma.task.create({
      data: { organizationId, title: requiredString(body.title, "Title", 240), dueAt: dateString(body.dueAt) },
    });
    return NextResponse.json({ task }, { status: 201 });
  }, request);
}
