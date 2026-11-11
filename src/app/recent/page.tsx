"use client";
export default function RecentPage() {
  const recent = [{ name: "Arjun Mehta", company: "TechNova", time: "5 min ago" }, { name: "Sophia Reynolds", company: "Horizon", time: "1 hour ago" }];
  return <div><h1 className="page-title mb-4">Recent</h1><div className="card divide-y">{recent.map(r => <div key={r.name} className="px-5 py-4 flex justify-between"><div><div className="font-medium text-sm">{r.name}</div><div className="text-xs text-slate-500">{r.company}</div></div><span className="text-xs text-slate-400">{r.time}</span></div>)}</div></div>;
}
