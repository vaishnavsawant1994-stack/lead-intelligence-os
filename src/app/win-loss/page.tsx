"use client";
export default function WinLossPage() {
  const deals = [{ name: "TechNova", outcome: "Won", value: 25000 }];
  return (<div><h1 className="page-title mb-4">Win/Loss Analysis</h1><div className="card"><table className="table"><thead><tr><th>Deal</th><th>Outcome</th><th>Value</th></tr></thead><tbody>{deals.map(d => <tr key={d.name}><td>{d.name}</td><td><span className="badge badge-success">{d.outcome}</span></td><td>${d.value}</td></tr>)}</tbody></table></div></div>);
}
