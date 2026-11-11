"use client";
import Link from "next/link";
const widgets = [{ name: "Weighted Pipeline", value: "$74,500", href: "/weighted" }, { name: "Deal Health", value: "2 at risk", href: "/deal-aging" }, { name: "Relationship", value: "85 avg", href: "/relationship" }, { name: "ROI", value: "150%", href: "/roi-calculator" }];
export default function Dashboard() {
  return (<div><h1 className="page-title mb-6">Dashboard</h1><div className="grid grid-cols-4 gap-4">{widgets.map(w => <Link key={w.name} href={w.href} className="card p-5"><div className="text-sm text-slate-500">{w.name}</div><div className="text-xl font-bold">{w.value}</div></Link>)}</div></div>);
}
