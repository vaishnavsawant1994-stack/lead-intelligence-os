"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PreviewNotice from "@/components/PreviewNotice";
import { type Person, crmRequest, jsonOptions, personStatuses } from "@/lib/crm-client";

type CompanyOption = { id: string; name: string };

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("New");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);
  const [companyTerm, setCompanyTerm] = useState("");
  const [companyResults, setCompanyResults] = useState<CompanyOption[]>([]);
  const [companyError, setCompanyError] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const response = await crmRequest<{ person: Person }>(`/api/people/${encodeURIComponent(id)}`);
    const found = response.person;
    setPerson(found); setName(found.name); setStatus(found.status);
    setTitle(found.title || ""); setEmail(found.email || "");
    setPhone(found.phone || ""); setNotes(found.notes || "");
    setCompanyId(found.companyId || ""); setSelectedCompany(found.company);
  }, [id]);

  useEffect(() => {
    reload().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Person unavailable"))
      .finally(() => setLoading(false));
  }, [reload]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ pageSize: "25" });
      if (companyTerm.trim()) params.set("q", companyTerm.trim());
      crmRequest<{ companies: CompanyOption[] }>(`/api/companies?${params.toString()}`, { signal: controller.signal })
        .then((response) => {
          if (active) { setCompanyResults(response.companies); setCompanyError(""); }
        }).catch((cause: unknown) => {
          if (active) setCompanyError(cause instanceof Error ? cause.message : "Company lookup unavailable");
        });
    }, 150);
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [companyTerm]);

  const companyOptions = selectedCompany && !companyResults.some((option) => option.id === selectedCompany.id)
    ? [selectedCompany, ...companyResults] : companyResults;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setSaved(false);
    try {
      await crmRequest(`/api/people/${encodeURIComponent(id)}`, jsonOptions("PATCH", {
        name, status, title, email, phone, notes, companyId: companyId || null,
      }));
      await reload();
      setSaved(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save"); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm("Delete this person and their linked activity? This cannot be undone.")) return;
    setBusy(true); setError(""); setSaved(false);
    try {
      await crmRequest(`/api/people/${encodeURIComponent(id)}`, { method: "DELETE" });
      router.push("/people"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete"); setBusy(false); }
  }

  return <section className="space-y-5">
    <Link href="/people" className="text-sm text-indigo-700">← Back to people</Link>
    <PreviewNotice />
    {loading && <p>Loading person…</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {saved && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Contact details saved.</p>}
    {person && <>
      <header><h1 className="page-title">{person.name}</h1>
        <p className="page-subtitle mt-1">{person.company
          ? <Link className="text-indigo-700" href={`/companies/${person.company.id}`}>{person.company.name}</Link>
          : "No linked company"}</p></header>
      <form onSubmit={save} className="card max-w-2xl space-y-4 p-5">
        <h2 className="font-semibold">Contact details</h2>
        <label className="block text-sm font-medium">Name
          <input required maxLength={160} className="input mt-1" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }}/></label>
        <label className="block text-sm font-medium">Status
          <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
            {personStatuses.map((s) => <option key={s}>{s}</option>)}
          </select></label>
        <label className="block text-sm font-medium">Title<input maxLength={160} className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="block text-sm font-medium">Email<input type="email" maxLength={254} className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-sm font-medium">Phone<input maxLength={40} className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        <label className="block text-sm font-medium">Find company
          <input maxLength={80} value={companyTerm} onChange={(e) => setCompanyTerm(e.target.value)}
            className="input mt-1" placeholder="Search company by name" /></label>
        {companyError && <p className="text-sm text-red-700">{companyError}</p>}
        <label className="block text-sm font-medium">Linked company
          <select className="input mt-1" value={companyId} onChange={(e) => {
            setCompanyId(e.target.value);
            setSelectedCompany(companyOptions.find((option) => option.id === e.target.value) || null);
          }}>
            <option value="">No company</option>
            {companyOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
          </select></label>
        <label className="block text-sm font-medium">Notes
          <textarea rows={5} maxLength={4000} className="input mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary disabled:opacity-50" type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
          <button type="button" disabled={busy} onClick={remove}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50">Delete person</button>
        </div>
      </form>
    </>}
  </section>;
}
