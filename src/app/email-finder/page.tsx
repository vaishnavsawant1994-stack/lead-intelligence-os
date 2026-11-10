"use client";
import { useState } from "react";
export default function EmailFinderPage() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [company, setCompany] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const find = async () => {
    const domain = company.toLowerCase().replace(/\s/g, "") + ".com";
    setResults([{ email: first.toLowerCase() + "@" + domain, confidence: 95 }, { email: first.toLowerCase() + "." + last.toLowerCase() + "@" + domain, confidence: 85 }]);
  };
  return (<div className="max-w-2xl"><h1 className="page-title mb-4">Email Finder</h1><div className="card p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><input value={first} onChange={e => setFirst(e.target.value)} placeholder="First name" className="input" /><input value={last} onChange={e => setLast(e.target.value)} placeholder="Last name" className="input" /><input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className="input" /></div><button onClick={find} className="btn btn-primary w-full">Find Email</button></div>{results.length > 0 && <div className="card mt-4 divide-y">{results.map((r, i) => <div key={i} className="px-4 py-3 flex justify-between"><span className="text-sm">{r.email}</span><span className="badge badge-success">{r.confidence}%</span></div>)}</div>}</div>);
}
