"use client";
import { useState } from "react";
export default function AIReply() {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const generate = async () => { setLoading(true); await new Promise(r => setTimeout(r, 800)); setReply("Thank you for your email. I would be happy to discuss this further. Would next week work for a call?\n\nBest regards"); setLoading(false); };
  return (<div className="bg-white border rounded-xl p-6"><h3 className="font-semibold mb-4">AI Reply</h3><button onClick={generate} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">{loading ? "Generating..." : "Generate Reply"}</button>{reply && <textarea value={reply} onChange={e => setReply(e.target.value)} rows={5} className="w-full border rounded-lg p-3 text-sm mt-4" />}</div>);
}
