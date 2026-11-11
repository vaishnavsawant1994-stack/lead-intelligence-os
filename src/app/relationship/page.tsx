"use client";
export default function RelationshipPage() {
  const contacts = [{ name: "Arjun Mehta", strength: 85, lastTouch: "2 days ago" }, { name: "Sophia Reynolds", strength: 72, lastTouch: "1 week ago" }];
  return <div><h1 className="page-title mb-4">Relationship Strength</h1><div className="space-y-4">{contacts.map(c => <div key={c.name} className="card p-5 flex justify-between"><div><div className="font-medium">{c.name}</div><div className="text-sm text-slate-500">Last touch: {c.lastTouch}</div></div><span className="text-2xl font-bold text-emerald-600">{c.strength}</span></div>)}</div></div>;
}
