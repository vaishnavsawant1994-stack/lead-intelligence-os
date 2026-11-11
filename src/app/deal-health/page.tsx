"use client";
export default function DealHealthPage() {
  const deals = [{ name: "TechNova Partnership", health: 85 }];
  return (<div><h1 className="page-title mb-4">Deal Health</h1><div className="space-y-4">{deals.map(d => <div key={d.name} className="card p-5 flex justify-between"><span className="font-medium">{d.name}</span><span className="text-2xl font-bold text-emerald-600">{d.health}</span></div>)}</div></div>);
}
