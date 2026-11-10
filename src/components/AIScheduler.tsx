"use client";
import { useState } from "react";
export default function AIScheduler() {
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [datetime, setDatetime] = useState("");
  const schedule = () => { if (draft && datetime) { setScheduled([...scheduled, { draft, datetime }]); setDraft(""); } };
  return (<div className="bg-white border rounded-xl p-6"><h3 className="font-semibold mb-4">Schedule Email</h3><textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Email content" rows={3} className="w-full border rounded-lg p-3 text-sm mb-3" /><input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} className="border rounded-lg px-3 py-2 text-sm mb-3" /><button onClick={schedule} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Schedule</button>{scheduled.length > 0 && <div className="mt-4 text-sm">{scheduled.length} scheduled</div>}</div>);
}
