"use client";

import { useEffect, useState } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import { crmRequest } from "@/lib/crm-client";

type Group = { name: string; count: number };
type DealGroup = Group & { enteredAmount: string };
type Totals = { people: number; companies: number; deals: number; sources: number; tasks: number };
type Analytics = {
  days: number; asOf: string; windowStart: string;
  totals: Totals; newInWindow: Omit<Totals, "tasks">;
  peopleByStatus: Group[]; dealsByStage: DealGroup[]; sourcesByType: Group[];
  tasksByState: { completed: number; pending: number }; limitations: string;
};
function GroupTable({ title, rows }: { title: string; rows: Group[] }) {
  return <section className="card min-w-0 overflow-hidden p-5">
    <h2 className="mb-3 font-semibold">{title}</h2>
    {rows.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <thead><tr><th scope="col" className="pb-2">Category</th><th scope="col" className="pb-2 text-right">Records</th></tr></thead>
      <tbody>{rows.map((row) => <tr className="border-t" key={row.name}>
        <td className="py-3">{row.name}</td><td className="py-3 text-right tabular-nums">{row.count}</td>
      </tr>)}</tbody></table></div>
    : <p className="text-sm text-slate-500">No records in this category.</p>}
  </section>;
}
export default function AnalyticsPage() {
  const [days, setDays] = useState("30");
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    crmRequest<Analytics>(`/api/analytics?days=${days}`)
      .then((response) => { if (active) setData(response); })
      .catch((cause: unknown) => { if (active) {
        setData(null); setError(cause instanceof Error ? cause.message : "Analytics unavailable");
      } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [days]);
  const cards: Array<[string, keyof Omit<Totals, "tasks">]> = [
    ["People", "people"], ["Companies", "companies"],
    ["Deals", "deals"], ["Research sources", "sources"],
  ];
  return <section className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <header><h1 className="page-title">CRM analytics</h1>
        <p className="page-subtitle mt-1">Database-backed organization totals and activity counts</p></header>
      <label className="text-sm font-medium">Reporting window
        <select className="input mt-1" value={days} onChange={(event) => setDays(event.target.value)}>
          <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
        </select>
      </label>
    </div>
    <PreviewNotice />
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      This view shows recorded CRM entries, not verified prospect research or marketing attribution.
      Deal amounts are entered figures with no configured currency and must not be treated as recognized revenue.
    </p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {loading && <p aria-live="polite" className="text-sm text-slate-600">Loading analytics…</p>}
    {data && !loading && <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label,key]) => <div className="card p-4" key={key}>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{data.totals[key]}</p>
          <p className="mt-1 text-xs text-slate-500">New in {data.days} days: {data.newInWindow[key]}</p>
        </div>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <GroupTable title="People by status" rows={data.peopleByStatus}/>
        <GroupTable title="Research sources by type" rows={data.sourcesByType}/>
        <GroupTable title="Deals by stage" rows={data.dealsByStage}/>
        <section className="card p-5">
          <h2 className="mb-3 font-semibold">Task status</h2>
          <p className="text-sm">Pending: <strong>{data.tasksByState.pending}</strong></p>
          <p className="mt-2 text-sm">Completed: <strong>{data.tasksByState.completed}</strong></p>
          <p className="mt-4 text-xs text-slate-500">Task status reflects the current workspace, not completion history during the reporting window.</p>
        </section>
      </div>
      <section className="card min-w-0 overflow-hidden p-5">
        <h2 className="mb-3 font-semibold">Entered deal amounts by stage</h2>
        {data.dealsByStage.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead><tr><th className="pb-2">Stage</th><th className="pb-2 text-right">Entered amount (currency unspecified)</th></tr></thead>
          <tbody>{data.dealsByStage.map((row) => <tr className="border-t" key={row.name}>
            <td className="py-3">{row.name}</td>
            <td className="py-3 text-right tabular-nums">{Number(row.enteredAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
          </tr>)}</tbody>
        </table></div> : <p className="text-sm text-slate-500">No deals recorded.</p>}
      </section>
      <p className="text-xs text-slate-500">Calculated as of {new Date(data.asOf).toLocaleString()}. New-record counts include only creation timestamps in the chosen period; other counts cover all current records.</p>
    </>}
  </section>;
}
