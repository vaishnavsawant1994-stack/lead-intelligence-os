import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm } from "@/lib/crm";
import { csvDocument } from "@/lib/csv";

export const dynamic = "force-dynamic";
const MAX_EXPORT_RECORDS = 5000;
const kinds = ["people", "companies", "tasks", "deals"] as const;

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const entity = new URL(request.url).searchParams.get("entity");
    if (!kinds.some((kind) => kind === entity)) {
      return NextResponse.json({ error: "Choose people, companies, tasks or deals" }, { status: 400 });
    }

    let headers: string[];
    let rows: unknown[][];
    if (entity === "people") {
      const items = await prisma.person.findMany({
        where: { organizationId },
        include: { company: { select: { name: true } } },
        orderBy: { createdAt: "asc" }, take: MAX_EXPORT_RECORDS + 1,
      });
      headers = ["Name", "Title", "Email", "Phone", "Company", "Status", "Notes", "Created At"];
      rows = items.map((p) => [p.name, p.title, p.email, p.phone, p.company?.name, p.status, p.notes, p.createdAt.toISOString()]);
    } else if (entity === "companies") {
      const items = await prisma.company.findMany({
        where: { organizationId },
        orderBy: { createdAt: "asc" }, take: MAX_EXPORT_RECORDS + 1,
      });
      headers = ["Name", "Industry", "Website", "Created At"];
      rows = items.map((c) => [c.name, c.industry, c.website, c.createdAt.toISOString()]);
    } else if (entity === "tasks") {
      const items = await prisma.task.findMany({
        where: { organizationId },
        orderBy: { createdAt: "asc" }, take: MAX_EXPORT_RECORDS + 1,
      });
      headers = ["Title", "Completed", "Due Date", "Created At"];
      rows = items.map((t) => [t.title, t.completed ? "Yes" : "No", t.dueAt?.toISOString().slice(0, 10), t.createdAt.toISOString()]);
    } else {
      const items = await prisma.deal.findMany({
        where: { organizationId },
        orderBy: { createdAt: "asc" }, take: MAX_EXPORT_RECORDS + 1,
      });
      headers = ["Name", "Value", "Stage", "Created At"];
      rows = items.map((d) => [d.name, d.value.toString(), d.stage, d.createdAt.toISOString()]);
    }

    if (rows.length > MAX_EXPORT_RECORDS) {
      return NextResponse.json({ error: "Export exceeds the 5000-record private-preview limit. No partial export was generated." }, { status: 413 });
    }
    const filename = `leadveyra-${entity}-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csvDocument(headers, rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  });
}
