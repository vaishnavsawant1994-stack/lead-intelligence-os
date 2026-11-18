import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";
import { runCrm, InputError, emailString, jsonBody, optionalString, enumString, listPage, listSearch, pageResult } from "@/lib/crm";

export const dynamic = "force-dynamic";

const REASONS = ["manual_opt_out", "unsubscribe", "complaint", "legal_request"] as const;

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const { page, pageSize, skip } = listPage(request);
    const query = listSearch(request);
    const params = new URL(request.url).searchParams;
    const reason = params.get("reason");
    const filteredReason = reason ? enumString(reason, REASONS, "Reason") : null;
    const where = {
      organizationId,
      ...(query ? { email: { contains: query, mode: "insensitive" as const } } : {}),
      ...(filteredReason ? { reason: filteredReason } : {}),
    };
    const [entries, total] = await Promise.all([
      prisma.suppressionEntry.findMany({
        where, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip, take: pageSize,
        select: { id: true, email: true, reason: true, note: true, createdAt: true },
      }),
      prisma.suppressionEntry.count({ where }),
    ]);
    return NextResponse.json({ entries, pagination: pageResult(total, page, pageSize) },
      { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const email = emailString(body.email);
    if (!email) throw new InputError("A valid email address is required");
    const reason = enumString(body.reason, REASONS, "Reason");
    const note = optionalString(body.note, "Note", 1000);
    const entry = await prisma.$transaction(async (tx) => {
      const created = await tx.suppressionEntry.create({
        data: { organizationId, email, reason, note },
        select: { id: true, email: true, reason: true, note: true, createdAt: true },
      });
      await recordAudit(tx, organizationId, "suppression", created.id, "created");
      return created;
    });
    return NextResponse.json({ entry }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
