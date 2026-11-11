"use client";
export default function FunnelPage() {
  const stages = [{ name: "Total", count: 9746 }, { name: "Contacted", count: 1247 }, { name: "Won", count: 12 }];
  return (<div><h1 className="page-title mb-4">Funnel Analysis</h1><div className="space-y-4">{stages.map(s => <div key={s.name} className="card p-5"><div className="flex justify-between"><span className="font-medium">{s.name}</span><span>{s.count.toLocaleString()}</span></div></div>)}</div></div>);
}
