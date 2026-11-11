"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
const person = { name: "Arjun Mehta", title: "Founder", company: "TechNova", email: "arjun@technova.com", tier: "A", status: "Contacted", leadScore: 87, phone: "+91 98765", linkedin: "linkedin.com/in/arjun" };
export default function PersonDetail() {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "activity", "emails", "calls", "notes", "research"];
  return (<div><Link href="/people" className="text-sm text-slate-500">← Back</Link><div className="card p-6 mt-4 mb-6"><div className="flex justify-between"><div><h1 className="text-2xl font-bold">{person.name}</h1><p className="text-slate-500">{person.title} at {person.company}</p></div><div className="text-right"><div className="text-3xl font-bold text-indigo-600">{person.leadScore}</div><div className="text-xs text-slate-500">Score</div></div></div></div><div className="border-b mb-6 flex gap-6">{tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`pb-3 text-sm capitalize ${tab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"}`}>{t}</button>)}</div>{tab === "overview" && <div className="card p-5"><div className="text-sm">Email: {person.email}</div><div className="text-sm">Phone: {person.phone}</div></div>}</div>);
}
