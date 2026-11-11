"use client";
export default function SavedSearchesPage() {
  const searches = [{ name: "High Value India", query: "tier:A country:India" }, { name: "Recent Activity", query: "activity:7d" }];
  return <div><h1 className="page-title mb-4">Saved Searches</h1><div className="space-y-4">{searches.map(s => <div key={s.name} className="card p-5 flex justify-between"><div><div className="font-medium">{s.name}</div><div className="text-sm text-slate-500 font-mono">{s.query}</div></div><button className="btn btn-secondary text-sm">Run</button></div>)}</div></div>;
}
