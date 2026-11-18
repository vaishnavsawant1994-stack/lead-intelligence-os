"use client";

import { useCallback, useEffect, useState } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import { Deal, crmRequest, jsonOptions, dealStages } from "@/lib/crm-client";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("New");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const reload = useCallback(async () => { const result = await crmRequest<{ deals: Deal[] }>("/api/deals"); setDeals(result.deals); }, []);
  useEffect(() => { reload().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Deals unavailable")).finally(() => setLoading(false)); }, [reload]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try { await crmRequest("/api/deals", jsonOptions("POST", { name, value, stage })); setName(""); setValue(""); setStage("New"); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save deal"); }
    finally { setBusy(false); }
  }
  async function update(id: string, stage: string) {
    setError(""); setBusy(true);
    try { await crmRequest(`/api/deals/${id}`, jsonOptions("PATCH", { stage })); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update deal"); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this deal?")) return;
    setError(""); setBusy(true);
    try { await crmRequest(`/api/deals/${id}`, { method: "DELETE" }); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete deal"); }
    finally { setBusy(false); }
  }
  return <section className="space-y-5">
    <header><h1 className="page-title">Deals</h1><p className="page-subtitle mt-1">Create opportunities and move them between deal stages</p></header><PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="card grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
      <label className="text-sm font-medium">Deal name *<input required maxLength={160} className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="text-sm font-medium">Value<input type="number" min="0" max="999999999" step=".01" required className="input mt-1" value={value} onChange={(e) => setValue(e.target.value)} /></label>
      <label className="text-sm font-medium">Stage<select className="input mt-1" value={stage} onChange={(e) => setStage(e.target.value)}>{dealStages.map((s) => <option key={s}>{s}</option>)}</select></label>
      <button disabled={busy} type="submit" className="btn-primary disabled:opacity-50">Add deal</button>
    </form>
    <div className="card overflow-x-auto">{loading ? <p className="p-5">Loading deals…</p> : deals.length ? <table className="table w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">Deal</th><th className="p-3">Value</th><th className="p-3">Stage</th><th className="p-3">Actions</th></tr></thead><tbody>{deals.map((d) => <tr className="border-t" key={d.id}><td className="p-3 font-medium">{d.name}</td><td className="p-3">{Number(d.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td><td className="p-3"><select aria-label={`Stage for ${d.name}`} disabled={busy} className="input" value={d.stage} onChange={(e) => update(d.id, e.target.value)}>{dealStages.map((s) => <option key={s}>{s}</option>)}</select></td><td className="p-3"><button type="button" disabled={busy} onClick={() => remove(d.id)} className="text-red-700 hover:underline">Delete</button></td></tr>)}</tbody></table> : <p className="p-5 text-sm text-slate-500">No deals yet.</p>}</div>
  </section>;
}
