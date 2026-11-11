"use client";
export default function WinReasonsPage() {
  const reasons = [{ reason: "Good fit", count: 12, percent: 40 }, { reason: "Competitive pricing", count: 8, percent: 27 }];
  return <div><h1 className="page-title mb-4">Win Reasons</h1><div className="space-y-4">{reasons.map(r => <div key={r.reason} className="card p-5"><div className="flex justify-between mb-2"><span className="font-medium">{r.reason}</span><span>{r.percent}%</span></div><div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width: `${r.percent}%`}} /></div></div>)}</div></div>;
}
