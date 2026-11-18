"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PreviewNotice from "@/components/PreviewNotice";
import { Person, crmRequest, jsonOptions, personStatuses } from "@/lib/crm-client";

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [status, setStatus] = useState("New");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await crmRequest<{ person: Person }>(`/api/people/${encodeURIComponent(id)}`);
    setPerson(data.person); setStatus(data.person.status); setTitle(data.person.title || ""); setEmail(data.person.email || ""); setPhone(data.person.phone || ""); setNotes(data.person.notes || "");
  }, [id]);
  useEffect(() => { reload().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Person unavailable")).finally(() => setLoading(false)); }, [reload]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { await crmRequest(`/api/people/${encodeURIComponent(id)}`, jsonOptions("PATCH", { status, title, email, phone, notes })); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save"); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm("Delete this person and their linked activity? This cannot be undone.")) return;
    setBusy(true); setError("");
    try { await crmRequest(`/api/people/${encodeURIComponent(id)}`, { method: "DELETE" }); router.push("/people"); router.refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete"); setBusy(false); }
  }

  return <section className="space-y-5">
    <Link href="/people" className="text-sm text-indigo-700">← Back to people</Link>
    <PreviewNotice />
    {loading && <p>Loading person…</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {person && <><header><h1 className="page-title">{person.name}</h1><p className="page-subtitle mt-1">{person.company ? <Link className="text-indigo-700" href={`/companies/${person.company.id}`}>{person.company.name}</Link> : "No linked company"}</p></header>
      <form onSubmit={save} className="card max-w-2xl space-y-4 p-5">
        <h2 className="font-semibold">Contact details</h2>
        <label className="block text-sm font-medium">Status<select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>{personStatuses.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="block text-sm font-medium">Title<input maxLength={160} className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="block text-sm font-medium">Email<input type="email" maxLength={254} className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-sm font-medium">Phone<input maxLength={40} className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label className="block text-sm font-medium">Notes<textarea rows={5} maxLength={4000} className="input mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <div className="flex flex-wrap gap-3"><button className="btn-primary disabled:opacity-50" type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button><button type="button" disabled={busy} onClick={remove} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50">Delete person</button></div>
      </form>
    </>}
  </section>;
}
