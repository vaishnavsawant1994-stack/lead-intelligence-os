import { NextResponse } from "next/server";
const PATTERNS = [{ format: "{first}", weight: 0.35 }, { format: "{first}.{last}", weight: 0.30 }, { format: "{f}{last}", weight: 0.15 }];
const KNOWN: Record<string, string> = { "technova": "technova.com", "horizon capital": "horizoncap.com" };
function gen(p: string, f: string, l: string, d: string) { return p.replace("{first}", f.toLowerCase()).replace("{last}", l.toLowerCase()).replace("{f}", f[0]?.toLowerCase() || "") + "@" + d; }
export async function POST(req: Request) {
  const { firstName, lastName, company, domain } = await req.json();
  const d = domain || KNOWN[company?.toLowerCase()] || company?.toLowerCase().replace(/[^a-z]/g, "") + ".com";
  const results = PATTERNS.map(p => ({ email: gen(p.format, firstName, lastName || "", d), confidence: Math.round(p.weight * 100) }));
  return NextResponse.json({ domain: d, results });
}
