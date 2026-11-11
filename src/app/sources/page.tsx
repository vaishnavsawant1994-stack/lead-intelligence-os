"use client";
export default function SourcesPage() {
  const sources = [{ name: "Forbes", people: 856, contacted: 67, converted: 8, rate: 11.9 }];
  return <div><h1 className="page-title mb-4">Source Performance</h1><div className="card"><table className="table"><thead><tr><th>Source</th><th>People</th><th>Contacted</th><th>Converted</th><th>Rate</th></tr></thead><tbody>{sources.map(s => <tr key={s.name}><td>{s.name}</td><td>{s.people}</td><td>{s.contacted}</td><td>{s.converted}</td><td><span className="badge badge-success">{s.rate}%</span></td></tr>)}</tbody></table></div></div>;
}
