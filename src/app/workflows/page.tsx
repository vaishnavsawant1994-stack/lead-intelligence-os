"use client";
export default function WorkflowsPage() {
  const workflows = [{ name: "Auto-assign Tier A", trigger: "Tier = A", action: "Assign to senior", active: true }];
  return (<div><h1 className="page-title mb-4">Workflows</h1><div className="space-y-4">{workflows.map(w => <div key={w.name} className="card p-5"><div className="font-medium">{w.name}</div><div className="text-sm text-slate-500">When: {w.trigger} → Then: {w.action}</div></div>)}</div></div>);
}
