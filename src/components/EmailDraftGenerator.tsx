"use client";

import { useState } from "react";

export default function EmailDraftGenerator({ profile }: { profile: any }) {
  const [drafts, setDrafts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [sent, setSent] = useState(false);

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const a = profile.achievements?.slice(0, 2).join(" and ") || "your work";
    setDrafts([
      `Subject: Connecting after ${profile.source}\n\nDear ${profile.name},\n\nI was impressed by ${a}.\n\nWould you be open to a conversation?\n\nBest regards`,
      `Subject: Your work at ${profile.company}\n\nHi ${profile.name},\n\n${a} is remarkable.\n\nOpen to a quick call?\n\nBest`,
      `Subject: Quick intro\n\nHi ${profile.name},\n\n15 minutes next week?\n\nThanks`,
    ]);
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <button onClick={generate} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm mb-4">{loading ? "Generating..." : "Generate 3 Drafts"}</button>
      {drafts.length > 0 && (
        <>
          <div className="flex gap-2 mb-3">{drafts.map((_, i) => <button key={i} onClick={() => setSelected(i)} className={`px-3 py-1 text-sm rounded ${selected === i ? "bg-indigo-100" : "bg-slate-100"}`}>Draft {i+1}</button>)}</div>
          <textarea value={drafts[selected]} onChange={e => { const d = [...drafts]; d[selected] = e.target.value; setDrafts(d); }} rows={10} className="w-full border rounded-lg p-3 text-sm" />
          <button onClick={() => setSent(true)} className="mt-3 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm">{sent ? "Sent!" : "Send Now"}</button>
        </>
      )}
    </div>
  );
}
