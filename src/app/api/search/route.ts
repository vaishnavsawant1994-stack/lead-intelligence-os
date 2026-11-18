import { NextResponse } from "next/server";
import { runCrm, jsonBody, requiredString } from "@/lib/crm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return runCrm(async () => {
    const body = await jsonBody(request);
    const query = requiredString(body.query, "Search query", 160);
    if (query.length < 2) return NextResponse.json({ error: "Search query is too short" }, { status: 400 });
    const key = process.env.SERPER_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Real web search is not configured. No demonstration results were returned." }, { status: 503 });
    }
    let response: Response;
    try {
      response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, num: 5 }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
    } catch {
      return NextResponse.json({ error: "Search provider temporarily unavailable" }, { status: 502 });
    }
    if (!response.ok) return NextResponse.json({ error: "Search provider rejected the request" }, { status: 502 });
    const data: unknown = await response.json().catch(() => null);
    const organic = data && typeof data === "object" && "organic" in data && Array.isArray(data.organic) ? data.organic : [];
    const results = organic.slice(0, 5).filter((item: unknown): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item: Record<string, unknown>) => ({
        title: typeof item.title === "string" ? item.title : "",
        link: typeof item.link === "string" ? item.link : "",
        snippet: typeof item.snippet === "string" ? item.snippet : "",
      }));
    return NextResponse.json({ results, demo: false }, { headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
