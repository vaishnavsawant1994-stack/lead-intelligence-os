"use client";
export default function ActivityGoalsPage() {
  const goals = [{ name: "Calls", target: 20, current: 15 }];
  return (<div><h1 className="page-title mb-4">Activity Goals</h1><div className="grid md:grid-cols-3 gap-4">{goals.map(g => <div key={g.name} className="card p-5"><div className="text-sm text-slate-500">{g.name}</div><div className="text-3xl font-bold">{g.current}/{g.target}</div></div>)}</div></div>);
}
