"use client";
export default function UnsubscribePage() {
  const list = [{ email: "optout@example.com", date: "Nov 5", reason: "Not interested" }];
  return <div><h1 className="page-title mb-4">Unsubscribe List</h1><div className="card"><table className="table"><thead><tr><th>Email</th><th>Date</th><th>Reason</th></tr></thead><tbody>{list.map(u => <tr key={u.email}><td>{u.email}</td><td>{u.date}</td><td>{u.reason}</td></tr>)}</tbody></table></div></div>;
}
