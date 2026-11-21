"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";
import PaginationControls, { type Pagination } from "@/components/PaginationControls";
import { crmRequest, jsonOptions } from "@/lib/crm-client";

type Option = { id: string; name: string };
type Appearance = { id: string; person: Option; source: Option & { type: string }; date: string | null; url: string | null };
type Draft = { id: string; date: string; url: string };

export default function ResearchPage() {
  const [appearances, setAppearances] = useState<Appearance[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [people, setPeople] = useState<Option[]>([]);
  const [sources, setSources] = useState<Option[]>([]);
  const [person, setPerson] = useState<Option | null>(null);
  const [source, setSource] = useState<Option | null>(null);
  const [personSearch, setPersonSearch] = useState("");
  const [sourceSearch, setSourceSearch] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    crmRequest<{ appearances: Appearance[]; pagination: Pagination }>(`/api/appearances?page=${page}&pageSize=25`)
      .then((data) => { if (active) { setAppearances(data.appearances); setPagination(data.pagination); setError(""); } })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Research records unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, revision]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      const q = personSearch.trim() ? "&q=" + encodeURIComponent(personSearch.trim()) : "";
      crmRequest<{ people: Option[] }>(`/api/people?pageSize=25${q}`)
        .then((data) => { if (active) setPeople(data.people); })
        .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Person search failed"); });
    }, 180);
    return () => { active = false; clearTimeout(timer); };
  }, [personSearch]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      const q = sourceSearch.trim() ? "&q=" + encodeURIComponent(sourceSearch.trim()) : "";
      crmRequest<{ sources: Option[] }>(`/api/sources?pageSize=25${q}`)
        .then((data) => { if (active) setSources(data.sources); })
        .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Source search failed"); });
    }, 180);
    return () => { active = false; clearTimeout(timer); };
  }, [sourceSearch]);

  const personOptions = person && !people.some((p) => p.id === person.id) ? [person, ...people] : people;
  const sourceOptions = source && !sources.some((p) => p.id === source.id) ? [source, ...sources] : sources;

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!person || !source) { setError("Select both a person and a research source"); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      await crmRequest("/api/appearances", jsonOptions("POST", { personId: person.id, sourceId: source.id, date, url }));
      setDate(""); setUrl(""); setPage(1); setRevision((v) => v + 1);
      setNotice("Reference recorded; article contents have not been independently verified.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to record appearance"); }
    finally { setBusy(false); }
  }
  async function edit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await crmRequest(`/api/appearances/${editing.id}`, jsonOptions("PATCH", { date: editing.date, url: editing.url }));
      setEditing(null); setRevision((v) => v + 1); setNotice("Reference details saved.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to edit appearance"); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this research reference?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await crmRequest(`/api/appearances/${id}`, { method: "DELETE" });
      setEditing(null); setRevision((v) => v + 1); setNotice("Reference deleted.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete appearance"); }
    finally { setBusy(false); }
  }

  return <section className="space-y-5">
    <header><h1 className="page-title">Research appearances</h1><p className="page-subtitle mt-1">Link people to recorded publications and events</p></header>
    <PreviewNotice />
    <p role="note" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      Administrator-entered references only. No website crawling, third-party verification, AI enrichment, or outreach is performed.
      Use synthetic records until production privacy and authorization reviews are complete.
    </p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="card min-w-0 overflow-hidden">
        {loading ? <p className="p-5 text-sm">Loading research appearances…</p> : appearances.length ? <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3">Person</th><th className="p-3">Source</th><th className="p-3">Date / URL</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{appearances.map((a) => <tr key={a.id} className="border-t">
              {editing?.id === a.id ? <td colSpan={4} className="p-3">
                <form onSubmit={edit} className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-medium">Edit reference date<input type="date" className="input mt-1" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })}/></label>
                  <label className="text-sm font-medium">Edit reference URL<input type="url" maxLength={500} className="input mt-1" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })}/></label>
                  <div className="flex gap-2 sm:col-span-2">
                    <button className="btn-primary disabled:opacity-50" disabled={busy} type="submit">Save reference</button>
                    <button className="rounded-lg border px-3 py-2 text-sm" disabled={busy} type="button" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </form>
              </td> : <>
                <td className="p-3"><Link className="text-indigo-700 hover:underline" href={`/people/${a.person.id}`}>{a.person.name}</Link></td>
                <td className="p-3">{a.source.name} <span className="text-xs text-slate-500">({a.source.type})</span></td>
                <td className="p-3">{a.date || "Undated"}{a.url && <p><a href={a.url} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-indigo-700">Open recorded link</a></p>}</td>
                <td className="p-3"><div className="flex gap-3">
                  <button disabled={busy} className="text-indigo-700 hover:underline" onClick={() => setEditing({ id: a.id, date: a.date || "", url: a.url || "" })}>Edit</button>
                  <button disabled={busy} className="text-red-700 hover:underline" onClick={() => remove(a.id)}>Delete</button>
                </div></td>
              </>}
            </tr>)}</tbody>
          </table>
        </div> : <p className="p-5 text-sm text-slate-500">No research appearances recorded yet.</p>}
        <PaginationControls pagination={pagination} onPageChange={setPage} disabled={loading}/>
      </div>
      <form onSubmit={create} className="card h-fit space-y-4 p-5">
        <h2 className="font-semibold">Record an appearance</h2>
        <label className="block text-sm font-medium">Find person<input className="input mt-1" maxLength={80} value={personSearch} onChange={(e) => setPersonSearch(e.target.value)} placeholder="Search by name"/></label>
        <label className="block text-sm font-medium">Person *<select className="input mt-1" required value={person?.id || ""} onChange={(e) => setPerson(personOptions.find((p) => p.id === e.target.value) || null)}>
          <option value="">Select person</option>{personOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select></label>
        <label className="block text-sm font-medium">Find research source<input className="input mt-1" maxLength={80} value={sourceSearch} onChange={(e) => setSourceSearch(e.target.value)} placeholder="Search source"/></label>
        <label className="block text-sm font-medium">Research source *<select className="input mt-1" required value={source?.id || ""} onChange={(e) => setSource(sourceOptions.find((p) => p.id === e.target.value) || null)}>
          <option value="">Select source</option>{sourceOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select></label>
        <label className="block text-sm font-medium">Appearance date<input type="date" className="input mt-1" value={date} onChange={(e) => setDate(e.target.value)}/></label>
        <label className="block text-sm font-medium">Reference URL<input type="url" className="input mt-1" maxLength={500} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article"/></label>
        <button className="btn-primary disabled:opacity-50" type="submit" disabled={busy}>{busy ? "Saving…" : "Record appearance"}</button>
        <p className="text-xs text-slate-500">Add missing records in <Link className="text-indigo-700 underline" href="/people">People</Link> or <Link className="text-indigo-700 underline" href="/sources">Research sources</Link>.</p>
      </form>
    </div>
  </section>;
}
