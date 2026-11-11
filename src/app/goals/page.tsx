"use client";
export default function GoalsPage() {
  const goals = [{ name: "Q4 Outreach", target: 500, current: 342 }];
  return (<div><h1 className="page-title mb-4">Goals</h1><div className="space-y-4">{goals.map(g => <div key={g.name} className="card p-5"><div className="flex justify-between mb-2"><span className="font-medium">{g.name}</span><span>{g.current}/{g.target}</span></div><div className="h-2 bg-slate-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{width: `${g.current/g.target*100}%`}} /></div></div>)}</div></div>);
}
