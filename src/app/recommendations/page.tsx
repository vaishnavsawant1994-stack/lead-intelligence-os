"use client";
export default function RecommendationsPage() {
  const recs = [{ person: "Arjun Mehta", action: "Send follow-up", reason: "Opened email, no reply" }];
  return (<div><h1 className="page-title mb-4">Smart Recommendations</h1><div className="space-y-4">{recs.map(r => <div key={r.person} className="card p-5"><div className="font-medium">{r.person}</div><div className="text-sm text-indigo-600">{r.action}</div><div className="text-xs text-slate-500">{r.reason}</div></div>)}</div></div>);
}
