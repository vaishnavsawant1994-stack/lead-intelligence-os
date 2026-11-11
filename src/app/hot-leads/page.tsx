"use client";
export default function HotLeadsPage() {
  const leads = [{ name: "Arjun Mehta", score: 92, reason: "Opened 3 emails" }];
  return (<div><h1 className="page-title mb-4">Hot Leads</h1><div className="space-y-4">{leads.map(l => <div key={l.name} className="card p-5 flex justify-between"><div><div className="font-medium">{l.name}</div><div className="text-xs text-slate-500">{l.reason}</div></div><div className="text-2xl font-bold text-emerald-600">{l.score}</div></div>)}</div></div>);
}
