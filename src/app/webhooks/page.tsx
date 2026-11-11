"use client";
export default function WebhooksPage() {
  const webhooks = [{ url: "https://example.com/webhook", events: ["person.created", "email.sent"], active: true }];
  return <div><h1 className="page-title mb-4">Webhooks</h1><div className="card"><table className="table"><thead><tr><th>URL</th><th>Events</th><th>Status</th></tr></thead><tbody>{webhooks.map(w => <tr key={w.url}><td className="font-mono text-sm">{w.url}</td><td>{w.events.join(", ")}</td><td><span className="badge badge-success">Active</span></td></tr>)}</tbody></table></div></div>;
}
