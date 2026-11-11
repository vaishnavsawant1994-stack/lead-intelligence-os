"use client";
export default function RoutingPage() {
  const rules = [{ condition: "Country = India", assign: "Sarah", active: true }];
  return (<div><h1 className="page-title mb-4">Lead Routing</h1><div className="card"><table className="table"><thead><tr><th>Condition</th><th>Assign to</th><th>Status</th></tr></thead><tbody>{rules.map(r => <tr key={r.condition}><td>{r.condition}</td><td className="text-indigo-600">{r.assign}</td><td><span className="badge badge-success">Active</span></td></tr>)}</tbody></table></div></div>);
}
