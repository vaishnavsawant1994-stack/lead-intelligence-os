"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";
import { crmRequest } from "@/lib/crm-client";

type Overview = { people: number; companies: number; pendingTasks: number; deals: number; byStage: Array<{ stage: string; count: number }>; recentPeople: Array<{ id: string; name: string; status: string }> };

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    crmRequest<{ overview: Overview }>("/api/overview")
      .then((result) => setOverview(result.overview))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Dashboard unavailable"));
  }, []);
  return (
    <section className="space-y-5">
      <header><h1 className="page-title">Dashboard</h1><p className="page-subtitle mt-1">Real workspace totals from PostgreSQL</p></header>
      <PreviewNotice />
      {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
      {!overview && !error && <p aria-live="polite">Loading workspace metrics…</p>}
      {overview && <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {([{ title: "People", value: overview.people, href: "/people" }, { title: "Companies", value: overview.companies, href: "/companies" }, { title: "Pending tasks", value: overview.pendingTasks, href: "/tasks" }, { title: "Deals", value: overview.deals, href: "/deals" }]).map((metric) => (
            <Link key={metric.title} href={metric.href} className="card block p-5 hover:border-indigo-300"><p className="stat-label">{metric.title}</p><p className="stat-value mt-2">{metric.value.toLocaleString()}</p></Link>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-5"><h2 className="font-semibold">People by pipeline stage</h2><div className="mt-4 space-y-3">{overview.byStage.map(({ stage, count }) => <div key={stage} className="flex items-center justify-between text-sm"><span>{stage}</span><span className="font-semibold">{count}</span></div>)}</div><Link className="mt-4 inline-block text-sm text-indigo-700" href="/pipeline">Open pipeline →</Link></div>
          <div className="card p-5"><h2 className="font-semibold">Recently added people</h2>{overview.recentPeople.length ? <ul className="mt-4 divide-y">{overview.recentPeople.map((p) => <li key={p.id} className="flex justify-between gap-2 py-3 text-sm"><Link href={`/people/${p.id}`} className="text-indigo-700 hover:underline">{p.name}</Link><span className="text-slate-500">{p.status}</span></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">No records yet. Add a person to start your CRM.</p>}</div>
        </div>
      </>}
    </section>
  );
}
