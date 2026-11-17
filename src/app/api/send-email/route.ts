import { NextResponse } from "next/server";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));

export async function POST(request: Request) {
  // Auth is enforced by middleware. Never enable outbound mail for an unqualified demo.
  if (process.env.EMAIL_SENDING_ENABLED !== "true") return NextResponse.json({ error: "Outbound email is disabled" }, { status: 503 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return NextResponse.json({ error: "Mail provider not configured" }, { status: 503 });

  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!payload || typeof payload !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { to, subject, body } = payload as Record<string, unknown>;
  if (typeof to !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || typeof subject !== "string" || subject.length < 1 || subject.length > 200 || typeof body !== "string" || body.length < 1 || body.length > 20000) {
    return NextResponse.json({ error: "Invalid email fields" }, { status: 400 });
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html: `<div style="font-family: sans-serif; line-height: 1.5;">${escapeHtml(body).replace(/\n/g, "<br>")}</div>` }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: "Email provider rejected the request" }, { status: 502 });
    return NextResponse.json({ success: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "Email provider unavailable" }, { status: 502 });
  }
}
