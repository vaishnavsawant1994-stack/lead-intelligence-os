"use client";
import { useState } from "react";
import Link from "next/link";
const people = [{ id: "1", name: "Arjun Mehta", title: "Founder", company: "TechNova", tier: "A", status: "Contacted" }, { id: "2", name: "Sophia Reynolds", title: "Director", company: "Horizon", tier: "A", status: "Replied" }];
export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const filtered = people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (<div><div className="page-header flex justify-between"><div><h1 className="page-title">People</h1><p className="page-subtitle">{filtered.length} contacts</p></div><Link href="/people/new" className="btn btn-primary">+ Add</Link></div><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="input w-64 mb-4" /><div className="card"><table className="table"><thead><tr><th>Name</th><th>Company</th><th>Tier</th><th>Status</th></tr></thead><tbody>{filtered.map(p => <tr key={p.id}><td><Link href={`/people/${p.id}`} className="font-medium text-indigo-600">{p.name}</Link><div className="text-xs text-slate-500">{p.title}</div></td><td>{p.company}</td><td><span className="badge badge-warning">{p.tier}</span></td><td>{p.status}</td></tr>)}</tbody></table></div></div>);
}
