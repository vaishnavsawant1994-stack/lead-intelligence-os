"use client";

import { useEffect, useState, type FormEvent } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import PaginationControls, { type Pagination } from "@/components/PaginationControls";
import { crmRequest, jsonOptions } from "@/lib/crm-client";

type Suppression = { id: string; email: string; reason: string; note: string | null; createdAt: string };
const reasonLabels: Record<string, string> = {
  manual_opt_out: "Manual do-not-contact",
  unsubscribe: "Unsubscribe reported",
  complaint: "Complaint reported",
  legal_request: "Legal/privacy request",
};

export default function ConsentPage() {
  const [entries, setEntries] = useState<Suppression[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("manual_opt_out");
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: "25" });
    if (query.trim()) params.set("q", query.trim());
    crmRequest<{ entries: Suppression[]; pagination: Pagination }>(`/api/suppressions?${params.toString()}`)
      .then((response) => {
        if (active) { setEntries(response.entries); setPagination(response.pagination); setError(""); }
      }).catch((cause: unknown) => {
        if (active) {
          setEntries([]); setPagination(null);
          setError(cause instanceof Error ? cause.message : "Suppression register unavailable");
        }
      }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, query, revision]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setSaved("");
    try {
      const result = await crmRequest<{ entry: Suppression }>("/api/suppressions",
        jsonOptions("POST", { email, reason, note }));
      setEmail(""); setNote(""); setQuery(""); setPage(1);
      setSaved(`Recorded do-not-contact entry for ${result.entry.email}`);
      setRevision((value) => value + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to record suppression");
    } finally { setBusy(false); }
  }

  return <section className="space-y-5">
    <header><h1 className="page-title">Do-not-contact register</h1>
      <p className="page-subtitle mt-1">Organization-scoped suppression records for the private preview</p></header>
    <PreviewNotice />
    <div role="note" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      This records reported opt-outs or contact restrictions; it is NOT a verified consent-grant system.
      Outbound email remains disabled. Do not use this tool to infer legal permission to contact anyone.
      Removing a suppression is not supported in the preview.
    </div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {saved && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{saved}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="card min-w-0 overflow-hidden">
        <div className="border-b p-4">
          <label htmlFor="suppression-search" className="block text-sm font-medium">Search recorded addresses
            <input id="suppression-search" className="input mt-2" maxLength={80} value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search email address" />
          </label>
        </div>
        {loading ? <p className="p-5 text-sm">Loading entries…</p> : entries.length ? <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3">Address</th><th className="p-3">Restriction</th><th className="p-3">Recorded</th></tr></thead>
            <tbody>{entries.map((entry) => <tr key={entry.id} className="border-t">
              <td className="break-all p-3 font-medium">{entry.email}</td>
              <td className="p-3">{reasonLabels[entry.reason] || entry.reason}{entry.note && <p className="mt-1 break-words text-xs text-slate-500">{entry.note}</p>}</td>
              <td className="whitespace-nowrap p-3 text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</td>
            </tr>)}</tbody>
          </table>
        </div> : <p className="p-5 text-sm text-slate-600">No matching do-not-contact records.</p>}
        <PaginationControls pagination={pagination} onPageChange={setPage} disabled={loading} />
      </div>
      <form onSubmit={submit} className="card h-fit space-y-4 p-5">
        <h2 className="font-semibold">Record a contact restriction</h2>
        <label className="block text-sm font-medium">Email address *
          <input type="email" required maxLength={254} className="input mt-1" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">Reason *
          <select className="input mt-1" value={reason} onChange={(event) => setReason(event.target.value)}>
            {Object.entries(reasonLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Internal note (no sensitive evidence)
          <textarea rows={3} maxLength={1000} className="input mt-1" value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <button type="submit" className="btn-primary disabled:opacity-50" disabled={busy}>{busy ? "Recording…" : "Record do-not-contact"}</button>
      </form>
    </div>
  </section>;
}
