"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";
import { Person, crmRequest, jsonOptions, personStatuses } from "@/lib/crm-client";

export default function PipelinePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  async function reload() { const data = await crmRequest<{ people: Person[] }>("/api/people"); setPeople(data.people); }
  useEffect(() => { reload().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Pipeline unavailable")).finally(() => setLoading(false)); }, []);
  async function update(id: string, status: string) {
    setBusyId(id); setError("");
    try { await crmRequest(`/api/people/${id}`, jsonOptions("PATCH", { status })); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update stage"); }
    finally { setBusyId(""); }
  }
  return <section className="space-y-5">
    <header><h1 className="page-title">Pipeline</h1><p className="page-subtitle mt-1">Change a person&apos;s status to move them between stages</p></header><PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {loading ? <p>Loading pipeline…</p> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">{personStatuses.map((stage) => {
      const records = people.filter((person) => person.status === stage);
      return <div key={stage} className="min-w-0 rounded-xl bg-slate-100 p-3"><h2 className="mb-3 flex items-center justify-between text-sm font-semibold"><span>{stage}</span><span>{records.length}</span></h2><div className="space-y-3">{records.map((p) => <div key={p.id} className="card p-3"><Link href={`/people/${p.id}`} className="text-sm font-medium text-indigo-700 hover:underline">{p.name}</Link><p className="my-2 text-xs text-slate-500">{p.company?.name || "No company"}</p><label className="block text-xs text-slate-600">Change status<select aria-label={`Status for ${p.name}`} disabled={busyId === p.id} className="input mt-1" value={p.status} onChange={(event) => update(p.id, event.target.value)}>{personStatuses.map((s) => <option key={s}>{s}</option>)}</select></label></div>)}{!records.length && <p className="py-5 text-center text-xs text-slate-500">No people</p>}</div></div>;
    })}</div>}
  </section>;
}
