"use client";

import { useEffect, useState, type FormEvent } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import PaginationControls, { type Pagination } from "@/components/PaginationControls";
import { crmRequest, jsonOptions } from "@/lib/crm-client";

type Source = {
  id: string; name: string; type: string; url: string | null;
  _count: { appearances: number }; createdAt: string;
};
type Draft = { id: string; name: string; type: string; url: string };
const TYPES = ["magazine", "publication", "event", "website", "other"];

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [name, setName] = useState("");
  const [type, setType] = useState("website");
  const [url, setUrl] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (search.trim()) params.set("q", search.trim());
    if (filter) params.set("type", filter);
    crmRequest<{ sources: Source[]; pagination: Pagination }>(`/api/sources?${params.toString()}`)
      .then((data) => { if (active) { setSources(data.sources); setPagination(data.pagination); } })
      .catch((cause: unknown) => { if (active) {
        setSources([]); setPagination(null);
        setError(cause instanceof Error ? cause.message : "Research sources unavailable");
      } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, filter, refresh]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await crmRequest("/api/sources", jsonOptions("POST", { name, type, url }));
      setName(""); setUrl(""); setSearch(""); setFilter(""); setPage(1); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create source"); }
    finally { setBusy(false); }
  }
  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true); setError("");
    try {
      await crmRequest(`/api/sources/${editing.id}`, jsonOptions("PATCH", {
        name: editing.name, type: editing.type, url: editing.url,
      }));
      setEditing(null); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update source"); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this unlinked research source?")) return;
    setBusy(true); setError("");
    try {
      await crmRequest(`/api/sources/${id}`, { method: "DELETE" });
      setEditing(null); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete source"); }
    finally { setBusy(false); }
  }

  return <section className="space-y-5">
    <header><h1 className="page-title">Research sources</h1>
      <p className="page-subtitle mt-1">Maintain source records in your private-preview workspace</p></header>
    <PreviewNotice />
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      These are administrator-entered references. No website crawling, publisher verification,
      enrichment, conversion attribution or research automation has been performed.
    </p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="card min-w-0 overflow-hidden">
        <div className="grid gap-3 border-b p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="text-sm font-medium">Search sources
            <input className="input mt-2" value={search} maxLength={80}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}/></label>
          <label className="text-sm font-medium">Source type filter
            <select className="input mt-2" value={filter}
              onChange={(event) => { setFilter(event.target.value); setPage(1); }}>
              <option value="">All types</option>{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></label>
        </div>
        {loading ? <p className="p-5 text-sm">Loading sources…</p> : sources.length ? <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3">Source</th><th className="p-3">Type</th><th className="p-3">Linked appearances</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{sources.map((source) => <tr className="border-t" key={source.id}>
              {editing?.id === source.id ? <td className="p-3" colSpan={4}>
                <form onSubmit={update} className="grid gap-3 md:grid-cols-3">
                  <label className="text-sm font-medium">Edit source name<input required maxLength={160} className="input mt-1"
                    value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}/></label>
                  <label className="text-sm font-medium">Edit source type<select className="input mt-1" value={editing.type}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
                  <label className="text-sm font-medium">Edit source URL<input type="url" maxLength={500} className="input mt-1"
                    value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })}/></label>
                  <div className="flex gap-2 md:col-span-3">
                    <button disabled={busy} type="submit" className="btn-primary disabled:opacity-50">Save source</button>
                    <button disabled={busy} type="button" className="rounded-lg border px-3 py-2 text-sm"
                      onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </form>
              </td> : <>
                <td className="p-3"><span className="font-medium">{source.name}</span>
                  {source.url && <p><a className="break-all text-xs text-indigo-700 hover:underline" href={source.url}
                    target="_blank" rel="noopener noreferrer">Open recorded URL</a></p>}</td>
                <td className="p-3">{source.type}</td>
                <td className="p-3">{source._count.appearances}</td>
                <td className="p-3"><div className="flex gap-3">
                  <button disabled={busy} type="button" className="text-indigo-700 hover:underline"
                    onClick={() => setEditing({ id: source.id, name: source.name, type: source.type, url: source.url || "" })}>Edit</button>
                  <button disabled={busy || source._count.appearances > 0} type="button"
                    title={source._count.appearances ? "Unlink appearances before deletion" : "Delete unlinked source"}
                    className="text-red-700 hover:underline disabled:opacity-40"
                    onClick={() => remove(source.id)}>Delete</button>
                </div></td>
              </>}
            </tr>)}</tbody>
          </table>
        </div> : <p className="p-5 text-sm text-slate-600">No matching source records.</p>}
        <PaginationControls pagination={pagination} onPageChange={setPage} disabled={loading}/>
      </div>
      <form onSubmit={create} className="card h-fit space-y-4 p-5">
        <h2 className="font-semibold">Add research source</h2>
        <label className="block text-sm font-medium">Source name *
          <input required maxLength={160} className="input mt-1" value={name}
            onChange={(event) => setName(event.target.value)}/></label>
        <label className="block text-sm font-medium">Source type
          <select className="input mt-1" value={type} onChange={(event) => setType(event.target.value)}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select></label>
        <label className="block text-sm font-medium">Source URL
          <input type="url" maxLength={500} placeholder="https://example.com" className="input mt-1" value={url}
            onChange={(event) => setUrl(event.target.value)}/></label>
        <button disabled={busy} type="submit" className="btn-primary disabled:opacity-50">{busy ? "Saving…" : "Add source"}</button>
      </form>
    </div>
  </section>;
}
