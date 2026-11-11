"use client";
export default function TimelinePage() {
  const events = [{ date: "Nov 10", action: "Email opened", detail: "Introduction" }];
  return (<div><h1 className="page-title mb-4">Contact Timeline</h1><div className="space-y-4">{events.map(e => <div key={e.date} className="card p-4"><div className="font-medium text-sm">{e.action}</div><div className="text-sm text-slate-500">{e.detail}</div></div>)}</div></div>);
}
