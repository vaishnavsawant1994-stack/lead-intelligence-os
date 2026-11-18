import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, requiredString, optionalString, enumString, InputError, listPage, listSearch, pageResult } from "@/lib/crm";

export const dynamic = "force-dynamic";
const SOURCE_TYPES = ["magazine", "publication", "event", "website", "other"] as const;

function safeSourceUrl(value: unknown): string | null {
  const raw = optionalString(value, "Source URL", 500);
  if (!raw) return null;
  let url: URL;
  try { url = new URL(raw); } catch { throw new InputError("Source URL must be an absolute http(s) link"); }
  if (!["https:", "http:"].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new InputError("Source URL must be an http(s) link without credentials");
  }
  return url.toString();
}

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const { page, pageSize, skip } = listPage(request);
    const term = listSearch(request);
    const requested = new URL(request.url).searchParams.get("type");
    const type = requested ? enumString(requested, SOURCE_TYPES, "Source type") : null;
    const where = {
      organizationId,
      ...(term ? { name: { contains: term, mode: "insensitive" as const } } : {}),
      ...(type ? { type } : {}),
    };
    const [sources, total] = await Promise.all([
      prisma.source.findMany({
        where,
        include: { _count: { select: { appearances: true } } },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip, take: pageSize,
      }),
      prisma.source.count({ where }),
    ]);
    return NextResponse.json({ sources, pagination: pageResult(total, page, pageSize) },
      { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const name = requiredString(body.name, "Source name", 160);
    const type = body.type === undefined ? "other" : enumString(body.type, SOURCE_TYPES, "Source type");
    const url = safeSourceUrl(body.url);
    const source = await prisma.$transaction(async (tx) => {
      const created = await tx.source.create({
        data: { organizationId, name, type, url },
      });
      await recordAudit(tx, organizationId, "source", created.id, "created");
      return created;
    });
    return NextResponse.json({ source }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
