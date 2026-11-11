"use client";
export default function ReportsPage() {
  const reports = [{ name: "Pipeline Report", type: "Pipeline" }, { name: "Activity Report", type: "Activity" }];
  return <div><h1 className="page-title mb-4">Reports</h1><div className="space-y-4">{reports.map(r => <div key={r.name} className="card p-5 flex justify-between"><div><div className="font-medium">{r.name}</div><div className="text-sm text-slate-500">{r.type}</div></div><button className="btn btn-secondary text-sm">View</button></div>)}</div></div>;
}
