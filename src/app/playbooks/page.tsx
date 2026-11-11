"use client";
export default function PlaybooksPage() {
  const playbooks = [{ name: "Enterprise Sale", steps: ["Qualify", "Discovery", "Demo", "Close"], deals: 12 }];
  return (<div><h1 className="page-title mb-4">Playbooks</h1><div className="space-y-4">{playbooks.map(p => <div key={p.name} className="card p-5"><h3 className="font-medium">{p.name}</h3><div className="flex gap-2 mt-2">{p.steps.map(s => <span key={s} className="text-xs bg-slate-100 px-2 py-1 rounded">{s}</span>)}</div></div>)}</div></div>);
}
