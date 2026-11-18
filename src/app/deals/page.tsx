"use client";

import { useEffect, useState, type FormEvent } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import PaginationControls, { type Pagination } from "@/components/PaginationControls";
import { type Deal, crmRequest, jsonOptions, dealStages } from "@/lib/crm-client";

type EditDeal = { id: string; name: string; value: string; stage: string };

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("New");
  const [editing, setEditing] = useState<EditDeal | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true; setLoading(true); setError("");
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (search.trim()) params.set("q", search.trim());
    if (filter) params.set("stage", filter);
    crmRequest<{ deals: Deal[]; pagination: Pagination }>(`/api/deals?${params.toString()}`)
      .then((result) => { if (active) { setDeals(result.deals); setPagination(result.pagination); } })
      .catch((cause: unknown) => { if (active) { setDeals([]); setPagination(null); setError(cause instanceof Error ? cause.message : "Deals unavailable"); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, filter, refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      await crmRequest("/api/deals", jsonOptions("POST", { name, value, stage }));
      setName(""); setValue(""); setStage("New"); setFilter(""); setSearch(""); setPage(1); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save deal"); }
    finally { setBusy(false); }
  }
  async function updateStage(id: string, nextStage: string) {
    setError(""); setBusy(true);
    try { await crmRequest(`/api/deals/${id}`, jsonOptions("PATCH", { stage: nextStage })); setRefresh((n) => n + 1); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update deal"); }
    finally { setBusy(false); }
  }
  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setError(""); setBusy(true);
    try {
      await crmRequest(`/api/deals/${editing.id}`, jsonOptions("PATCH", { name: editing.name, value: editing.value, stage: editing.stage }));
      setEditing(null); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to edit deal"); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this deal?")) return;
    setError(""); setBusy(true);
    try { await crmRequest(`/api/deals/${id}`, { method: "DELETE" }); setEditing(null); setRefresh((n) => n + 1); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete deal"); }
    finally { setBusy(false); }
  }
  return <section className="space-y-5">
    <header><h1 className="page-title">Deals</h1><p className="page-subtitle mt-1">Create, edit and move sales opportunities</p></header><PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="card grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
      <label className="text-sm font-medium">Deal name *<input required maxLength={160} className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="text-sm font-medium">Value<input type="number" min="0" max="999999999" step=".01" required className="input mt-1" value={value} onChange={(e) => setValue(e.target.value)} /></label>
      <label className="text-sm font-medium">Stage<select className="input mt-1" value={stage} onChange={(e) => setStage(e.target.value)}>{dealStages.map((s) => <option key={s}>{s}</option>)}</select></label>
      <button disabled={busy} type="submit" className="btn-primary disabled:opacity-50">Add deal</button>
    </form>
    <div className="card min-w-0 overflow-hidden">
      <div className="grid gap-3 border-b p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label htmlFor="deals-search" className="text-sm font-medium">Search deals
          <input id="deals-search" maxLength={80} className="input mt-2" placeholder="Search deal name"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></label>
        <label className="text-sm font-medium">Stage filter
          <select className="input mt-2" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="">All stages</option>{dealStages.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      {loading ? <p className="p-5">Loading deals…</p> : deals.length ? <div className="overflow-x-auto">
        <table className="table w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-3">Deal</th><th className="p-3">Value</th><th className="p-3">Stage</th><th className="p-3">Actions</th></tr></thead>
          <tbody>{deals.map((d) => <tr className="border-t" key={d.id}>
            {editing?.id === d.id ? <td colSpan={4} className="p-3">
              <form onSubmit={saveEdit} className="grid gap-3 md:grid-cols-3">
                <label className="text-sm font-medium">Edit deal name<input required maxLength={160} className="input mt-1" value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
                <label className="text-sm font-medium">Edit deal value<input type="number" min="0" max="999999999" step=".01" required className="input mt-1"
                  value={editing.value} onChange={(e) => setEditing({ ...editing, value: e.target.value })}/></label>
                <label className="text-sm font-medium">Edit stage<select className="input mt-1" value={editing.stage}
                  onChange={(e) => setEditing({ ...editing, stage: e.target.value })}>{dealStages.map((s) => <option key={s}>{s}</option>)}</select></label>
                <div className="flex gap-2 md:col-span-3">
                  <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">Save deal</button>
                  <button type="button" disabled={busy} onClick={() => setEditing(null)} className="rounded-lg border px-3 py-2 text-sm">Cancel</button>
                </div>
              </form>
            </td> : <>
              <td className="p-3 font-medium">{d.name}</td>
              <td className="p-3">{Number(d.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="p-3"><select aria-label={`Stage for ${d.name}`} disabled={busy} className="input" value={d.stage}
                onChange={(e) => updateStage(d.id, e.target.value)}>{dealStages.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td className="p-3"><div className="flex gap-3">
                <button type="button" disabled={busy} onClick={() =>
                  setEditing({ id: d.id, name: d.name, value: d.value, stage: d.stage })
                } className="text-indigo-700 hover:underline">Edit</button>
                <button type="button" disabled={busy} onClick={() => remove(d.id)} className="text-red-700 hover:underline">Delete</button>
              </div></td>
            </>}
          </tr>)}</tbody>
        </table>
      </div> : <p className="p-5 text-sm text-slate-500">No matching deals.</p>}
      <PaginationControls pagination={pagination} onPageChange={setPage} disabled={loading}/>
    </div>
  </section>;
}
