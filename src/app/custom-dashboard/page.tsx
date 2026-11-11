"use client";
export default function CustomDashboardPage() {
  const widgets = [{ name: "Pipeline Summary", type: "chart" }, { name: "Recent Activity", type: "list" }];
  return <div><h1 className="page-title mb-4">Custom Dashboard</h1><div className="grid md:grid-cols-2 gap-4">{widgets.map(w => <div key={w.name} className="card p-5"><div className="font-medium mb-3">{w.name}</div><div className="h-24 bg-slate-50 rounded flex items-center justify-center text-slate-400">{w.type}</div></div>)}</div></div>;
}
