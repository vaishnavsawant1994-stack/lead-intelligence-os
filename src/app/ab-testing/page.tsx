"use client";
export default function ABTestingPage() {
  const tests = [{ name: "Subject line test", a: "Quick question", b: "Partnership idea", aOpens: 34, bOpens: 41, winner: "B" }];
  return <div><h1 className="page-title mb-4">A/B Testing</h1><div className="space-y-4">{tests.map(t => <div key={t.name} className="card p-5"><div className="flex justify-between mb-4"><h3 className="font-medium">{t.name}</h3><span className="badge badge-success">Winner: {t.winner}</span></div><div className="grid grid-cols-2 gap-4"><div className="p-4 bg-slate-50 rounded"><div className="text-sm">A: {t.a}</div><div className="text-2xl font-bold">{t.aOpens}%</div></div><div className="p-4 bg-slate-50 rounded"><div className="text-sm">B: {t.b}</div><div className="text-2xl font-bold">{t.bOpens}%</div></div></div></div>)}</div></div>;
}
