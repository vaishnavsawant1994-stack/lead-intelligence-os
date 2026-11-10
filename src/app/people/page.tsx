"use client";
import { useState } from "react";
import Link from "next/link";
const people = [{ id: "1", name: "Arjun Mehta", title: "Founder", company: "TechNova", tier: "A", status: "Contacted", linkedin: "linkedin.com/in/arjunmehta" }, { id: "2", name: "Sophia Reynolds", title: "Director", company: "Horizon", tier: "A", status: "Replied", linkedin: "" }];
export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const filtered = people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (<div><h1 className="page-title mb-4">People</h1><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="input w-64 mb-4" /><div className="card"><table className="table"><thead><tr><th>Name</th><th>Company</th><th>Tier</th><th>LinkedIn</th></tr></thead><tbody>{filtered.map(p => <tr key={p.id}><td><Link href={`/people/${p.id}`} className="font-medium text-indigo-600">{p.name}</Link></td><td>{p.company}</td><td><span className="badge badge-warning">{p.tier}</span></td><td>{p.linkedin ? <a href={`https://${p.linkedin}`} target="_blank" className="text-indigo-600 text-sm">View</a> : <span className="text-slate-300">—</span>}</td></tr>)}</tbody></table></div></div>);
}
