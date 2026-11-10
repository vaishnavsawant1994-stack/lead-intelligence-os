"use client";
import { useState } from "react";
const DUPLICATES = [{ id: "1", name: "Arjun Mehta", matches: ["Arjun M."], company: "TechNova", confidence: 92 }];
export default function DuplicatesPage() {
  const [merged, setMerged] = useState<string[]>([]);
  return (<div><h1 className="page-title mb-4">Duplicate Detection</h1><div className="space-y-4">{DUPLICATES.filter(d => !merged.includes(d.id)).map(d => <div key={d.id} className="card p-5 flex justify-between"><div><div className="font-medium">{d.name}</div><div className="text-sm text-slate-500">{d.company}</div></div><button onClick={() => setMerged([...merged, d.id])} className="btn btn-primary text-sm">Merge</button></div>)}</div></div>);
}
