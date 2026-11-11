"use client";
export default function RepPerformancePage() {
  const reps = [{ name: "You", calls: 45, emails: 120, revenue: 75000 }];
  return (<div><h1 className="page-title mb-4">Rep Performance</h1><div className="card"><table className="table"><thead><tr><th>Rep</th><th>Calls</th><th>Emails</th><th>Revenue</th></tr></thead><tbody>{reps.map(r => <tr key={r.name}><td>{r.name}</td><td>{r.calls}</td><td>{r.emails}</td><td className="text-emerald-600">${r.revenue.toLocaleString()}</td></tr>)}</tbody></table></div></div>);
}
