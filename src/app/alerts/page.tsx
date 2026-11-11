"use client";
export default function AlertsPage() {
  const alerts = [{ type: "news", person: "Arjun Mehta", message: "Featured in TechCrunch" }, { type: "funding", person: "TechNova", message: "Raised $2.5M" }];
  return (<div><h1 className="page-title mb-4">Alerts</h1><div className="card divide-y">{alerts.map((a, i) => <div key={i} className="px-5 py-4"><div className="font-medium text-sm">{a.person}</div><div className="text-sm text-slate-500">{a.message}</div></div>)}</div></div>);
}
