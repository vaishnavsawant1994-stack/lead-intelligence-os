"use client";
export default function ViewsPage() {
  const views = [{ name: "All People", filters: "None", count: 9746 }, { name: "Tier A Only", filters: "Tier = A", count: 464 }];
  return <div><h1 className="page-title mb-4">Saved Views</h1><div className="space-y-4">{views.map(v => <div key={v.name} className="card p-5 flex justify-between"><div><div className="font-medium">{v.name}</div><div className="text-sm text-slate-500">{v.filters}</div></div><span className="text-2xl font-bold">{v.count.toLocaleString()}</span></div>)}</div></div>;
}
