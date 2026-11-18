import { NextResponse } from "next/server";
import { runCrm, jsonBody, requiredString, optionalString } from "@/lib/crm";

export async function POST(request: Request) {
  return runCrm(async () => {
    const body = await jsonBody(request);
    const person = body.person;
    if (!person || typeof person !== "object" || Array.isArray(person)) return NextResponse.json({ error: "Person details are required" }, { status: 400 });
    const p = person as Record<string, unknown>;
    const name = requiredString(p.name, "Name", 100).replace(/[\r\n]+/g, " ");
    const company = optionalString(p.company, "Company", 150)?.replace(/[\r\n]+/g, " ") || "your organization";
    const source = optionalString(p.source, "Source", 150)?.replace(/[\r\n]+/g, " ");
    const intro = source ? `I came across your work through ${source}. ` : "";
    return NextResponse.json({
      drafts: [
        `Subject: Introduction\n\nHello ${name},\n\n${intro}I'd be interested in learning more about your work at ${company}.\n\nBest regards`,
        `Subject: A quick introduction\n\nHi ${name},\n\nI'm reaching out regarding ${company}. Would you be open to a conversation?\n\nBest`,
      ],
      mode: "local-template", generatedByAI: false, sent: false,
      warning: "Editable templates only. No AI provider was called and no email was sent.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
