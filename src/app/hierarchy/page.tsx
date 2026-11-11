"use client";
export default function HierarchyPage() {
  const companies = [{ name: "TechNova Holdings", children: ["TechNova India", "TechNova US"] }];
  return (<div><h1 className="page-title mb-4">Account Hierarchy</h1><div className="space-y-4">{companies.map(c => <div key={c.name} className="card p-5"><div className="font-medium mb-2">{c.name}</div>{c.children.map(ch => <div key={ch} className="ml-4 text-sm text-slate-600">└ {ch}</div>)}</div>)}</div></div>);
}
