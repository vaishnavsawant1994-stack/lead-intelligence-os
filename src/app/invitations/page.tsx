"use client";
import { useState } from "react";
export default function InvitationsPage() {
  const [email, setEmail] = useState("");
  const invites = [{ email: "sarah@company.com", role: "Manager", status: "Accepted" }];
  return <div><h1 className="page-title mb-4">Invitations</h1><div className="card p-5 mb-6"><div className="flex gap-3"><input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" className="input flex-1" /><select className="input w-32"><option>Member</option><option>Manager</option></select><button className="btn btn-primary">Invite</button></div></div><div className="card"><table className="table"><thead><tr><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>{invites.map(i => <tr key={i.email}><td>{i.email}</td><td>{i.role}</td><td><span className="badge badge-success">{i.status}</span></td></tr>)}</tbody></table></div></div>;
}
