"use client";
export default function DealAgingPage() {
  const deals = [{ name: "TechNova", stage: "Negotiation", days: 45, status: "At risk" }];
  return (<div><h1 className="page-title mb-4">Deal Aging</h1><div className="card"><table className="table"><thead><tr><th>Deal</th><th>Days</th><th>Status</th></tr></thead><tbody>{deals.map(d => <tr key={d.name}><td>{d.name}</td><td>{d.days}</td><td><span className="badge badge-danger">{d.status}</span></td></tr>)}</tbody></table></div></div>);
}
