"use client";
export default function CommitteePage() {
  const stakeholders = [{ name: "Arjun Mehta", role: "Decision Maker", status: "Engaged" }, { name: "Priya Patel", role: "Technical", status: "Aware" }];
  return <div><h1 className="page-title mb-4">Buying Committee</h1><div className="card p-5"><h3 className="font-medium mb-4">TechNova Partnership</h3>{stakeholders.map(s => <div key={s.name} className="flex justify-between py-2"><div><div className="font-medium text-sm">{s.name}</div><div className="text-xs text-slate-500">{s.role}</div></div><span className={`badge ${s.status === "Engaged" ? "badge-success" : "badge-warning"}`}>{s.status}</span></div>)}</div></div>;
}
