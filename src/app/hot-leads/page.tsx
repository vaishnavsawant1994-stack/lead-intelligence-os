"use client";
export default function HotLeadsPage() {
  const leads = [{ name: "Arjun Mehta", score: 92, company: "TechNova" }, { name: "Sophia Reynolds", score: 88, company: "Horizon" }];
  return <div><h1 className="page-title mb-4">Hot Leads</h1><div className="card"><table className="table"><thead><tr><th>Name</th><th>Company</th><th>Score</th></tr></thead><tbody>{leads.map(l => <tr key={l.name}><td>{l.name}</td><td>{l.company}</td><td className="font-bold text-emerald-600">{l.score}</td></tr>)}</tbody></table></div></div>;
}
