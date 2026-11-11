"use client";
export default function GDPRPage() {
  const requests = [{ email: "user@example.com", type: "Data Export", status: "Completed" }, { email: "delete@test.com", type: "Data Deletion", status: "Pending" }];
  return <div><h1 className="page-title mb-4">GDPR Tools</h1><div className="card"><table className="table"><thead><tr><th>Email</th><th>Type</th><th>Status</th></tr></thead><tbody>{requests.map(r => <tr key={r.email}><td>{r.email}</td><td>{r.type}</td><td><span className={`badge ${r.status === "Completed" ? "badge-success" : "badge-warning"}`}>{r.status}</span></td></tr>)}</tbody></table></div></div>;
}
