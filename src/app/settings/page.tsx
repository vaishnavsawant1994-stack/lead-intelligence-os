"use client";

import { useEffect, useState, type FormEvent } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import { crmRequest, jsonOptions } from "@/lib/crm-client";

type Organization = { id: string; name: string; slug: string; updatedAt: string };
export default function SettingsPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    crmRequest<{ organization: Organization }>("/api/settings")
      .then((r) => { setOrganization(r.organization); setName(r.organization.name); })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Settings unavailable"))
      .finally(() => setLoading(false));
  }, []);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setSaved(false);
    try {
      const response = await crmRequest<{ organization: Organization }>("/api/settings", jsonOptions("PATCH", { name }));
      setOrganization(response.organization); setName(response.organization.name); setSaved(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save settings"); }
    finally { setSaving(false); }
  }
  return <section className="max-w-2xl space-y-5">
    <header><h1 className="page-title">Workspace settings</h1><p className="page-subtitle mt-1">Organization information stored in PostgreSQL</p></header>
    <PreviewNotice />
    {loading && <p aria-live="polite">Loading workspace…</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {saved && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Organization name saved.</p>}
    {organization && <form onSubmit={save} className="card space-y-4 p-6">
      <label className="block text-sm font-medium">Organization name<input required maxLength={100} autoComplete="organization" className="input mt-1" value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} /></label>
      <p className="text-sm text-slate-500">Workspace slug: <code>{organization.slug}</code> (read-only)</p>
      <button disabled={saving || !name.trim() || name.trim() === organization.name} className="btn-primary disabled:opacity-50" type="submit">{saving ? "Saving…" : "Save organization"}</button>
      <p className="text-xs text-slate-500">Account roles, provider integrations, authentication policies and billing are not managed by this preview setting.</p>
    </form>}
  </section>;
}
