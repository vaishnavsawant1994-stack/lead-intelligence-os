"use client";
export default function EmailTrackingPage() {
  const opens = [{ email: "Introduction", person: "Arjun Mehta", time: "Nov 10, 2:34 PM", location: "Mumbai" }];
  return (<div><h1 className="page-title mb-4">Email Tracking</h1><div className="card"><table className="table"><thead><tr><th>Email</th><th>Person</th><th>Opened</th><th>Location</th></tr></thead><tbody>{opens.map(o => <tr key={o.person}><td>{o.email}</td><td>{o.person}</td><td>{o.time}</td><td>{o.location}</td></tr>)}</tbody></table></div></div>);
}
