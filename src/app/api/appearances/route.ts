import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, validId, requiredString, listPage, pageResult } from "@/lib/crm";
import { appearanceDate, appearanceUrl } from "@/lib/appearance";

export const dynamic = "force-dynamic";

const include = {
  person: { select: { id: true, name: true } },
  source: { select: { id: true, name: true, type: true } },
} as const;

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const { page, pageSize, skip } = listPage(request);
    const params = new URL(request.url).searchParams;
    const personId = params.get("personId");
    const sourceId = params.get("sourceId");
    if (personId) validId(personId);
    if (sourceId) validId(sourceId);
    const where = {
      person: { is: { organizationId, ...(personId ? { id: personId } : {}) } },
      source: { is: { organizationId, ...(sourceId ? { id: sourceId } : {}) } },
    };
    const [appearances, total] = await Promise.all([
      prisma.appearance.findMany({ where, include,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: pageSize, skip }),
      prisma.appearance.count({ where }),
    ]);
    return NextResponse.json({ appearances, pagination: pageResult(total, page, pageSize) },
      { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const personId = validId(requiredString(body.personId, "Person ID", 50));
    const sourceId = validId(requiredString(body.sourceId, "Source ID", 50));
    const date = appearanceDate(body.date);
    const url = appearanceUrl(body.url);
    const appearance = await prisma.$transaction(async (tx) => {
      const [person, source] = await Promise.all([
        tx.person.findFirst({ where: { id: personId, organizationId }, select: { id: true } }),
        tx.source.findFirst({ where: { id: sourceId, organizationId }, select: { id: true } }),
      ]);
      if (!person || !source) return null;
      const created = await tx.appearance.create({
        data: { personId, sourceId, date, url }, include,
      });
      await recordAudit(tx, organizationId, "appearance", created.id, "created");
      return created;
    });
    return appearance
      ? NextResponse.json({ appearance }, { status: 201, headers: { "Cache-Control": "private, no-store" } })
      : NextResponse.json({ error: "Person or source does not belong to this workspace" }, { status: 400 });
  }, request);
}
