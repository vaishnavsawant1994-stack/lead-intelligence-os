import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runCrm } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return runCrm(async (organizationId) => {
    const query = new URL(request.url).searchParams.get("q")?.trim() || "";
    if (query.length < 2 || query.length > 80) {
      return NextResponse.json({ error: "Search must be between 2 and 80 characters" }, { status: 400 });
    }
    const where = { organizationId, name: { contains: query, mode: "insensitive" as const } };
    const [people, companies] = await Promise.all([
      prisma.person.findMany({
        where, orderBy: { name: "asc" }, take: 8,
        select: { id: true, name: true, title: true, company: { select: { name: true } } },
      }),
      prisma.company.findMany({
        where, orderBy: { name: "asc" }, take: 8,
        select: { id: true, name: true, industry: true },
      }),
    ]);
    return NextResponse.json({
      results: [
        ...people.map((person) => ({
          kind: "person" as const, id: person.id, title: person.name,
          description: person.company?.name || person.title || "Person",
          href: `/people/${person.id}`,
        })),
        ...companies.map((company) => ({
          kind: "company" as const, id: company.id, title: company.name,
          description: company.industry || "Company",
          href: `/companies/${company.id}`,
        })),
      ],
    }, { headers: { "Cache-Control": "private, no-store" } });
  });
}
