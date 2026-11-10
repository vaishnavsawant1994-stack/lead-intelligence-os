import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const SERPER_API_KEY = process.env.SERPER_API_KEY;

    if (!SERPER_API_KEY) {
      return NextResponse.json({
        demo: true,
        results: [
          { title: query + " - LinkedIn", link: "https://linkedin.com", snippet: "Profile for " + query },
          { title: query + " news", link: "https://news.google.com", snippet: "Recent news" },
        ],
      });
    }

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 5 }),
    });
    const data = await response.json();
    const results = (data.organic || []).map((r: any) => ({ title: r.title, link: r.link, snippet: r.snippet }));
    return NextResponse.json({ results, demo: false });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
