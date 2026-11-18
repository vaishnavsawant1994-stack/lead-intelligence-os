import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export const PERSON_STATUSES = ["New", "Contacted", "Qualified", "Opportunity", "Won", "Lost"] as const;
export const DEAL_STAGES = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] as const;

export class InputError extends Error {}

export function requiredString(value: unknown, field: string, max = 160): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new InputError(`${field} must be between 1 and ${max} characters`);
  return value.trim();
}

export function optionalString(value: unknown, field: string, max = 1000): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > max) throw new InputError(`${field} is invalid`);
  return value.trim() || null;
}

export function enumString(value: unknown, valid: readonly string[], field: string): string {
  if (typeof value !== "string" || !valid.includes(value)) throw new InputError(`${field} is invalid`);
  return value;
}

export function emailString(value: unknown): string | null {
  const email = optionalString(value, "email", 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("Email address is invalid");
  return email;
}

export function dateString(value: unknown): Date | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new InputError("Date is invalid");
  const parsed = new Date(value + "T00:00:00.000Z");
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new InputError("Date is invalid");
  return parsed;
}

export function moneyString(value: unknown): string {
  if ((typeof value !== "string" && typeof value !== "number") || value === "") throw new InputError("Deal value is invalid");
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || amount > 999999999) throw new InputError("Deal value must be 0 to 999999999");
  return amount.toFixed(2);
}

export async function jsonBody(request: Request): Promise<Record<string, unknown>> {
  const type = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json") throw new InputError("Content-Type must be application/json");
  const raw = await request.text();
  if (raw.length > 12000) throw new InputError("Request body too large");
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new InputError("Invalid JSON"); }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError("Expected a JSON object");
  return value as Record<string, unknown>;
}

export function validId(id: string): string {
  if (!/^[a-z0-9]{10,50}$/i.test(id)) throw new InputError("Invalid record ID");
  return id;
}

export async function verifyCompany(organizationId: string, companyId: string | null): Promise<string | null> {
  if (!companyId) return null;
  validId(companyId);
  const company = await prisma.company.findFirst({ where: { id: companyId, organizationId }, select: { id: true } });
  if (!company) throw new InputError("Company does not exist in this workspace");
  return company.id;
}

export async function runCrm(
  action: (organizationId: string) => Promise<NextResponse>,
  request?: Request
): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (!await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (request && !["GET", "HEAD"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const allowed = [new URL(request.url).origin];
    if (process.env.NEXTAUTH_URL) {
      try { allowed.push(new URL(process.env.NEXTAUTH_URL).origin); } catch { /* invalid config disallows alternate origin */ }
    }
    if (origin && !allowed.includes(origin)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  const slug = process.env.APP_PREVIEW_ORG_SLUG;
  if (!slug || !/^[a-z0-9-]{3,64}$/.test(slug)) {
    return NextResponse.json({ error: "Preview workspace is not configured" }, { status: 503 });
  }
  try {
    const organization = await prisma.organization.upsert({
      where: { slug },
      create: { slug, name: process.env.APP_PREVIEW_ORG_NAME?.trim() || "Leadveyra Preview" },
      update: {},
      select: { id: true },
    });
    return await action(organization.id);
  } catch (error) {
    if (error instanceof InputError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("CRM database operation failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "CRM database is unavailable" }, { status: 503 });
  }
}
