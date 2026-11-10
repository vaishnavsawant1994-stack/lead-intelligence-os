import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.log("Email would be sent:", { to, subject, body });
      return NextResponse.json({ success: true, message: "Email logged (add RESEND_API_KEY to send for real)", demo: true });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lead Intelligence OS <noreply@yourdomain.com>",
        to: [to],
        subject,
        html: `<div style="font-family: sans-serif; line-height: 1.5;">${body.replace(/\n/g, "<br>")}</div>`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
