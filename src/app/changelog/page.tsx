"use client";
export default function ChangelogPage() {
  const updates = [{ version: "1.5.0", date: "Nov 11", changes: ["Added Goals", "Added Tags"] }];
  return (<div><h1 className="page-title mb-4">Changelog</h1><div className="space-y-4">{updates.map(u => <div key={u.version} className="card p-5"><span className="badge badge-primary">{u.version}</span><ul className="mt-2 text-sm">{u.changes.map(c => <li key={c}>• {c}</li>)}</ul></div>)}</div></div>);
}
