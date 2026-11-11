"use client";
export default function ContactRolesPage() {
  const contacts = [{ name: "Arjun Mehta", company: "TechNova", role: "Decision Maker" }, { name: "Priya Patel", company: "TechNova", role: "Influencer" }];
  return <div><h1 className="page-title mb-4">Contact Roles</h1><div className="card"><table className="table"><thead><tr><th>Name</th><th>Company</th><th>Role</th></tr></thead><tbody>{contacts.map(c => <tr key={c.name}><td>{c.name}</td><td>{c.company}</td><td><span className="badge badge-warning">{c.role}</span></td></tr>)}</tbody></table></div></div>;
}
