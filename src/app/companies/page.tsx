"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";
import PaginationControls, { type Pagination } from "@/components/PaginationControls";
import { type Company, crmRequest, jsonOptions } from "@/lib/crm-client";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (search.trim()) params.set("q", search.trim());
    crmRequest<{ companies: Company[]; pagination: Pagination }>(`/api/companies?${params.toString()}`)
      .then((data) => { if (active) { setCompanies(data.companies); setPagination(data.pagination); } })
      .catch((cause: unknown) => { if (active) { setCompanies([]); setPagination(null); setError(cause instanceof Error ? cause.message : "Companies unavailable"); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await crmRequest("/api/companies", jsonOptions("POST", { name, website, industry }));
      setName(""); setWebsite(""); setIndustry(""); setPage(1); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save"); }
    finally { setBusy(false); }
  }
  return <section className="space-y-5">
    <header><h1 className="page-title">Companies</h1><p className="page-subtitle mt-1">Workspace organizations and their contacts</p></header><PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="card min-w-0 overflow-hidden">
        <div className="border-b p-4"><label htmlFor="companies-search" className="text-sm font-medium">Search companies
          <input id="companies-search" className="input mt-2" maxLength={80} placeholder="Search by company name"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}/></label></div>
        {loading ? <p className="p-5">Loading companies…</p> : companies.length ? <div className="overflow-x-auto">
          <table className="table w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">Company</th><th className="p-3">Industry</th><th className="p-3">People</th></tr></thead>
            <tbody>{companies.map((c) => <tr className="border-t" key={c.id}>
              <td className="p-3"><Link className="font-medium text-indigo-700 hover:underline" href={`/companies/${c.id}`}>{c.name}</Link></td>
              <td className="p-3">{c.industry || "—"}</td><td className="p-3">{c._count?.people ?? 0}</td>
            </tr>)}</tbody></table>
        </div> : <p className="p-5 text-sm text-slate-500">No matching companies. Adjust the search or add a record.</p>}
        <PaginationControls pagination={pagination} onPageChange={setPage} disabled={loading}/>
      </div>
      <form className="card h-fit space-y-4 p-5" onSubmit={submit}><h2 className="font-semibold">Add company</h2>
        <label className="block text-sm font-medium">Company name *<input required maxLength={160} className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="block text-sm font-medium">Industry<input maxLength={140} className="input mt-1" value={industry} onChange={(e) => setIndustry(e.target.value)} /></label>
        <label className="block text-sm font-medium">Website<input maxLength={250} placeholder="https://example.com" className="input mt-1" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
        <button disabled={busy} className="btn-primary disabled:opacity-50" type="submit">{busy ? "Saving…" : "Add company"}</button>
      </form>
    </div>
  </section>;
}
