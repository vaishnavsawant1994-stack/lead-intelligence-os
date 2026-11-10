import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const { person, tone } = await request.json();
  const p = person || { name: "Arjun", company: "TechNova", source: "Magazine" };
  const drafts = [
    `Subject: Connecting after ${p.source}\n\nDear ${p.name},\n\nI was impressed by your work at ${p.company}.\n\nBest regards`,
    `Subject: Your work at ${p.company}\n\nHi ${p.name},\n\nWould love to connect.\n\nBest`,
  ];
  return NextResponse.json({ drafts });
}
