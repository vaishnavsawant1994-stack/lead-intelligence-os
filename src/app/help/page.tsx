"use client";
import { useState } from "react";
export default function HelpPage() {
  const [search, setSearch] = useState("");
  const articles = [{ title: "Getting started", category: "Basics" }, { title: "Importing data", category: "Data" }];
  const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
  return (<div><h1 className="page-title mb-4">Help Center</h1><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="input w-64 mb-4" /><div className="space-y-3">{filtered.map(a => <div key={a.title} className="card p-4 flex justify-between"><span>{a.title}</span><span className="badge badge-neutral">{a.category}</span></div>)}</div></div>);
}
