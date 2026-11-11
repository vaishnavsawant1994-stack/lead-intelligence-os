"use client";
export default function SavedSearchesPage() {
  const searches = [{ name: "Tier A in India", query: "tier:A country:India", count: 234 }];
  return (<div><h1 className="page-title mb-4">Saved Searches</h1><div className="space-y-4">{searches.map(s => <div key={s.name} className="card p-5 flex justify-between"><div><div className="font-medium">{s.name}</div><div className="text-sm font-mono text-slate-500">{s.query}</div></div><div className="text-xl font-bold">{s.count}</div></div>)}</div></div>);
}
