"use client";
export default function AuditPage() {
  const logs = [{ user: "You", action: "Updated status", target: "Arjun Mehta", time: "2h ago" }];
  return (<div><h1 className="page-title mb-4">Audit Log</h1><div className="card"><table className="table"><thead><tr><th>User</th><th>Action</th><th>Target</th><th>Time</th></tr></thead><tbody>{logs.map((l, i) => <tr key={i}><td>{l.user}</td><td>{l.action}</td><td>{l.target}</td><td>{l.time}</td></tr>)}</tbody></table></div></div>);
}
