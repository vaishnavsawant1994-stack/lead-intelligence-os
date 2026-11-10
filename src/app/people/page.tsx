"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
const people = [{ id: "1", name: "Arjun Mehta", title: "Founder", company: "TechNova", tier: "A", status: "Contacted", email: "arjun@technova.com", country: "India" }, { id: "2", name: "Sophia Reynolds", title: "Director", company: "Horizon", tier: "A", status: "Replied", email: "sophia@horizon.com", country: "USA" }];
export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const [bounced, setBounced] = useState<Set<string>>(new Set());
  useEffect(() => { fetch("/api/webhooks/bounce").then(r => r.json()).then(d => setBounced(new Set(d.bounced || []))); }, []);
  const filtered = people.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (<div><div className="page-header"><h1 className="page-title">People</h1></div><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="input w-64 mb-4" /><div className="card"><table className="table"><thead><tr><th>Name</th><th>Company</th><th>Tier</th><th>Email Status</th></tr></thead><tbody>{filtered.map(p => <tr key={p.id}><td><Link href={`/people/${p.id}`} className="font-medium text-indigo-600">{p.name}</Link></td><td>{p.company}</td><td><span className="badge badge-warning">{p.tier}</span></td><td>{bounced.has(p.email) ? <span className="badge badge-danger">Bounced</span> : <span className="badge badge-success">Valid</span>}</td></tr>)}</tbody></table></div></div>);
}
