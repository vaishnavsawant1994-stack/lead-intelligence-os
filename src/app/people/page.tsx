"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";
import PaginationControls, { type Pagination } from "@/components/PaginationControls";
import { type Company, type Person, crmRequest, jsonOptions, personStatuses } from "@/lib/crm-client";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (search.trim()) params.set("q", search.trim());
    if (status) params.set("status", status);
    Promise.all([
      crmRequest<{ people: Person[]; pagination: Pagination }>(`/api/people?${params.toString()}`),
      crmRequest<{ companies: Company[] }>("/api/companies?pageSize=100"),
    ]).then(([p, c]) => {
      if (active) { setPeople(p.people); setPagination(p.pagination); setCompanies(c.companies); }
    }).catch((cause: unknown) => {
      if (active) { setPeople([]); setPagination(null); setError(cause instanceof Error ? cause.message : "People unavailable"); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, status, refresh]);

  async function createPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await crmRequest("/api/people", jsonOptions("POST", { name, email, title, companyId: companyId || null }));
      setName(""); setEmail(""); setTitle(""); setCompanyId(""); setPage(1); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to add person"); }
    finally { setBusy(false); }
  }

  return <section className="space-y-5">
    <header><h1 className="page-title">People</h1><p className="page-subtitle mt-1">Search, filter and manage workspace contacts</p></header>
    <PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="card min-w-0 overflow-hidden">
        <div className="grid gap-3 border-b p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="text-sm font-medium" htmlFor="people-search">Search people
            <input id="people-search" className="input mt-2" maxLength={80} placeholder="Search by name"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/></label>
          <label className="text-sm font-medium">Status
            <select className="input mt-2" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All statuses</option>
              {personStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>
        {loading ? <p className="p-5 text-sm text-slate-500">Loading people…</p> : people.length ? <div className="overflow-x-auto">
          <table className="table w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">Name</th><th className="p-3">Company</th><th className="p-3">Status</th></tr></thead>
            <tbody>{people.map((p) => <tr key={p.id} className="border-t">
              <td className="p-3"><Link className="font-medium text-indigo-700 hover:underline" href={`/people/${p.id}`}>{p.name}</Link><p className="text-xs text-slate-500">{p.title || p.email || "—"}</p></td>
              <td className="p-3">{p.company?.name || "—"}</td><td className="p-3">{p.status}</td>
            </tr>)}</tbody></table>
        </div> : <p className="p-5 text-sm text-slate-500">No matching people. Adjust filters or add your first record.</p>}
        <PaginationControls pagination={pagination} onPageChange={setPage} disabled={loading}/>
      </div>
      <form onSubmit={createPerson} className="card h-fit space-y-4 p-5">
        <h2 className="font-semibold">Add person</h2>
        <label className="block text-sm font-medium">Name *<input required maxLength={160} value={name} onChange={(e) => setName(e.target.value)} className="input mt-1" /></label>
        <label className="block text-sm font-medium">Job title<input maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} className="input mt-1" /></label>
        <label className="block text-sm font-medium">Email<input type="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1" /></label>
        <label className="block text-sm font-medium">Company<select className="input mt-1" value={companyId} onChange={(e) => setCompanyId(e.target.value)}><option value="">No company</option>{companies.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}</select></label>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">{busy ? "Saving…" : "Add person"}</button>
      </form>
    </div>
  </section>;
}
