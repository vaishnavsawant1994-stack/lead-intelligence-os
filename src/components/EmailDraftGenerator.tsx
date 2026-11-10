"use client";

import { useState } from "react";

const SAMPLE_PROFILE = {
  name: "Arjun Mehta",
  title: "Founder & CEO",
  company: "TechNova",
  tier: "A",
  source: "The Entrepreneurial Chronicle",
  achievements: ["Raised $2.5M seed", "Featured in 3 publications", "Grew team 5 to 40"],
  recentNews: ["Expanding into Southeast Asia"],
};

export default function EmailDraftGenerator() {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setDraft(`Subject: Impressed by your work at TechNova\n\nDear Arjun Mehta,\n\nI came across your feature and learned about your achievements including raising $2.5M and growing your team from 5 to 40.\n\nWould you be open to a brief conversation?\n\nBest regards`);
    setLoading(false);
  };

  const send = async () => {
    await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: "test@example.com", subject: "Intro", body: draft }) });
    setSent(true);
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold mb-4">AI Email Draft</h3>
      <button onClick={generate} disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium mb-4">{loading ? "Generating..." : "Generate Full Draft"}</button>
      {draft && (
        <>
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={12} className="w-full border rounded-lg p-3 text-sm" />
          <button onClick={send} className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium">{sent ? "Sent!" : "Send Email"}</button>
        </>
      )}
    </div>
  );
}
