"use client";

import { useEffect, useState } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import { crmRequest } from "@/lib/crm-client";

type Report = { leadStages: Array<{ stage: string; count: number }>; dealStages: Array<{ stage: string; count: number; value: string }>; tasks: { completed: number; pending: number } };
export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    crmRequest<{ report: Report }>("/api/reports")
      .then((value) => setReport(value.report))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Reports unavailable"));
  }, []);
  return <section className="space-y-5">
    <header><h1 className="page-title">Workspace reports</h1><p className="page-subtitle mt-1">Current counts and deal amounts from PostgreSQL, not demonstration forecasts</p></header>
    <PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!report && !error && <p>Loading reports…</p>}
    {report && <div className="grid gap-5 lg:grid-cols-2">
      <div className="card p-5"><h2 className="mb-3 font-semibold">People by status</h2>{report.leadStages.length ? <ul className="divide-y">{report.leadStages.map((item) => <li key={item.stage} className="flex justify-between py-3 text-sm"><span>{item.stage}</span><strong>{item.count}</strong></li>)}</ul> : <p className="text-sm text-slate-500">No people recorded.</p>}</div>
      <div className="card p-5"><h2 className="mb-3 font-semibold">Deals by stage</h2>{report.dealStages.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="pb-2">Stage</th><th className="pb-2">Count</th><th className="pb-2 text-right">Entered amount</th></tr></thead><tbody>{report.dealStages.map((item) => <tr key={item.stage} className="border-t"><td className="py-2">{item.stage}</td><td className="py-2">{item.count}</td><td className="py-2 text-right tabular-nums">{Number(item.value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td></tr>)}</tbody></table></div> : <p className="text-sm text-slate-500">No deals recorded.</p>}</div>
      <div className="card p-5"><h2 className="mb-3 font-semibold">Tasks</h2><p className="text-sm">Pending: <strong>{report.tasks.pending}</strong></p><p className="mt-2 text-sm">Completed: <strong>{report.tasks.completed}</strong></p></div>
      <p className="text-sm text-slate-600">Amounts have no configured currency and are not recognized revenue or probability-weighted forecasts. Automated email, attribution and campaign analytics require provider integration.</p>
    </div>}
  </section>;
}
