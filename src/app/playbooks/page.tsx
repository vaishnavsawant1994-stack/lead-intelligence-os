"use client";
export default function PlaybooksPage() {
  const playbooks = [{ name: "Enterprise Outreach", steps: 5 }, { name: "SMB Quick Close", steps: 3 }];
  return <div><h1 className="page-title mb-4">Playbooks</h1><div className="space-y-4">{playbooks.map(p => <div key={p.name} className="card p-5 flex justify-between"><div className="font-medium">{p.name}</div><span className="badge badge-neutral">{p.steps} steps</span></div>)}</div></div>;
}
