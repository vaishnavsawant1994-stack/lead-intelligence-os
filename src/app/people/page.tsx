"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";
import { Company, Person, crmRequest, jsonOptions } from "@/lib/crm-client";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    const [p, c] = await Promise.all([crmRequest<{ people: Person[] }>(`/api/people?q=${encodeURIComponent(search)}`), crmRequest<{ companies: Company[] }>("/api/companies")]);
    setPeople(p.people); setCompanies(c.companies);
  }, [search]);

  useEffect(() => {
    let active = true;
    Promise.all([crmRequest<{ people: Person[] }>(`/api/people?q=${encodeURIComponent(search)}`), crmRequest<{ companies: Company[] }>("/api/companies")])
      .then(([p, c]) => { if (active) { setPeople(p.people); setCompanies(c.companies); } })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "People unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search]);

  async function createPerson(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await crmRequest("/api/people", jsonOptions("POST", { name, email, title, companyId: companyId || null }));
      setName(""); setEmail(""); setTitle(""); setCompanyId("");
      await reload();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to add person"); }
    finally { setBusy(false); }
  }

  return <section className="space-y-5">
    <header><h1 className="page-title">People</h1><p className="page-subtitle mt-1">Your workspace contact records</p></header>
    <PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="card overflow-hidden">
        <div className="border-b p-4"><label className="text-sm font-medium" htmlFor="people-search">Search people</label><input id="people-search" className="input mt-2" placeholder="Search by name" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        {loading ? <p className="p-5 text-sm text-slate-500">Loading people…</p> : people.length ? <div className="overflow-x-auto"><table className="table w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">Name</th><th className="p-3">Company</th><th className="p-3">Status</th></tr></thead><tbody>{people.map((p) => <tr key={p.id} className="border-t"><td className="p-3"><Link className="font-medium text-indigo-700 hover:underline" href={`/people/${p.id}`}>{p.name}</Link><p className="text-xs text-slate-500">{p.title || p.email || "—"}</p></td><td className="p-3">{p.company?.name || "—"}</td><td className="p-3">{p.status}</td></tr>)}</tbody></table></div> : <p className="p-5 text-sm text-slate-500">No people found. Use the form to add your first record.</p>}
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
