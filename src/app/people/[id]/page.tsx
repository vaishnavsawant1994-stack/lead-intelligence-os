"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
const peopleData: Record<string, any> = { "1": { name: "Arjun Mehta", title: "Founder", company: "TechNova", email: "arjun@technova.com", tier: "A", status: "Contacted" } };
export default function PersonDetail() {
  const { id } = useParams();
  const person = peopleData[id as string] || peopleData["1"];
  const [bounced, setBounced] = useState(false);
  useEffect(() => { if (person.email) fetch(`/api/bounce?email=${person.email}`).then(r => r.json()).then(d => setBounced(d.bounced)); }, [person.email]);
  return (<div><Link href="/people" className="text-sm text-slate-500">← Back</Link><div className="flex gap-4 mt-4"><div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center font-bold">{person.name[0]}</div><div><h1 className="text-2xl font-bold">{person.name}</h1><p className="text-slate-500">{person.title} at {person.company}</p><div className="flex gap-2 mt-2"><span className="badge badge-warning">Tier {person.tier}</span>{bounced ? <span className="badge badge-danger">Bounced</span> : <span className="badge badge-success">Valid</span>}</div></div></div>{bounced && <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">This email has bounced.</div>}</div>);
}
