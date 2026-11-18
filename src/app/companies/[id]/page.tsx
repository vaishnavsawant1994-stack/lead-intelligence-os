"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PreviewNotice from "@/components/PreviewNotice";
import { Company, crmRequest, jsonOptions } from "@/lib/crm-client";

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    const { company } = await crmRequest<{ company: Company }>(`/api/companies/${encodeURIComponent(id)}`);
    setCompany(company); setName(company.name); setWebsite(company.website || ""); setIndustry(company.industry || "");
  }, [id]);
  useEffect(() => { reload().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Company unavailable")).finally(() => setLoading(false)); }, [reload]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { await crmRequest(`/api/companies/${encodeURIComponent(id)}`, jsonOptions("PATCH", { name, website, industry })); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save"); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm("Delete this company? This cannot be undone.")) return;
    setBusy(true); setError("");
    try { await crmRequest(`/api/companies/${encodeURIComponent(id)}`, { method: "DELETE" }); router.push("/companies"); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete"); setBusy(false); }
  }
  return <section className="space-y-5">
    <Link href="/companies" className="text-sm text-indigo-700">← Back to companies</Link><PreviewNotice />
    {loading && <p>Loading company…</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {company && <>
      <h1 className="page-title">{company.name}</h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={save} className="card space-y-4 p-5"><h2 className="font-semibold">Company details</h2>
          <label className="block text-sm font-medium">Name<input required maxLength={160} className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="block text-sm font-medium">Industry<input maxLength={140} className="input mt-1" value={industry} onChange={(e) => setIndustry(e.target.value)} /></label>
          <label className="block text-sm font-medium">Website<input maxLength={250} className="input mt-1" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
          <div className="flex flex-wrap gap-3"><button type="submit" className="btn-primary disabled:opacity-50" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button><button type="button" onClick={remove} disabled={busy} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700">Delete company</button></div>
        </form>
        <div className="card p-5"><h2 className="font-semibold">People ({company.people?.length ?? 0})</h2>{company.people?.length ? <ul className="mt-4 divide-y">{company.people.map((p) => <li className="flex justify-between gap-2 py-3 text-sm" key={p.id}><Link className="text-indigo-700" href={`/people/${p.id}`}>{p.name}</Link><span className="text-slate-500">{p.status}</span></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">No linked people. Add them from the People page.</p>}</div>
      </div>
    </>}
  </section>;
}
