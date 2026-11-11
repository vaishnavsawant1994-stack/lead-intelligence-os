"use client";
export default function ConsentPage() {
  const consents = [{ email: "arjun@technova.com", status: "Opted In" }];
  return (<div><h1 className="page-title mb-4">Consent Tracking</h1><div className="card"><table className="table"><thead><tr><th>Email</th><th>Status</th></tr></thead><tbody>{consents.map(c => <tr key={c.email}><td>{c.email}</td><td><span className="badge badge-success">{c.status}</span></td></tr>)}</tbody></table></div></div>);
}
