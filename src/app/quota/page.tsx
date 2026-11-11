"use client";
export default function QuotaPage() {
  const team = [{ name: "You", target: 50, actual: 45 }, { name: "Sarah", target: 40, actual: 38 }];
  return <div><h1 className="page-title mb-4">Quota</h1><div className="space-y-4">{team.map(t => <div key={t.name} className="card p-5"><div className="flex justify-between mb-2"><span className="font-medium">{t.name}</span><span>{t.actual}/{t.target}</span></div><div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{width: `${t.actual/t.target*100}%`}} /></div></div>)}</div></div>;
}
