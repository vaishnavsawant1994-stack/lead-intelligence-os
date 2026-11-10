"use client";
import { useState } from "react";
export default function EmailFinderApp() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [company, setCompany] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const find = async () => {
    setLoading(true);
    const res = await fetch("/api/email-finder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ firstName: first, lastName: last, company }) });
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };
  return (<div className="min-h-screen bg-slate-50 py-12"><div className="max-w-2xl mx-auto px-6"><h1 className="text-3xl font-bold text-center mb-8">Email Finder</h1><div className="bg-white rounded-2xl shadow p-6 space-y-4"><input value={first} onChange={e => setFirst(e.target.value)} placeholder="First name" className="w-full border rounded-xl px-4 py-3" /><input value={last} onChange={e => setLast(e.target.value)} placeholder="Last name" className="w-full border rounded-xl px-4 py-3" /><input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className="w-full border rounded-xl px-4 py-3" /><button onClick={find} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium">{loading ? "Searching..." : "Find Email"}</button></div>{results.length > 0 && <div className="bg-white rounded-2xl shadow mt-6 divide-y">{results.map((r, i) => <div key={i} className="px-6 py-4 flex justify-between"><span>{r.email}</span><span className="text-emerald-600">{r.confidence}%</span></div>)}</div>}</div></div>);
}
