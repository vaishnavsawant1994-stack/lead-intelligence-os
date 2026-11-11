"use client";
export default function SalesCyclePage() {
  const stages = [{ stage: "New → Contacted", avg: 3 }, { stage: "Contacted → Qualified", avg: 7 }, { stage: "Qualified → Close", avg: 35 }];
  return <div><h1 className="page-title mb-4">Sales Cycle</h1><div className="space-y-4">{stages.map(s => <div key={s.stage} className="card p-5"><div className="flex justify-between mb-2"><span className="font-medium">{s.stage}</span><span>{s.avg} days</span></div><div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{width: `${s.avg/45*100}%`}} /></div></div>)}</div></div>;
}
