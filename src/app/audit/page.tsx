"use client";

import { useEffect, useState } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import { crmRequest } from "@/lib/crm-client";
type Event = { id: string; actorEmail: string; entityType: string; entityId: string; action: string; createdAt: string };

export default function AuditPage() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    crmRequest<{ events: Event[] }>("/api/audit")
      .then((r) => setEvents(r.events))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Audit history unavailable"));
  }, []);
  return <section className="space-y-5">
    <header><h1 className="page-title">CRM activity history</h1><p className="page-subtitle mt-1">Recent persisted changes in the private administrator workspace</p></header>
    <PreviewNotice />
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      This preview audit covers core People, Companies, Tasks, Deals and Organization Settings mutations. It is not a complete, immutable security audit, and it does not track actions in the other demonstration modules.
    </p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {!events && !error && <p>Loading audit history…</p>}
    {events && <div className="card overflow-x-auto">{events.length ? <table className="w-full text-left text-sm">
      <thead className="bg-slate-50"><tr><th className="p-3">When</th><th className="p-3">Action</th><th className="p-3">Entity</th><th className="p-3">Actor</th></tr></thead>
      <tbody>{events.map((event) => <tr className="border-t" key={event.id}>
        <td className="whitespace-nowrap p-3">{new Date(event.createdAt).toLocaleString()}</td>
        <td className="p-3">{event.action}</td>
        <td className="p-3">{event.entityType} <code className="break-all text-xs text-slate-500">{event.entityId}</code></td>
        <td className="p-3">{event.actorEmail}</td>
      </tr>)}</tbody>
    </table> : <p className="p-5 text-sm text-slate-500">No recorded core CRM changes yet.</p>}</div>}
  </section>;
}
