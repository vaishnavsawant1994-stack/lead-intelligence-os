"use client";
export default function AIScoringPage() {
  const leads = [{ name: "Arjun Mehta", score: 92 }, { name: "Sophia Reynolds", score: 78 }];
  return (<div><h1 className="page-title mb-4">AI Lead Scoring</h1><div className="space-y-4">{leads.map(l => <div key={l.name} className="card p-5 flex justify-between"><span className="font-medium">{l.name}</span><span className="text-2xl font-bold text-emerald-600">{l.score}</span></div>)}</div></div>);
}
