"use client";
export default function PortalPage() {
  const clients = [{ name: "The Perspective", users: 3, people: 9746, status: "Active" }];
  return <div><h1 className="page-title mb-4">Client Portal</h1><div className="card"><table className="table"><thead><tr><th>Client</th><th>Users</th><th>People</th><th>Status</th></tr></thead><tbody>{clients.map(c => <tr key={c.name}><td>{c.name}</td><td>{c.users}</td><td>{c.people}</td><td><span className="badge badge-success">{c.status}</span></td></tr>)}</tbody></table></div></div>;
}
