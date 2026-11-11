"use client";
export default function PinnedPage() {
  const pinned = [{ name: "Arjun Mehta", company: "TechNova", reason: "Hot lead" }];
  return <div><h1 className="page-title mb-4">Pinned</h1><div className="space-y-4">{pinned.map(p => <div key={p.name} className="card p-5 flex justify-between"><div><div className="font-medium">{p.name}</div><div className="text-sm text-slate-500">{p.company}</div></div><span className="badge badge-warning">{p.reason}</span></div>)}</div></div>;
}
