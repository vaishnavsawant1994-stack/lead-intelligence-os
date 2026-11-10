import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const { firstName, lastName, domain } = await request.json();
  const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
  if (!HUNTER_API_KEY) return NextResponse.json({ demo: true, emails: [{ email: firstName.toLowerCase() + "@" + domain, score: 95 }] });
  const res = await fetch(`https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${firstName}&last_name=${lastName}&api_key=${HUNTER_API_KEY}`);
  const data = await res.json();
  return NextResponse.json({ demo: false, emails: data.data?.email ? [{ email: data.data.email, score: data.data.score }] : [] });
}
