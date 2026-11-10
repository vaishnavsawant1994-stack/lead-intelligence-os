"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const DATA = [{ type: "person", name: "Arjun Mehta", detail: "TechNova", href: "/people/1" }, { type: "page", name: "Pipeline", detail: "View pipeline", href: "/pipeline" }];
export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const results = DATA.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));
  return (<div className="relative"><input value={query} onChange={e => { setQuery(e.target.value); setOpen(true); }} placeholder="Search..." className="w-64 pl-3 pr-3 py-2 text-sm border rounded-lg" />{open && results.length > 0 && <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg w-64 z-50">{results.map(r => <button key={r.name} onClick={() => { router.push(r.href); setOpen(false); setQuery(""); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm">{r.name}</button>)}</div>}</div>);
}
