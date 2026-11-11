"use client";
export default function WorkflowsPage() {
  const workflows = [{ name: "New Lead Follow-up", trigger: "Lead created", actions: 3 }, { name: "Email Open Alert", trigger: "Email opened", actions: 1 }];
  return <div><h1 className="page-title mb-4">Workflows</h1><div className="space-y-4">{workflows.map(w => <div key={w.name} className="card p-5"><div className="flex justify-between"><div><div className="font-medium">{w.name}</div><div className="text-sm text-slate-500">Trigger: {w.trigger}</div></div><span className="badge badge-neutral">{w.actions} actions</span></div></div>)}</div></div>;
}
