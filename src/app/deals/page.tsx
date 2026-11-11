"use client";
export default function DealsPage() {
  const deals = [{ name: "TechNova Partnership", value: 25000, stage: "Negotiation" }];
  return (<div><h1 className="page-title mb-4">Deals</h1><div className="card"><table className="table"><thead><tr><th>Deal</th><th>Stage</th><th>Value</th></tr></thead><tbody>{deals.map(d => <tr key={d.name}><td>{d.name}</td><td>{d.stage}</td><td>${d.value.toLocaleString()}</td></tr>)}</tbody></table></div></div>);
}
