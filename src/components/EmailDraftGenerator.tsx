"use client";

import { useState } from "react";

export default function EmailDraftGenerator() {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setDraft(`Subject: Connecting after your feature\n\nDear Arjun Mehta,\n\nI recently came across your feature and was impressed by your work as Founder & CEO at TechNova.\n\nWould you be open to a brief conversation?\n\nBest regards`);
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="font-semibold mb-4">AI Email Draft</h3>
      <button onClick={generate} disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium mb-4">
        {loading ? "Generating..." : "Generate Draft from Profile"}
      </button>
      {draft && <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={10} className="w-full border rounded-lg p-3 text-sm" />}
    </div>
  );
}
