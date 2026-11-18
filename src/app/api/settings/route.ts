import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm, jsonBody, requiredString } from "@/lib/crm";
export const dynamic = "force-dynamic";

export async function GET() {
  return runCrm(async (organizationId) => {
    const organization = await prisma.organization.findUnique({ where: { id: organizationId }, select: { id: true, name: true, slug: true, updatedAt: true } });
    if (!organization) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    return NextResponse.json({ organization }, { headers: { "Cache-Control": "private, no-store" } });
  });
}

export async function PATCH(request: Request) {
  return runCrm(async (organizationId) => {
    const body = await jsonBody(request);
    const name = requiredString(body.name, "Organization name", 100);
    const changed = await prisma.organization.updateMany({ where: { id: organizationId }, data: { name } });
    if (!changed.count) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    const organization = await prisma.organization.findUnique({ where: { id: organizationId }, select: { id: true, name: true, slug: true, updatedAt: true } });
    return NextResponse.json({ organization }, { headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
