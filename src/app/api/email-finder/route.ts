import { NextResponse } from "next/server";
import { runCrm, jsonBody, requiredString, optionalString, InputError } from "@/lib/crm";

export const dynamic = "force-dynamic";
const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

function localPart(name: string): string {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function POST(request: Request) {
  return runCrm(async () => {
    const data = await jsonBody(request);
    const firstName = requiredString(data.firstName, "First name", 60);
    const lastName = optionalString(data.lastName, "Last name", 60) || "";
    const domain = requiredString(data.domain, "Email domain", 253).toLowerCase();
    if (!DOMAIN.test(domain)) throw new InputError("Enter a valid domain, such as example.com");
    const first = localPart(firstName);
    const last = localPart(lastName);
    if (!first || (lastName && !last)) throw new InputError("Names must contain usable Latin letters or digits");
    const candidates = [
      ...(last ? [`${first}.${last}`, `${first[0]}${last}`, `${first}${last}`] : []),
      first,
    ];
    const results = [...new Set(candidates)].map((part) => ({ email: `${part}@${domain}`, verified: false }));
    return NextResponse.json({
      domain, results, verified: false, mode: "unverified-patterns",
      warning: "These addresses are unverified guesses. No mailbox or address verification was performed. Do not contact people without appropriate permission.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  }, request);
}
