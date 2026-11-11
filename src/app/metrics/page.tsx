"use client";
import Link from "next/link";
export default function MetricsDashboard() {
  const metrics = [{ label: "Weighted Pipeline", value: "$74,500", href: "/weighted" }, { label: "Hot Leads", value: "23", href: "/hot-leads" }, { label: "Deal Health", value: "72", href: "/deal-health" }, { label: "Sales Cycle", value: "45 days", href: "/sales-cycle" }];
  return (<div><h1 className="page-title mb-6">Metrics Dashboard</h1><div className="grid grid-cols-4 gap-4">{metrics.map(m => <Link key={m.label} href={m.href} className="card p-5"><div className="text-sm text-slate-500">{m.label}</div><div className="text-2xl font-bold">{m.value}</div></Link>)}</div></div>);
}
