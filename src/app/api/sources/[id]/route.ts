import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, jsonBody, validId, requiredString, optionalString, enumString, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
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

export async function GET(_request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    const source = await prisma.source.findFirst({
      where: { id: validId(id), organizationId },
      include: { _count: { select: { appearances: true } } },
    });
    return source
      ? NextResponse.json({ source }, { headers: { "Cache-Control": "private, no-store" } })
      : NextResponse.json({ error: "Research source not found" }, { status: 404 });
  });
}

export async function PATCH(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const body = await jsonBody(request);
    const data: { name?: string; type?: string; url?: string | null } = {};
    if ("name" in body) data.name = requiredString(body.name, "Source name", 160);
    if ("type" in body) data.type = enumString(body.type, SOURCE_TYPES, "Source type");
    if ("url" in body) data.url = safeSourceUrl(body.url);
    if (!Object.keys(data).length) throw new InputError("No fields to update");
    const changed = await prisma.$transaction(async (tx) => {
      const result = await tx.source.updateMany({ where: { id, organizationId }, data });
      if (result.count) await recordAudit(tx, organizationId, "source", id, "updated");
      return result;
    });
    if (!changed.count) return NextResponse.json({ error: "Research source not found" }, { status: 404 });
    const source = await prisma.source.findFirst({ where: { id, organizationId },
      include: { _count: { select: { appearances: true } } } });
    return NextResponse.json({ source }, { headers: { "Cache-Control": "private, no-store" } });
  }, request);
}

export async function DELETE(request: Request, context: Context) {
  return runCrm(async (organizationId) => {
    const { id } = await context.params;
    validId(id);
    const source = await prisma.source.findFirst({
      where: { id, organizationId }, select: { id: true, _count: { select: { appearances: true } } },
    });
    if (!source) return NextResponse.json({ error: "Research source not found" }, { status: 404 });
    if (source._count.appearances) return NextResponse.json({
      error: "This source has linked appearances; unlink them before deleting the source",
    }, { status: 409 });
    const removed = await prisma.$transaction(async (tx) => {
      const result = await tx.source.deleteMany({ where: { id, organizationId } });
      if (result.count) await recordAudit(tx, organizationId, "source", id, "deleted");
      return result.count;
    });
    return removed
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json({ error: "Research source not found" }, { status: 404 });
  }, request);
}
