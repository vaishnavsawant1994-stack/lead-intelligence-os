import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm } from "@/lib/crm";
import { readBoundedCsv, parseCsv, validateContactsCsv } from "@/lib/csv-import";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Strictly a dry run. No Person, Company, ImportBatch or other record is created.
export async function POST(request: Request) {
  return runCrm(async (organizationId) => {
    const source = await readBoundedCsv(request);
    const { checked, issues } = validateContactsCsv(parseCsv(source));
    const emails = [...new Set(checked.map((row) => row.email).filter((e): e is string => !!e))];
    if (emails.length) {
      const matches = await prisma.person.findMany({
        where: {
          organizationId,
          OR: emails.map((email) => ({ email: { equals: email, mode: "insensitive" as const } })),
        },
        select: { email: true },
      });
      const existing = new Set(matches.map((p) => p.email?.toLowerCase()).filter(Boolean));
      for (const row of checked) {
        if (row.email && existing.has(row.email)) {
          row.valid = false;
          issues.push({ row: row.row, code: "already_exists", message: "Email already exists in this workspace" });
        }
      }
    }
    const invalid = checked.filter((row) => !row.valid).length;
    return NextResponse.json({
      mode: "validation-only",
      persisted: false,
      summary: { total: checked.length, valid: checked.length - invalid, invalid, issues: issues.length },
      issues: issues.slice(0, 100),
      warning: "No contacts were imported or stored. Preview validation does not establish consent or authorize bulk ingestion.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
