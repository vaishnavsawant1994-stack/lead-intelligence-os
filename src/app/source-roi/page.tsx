"use client";
export default function SourceROIPage() {
  const sources = [{ name: "Forbes", leads: 856, deals: 8, revenue: 125000, roi: 146 }];
  return <div><h1 className="page-title mb-4">Source ROI</h1><div className="card"><table className="table"><thead><tr><th>Source</th><th>Leads</th><th>Deals</th><th>Revenue</th><th>ROI</th></tr></thead><tbody>{sources.map(s => <tr key={s.name}><td>{s.name}</td><td>{s.leads}</td><td>{s.deals}</td><td className="text-emerald-600">${s.revenue.toLocaleString()}</td><td><span className="badge badge-success">{s.roi}%</span></td></tr>)}</tbody></table></div></div>;
}
