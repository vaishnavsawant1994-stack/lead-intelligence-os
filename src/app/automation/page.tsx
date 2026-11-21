"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import PreviewNotice from "@/components/PreviewNotice";
import { crmRequest, jsonOptions } from "@/lib/crm-client";

type Rule = {
  id: string; name: string; trigger: string; taskTitleTemplate: string;
  enabled: boolean; _count: { runs: number };
  runs: Array<{ id: string; taskId: string; personId: string; createdAt: string }>;
};
type Draft = { id: string; name: string; taskTitleTemplate: string };

export default function AutomationPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [name, setName] = useState("");
  const [taskTitleTemplate, setTaskTitleTemplate] = useState("Follow up with {name}");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    crmRequest<{ rules: Rule[] }>("/api/automation-rules")
      .then((data) => { if (active) { setRules(data.rules); setError(""); } })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Rules unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      await crmRequest("/api/automation-rules", jsonOptions("POST", { name, taskTitleTemplate }));
      setName(""); setTaskTitleTemplate("Follow up with {name}");
      setNotice("Automation rule saved. It will run when a new Person is created.");
      setRevision((r) => r + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create rule"); }
    finally { setBusy(false); }
  }
  async function toggle(rule: Rule) {
    setBusy(true); setError(""); setNotice("");
    try {
      await crmRequest(`/api/automation-rules/${rule.id}`, jsonOptions("PATCH", { enabled: !rule.enabled }));
      setNotice(rule.enabled ? "Rule paused." : "Rule enabled for future Person creations.");
      setRevision((r) => r + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update rule"); }
    finally { setBusy(false); }
  }
  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await crmRequest(`/api/automation-rules/${editing.id}`, jsonOptions("PATCH", {
        name: editing.name, taskTitleTemplate: editing.taskTitleTemplate,
      }));
      setEditing(null); setRevision((r) => r + 1); setNotice("Rule updated.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to edit rule"); }
    finally { setBusy(false); }
  }
  async function remove(rule: Rule) {
    if (!window.confirm("Delete this unused automation rule?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await crmRequest(`/api/automation-rules/${rule.id}`, { method: "DELETE" });
      setRevision((r) => r + 1); setNotice("Unused automation rule deleted.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete rule"); }
    finally { setBusy(false); }
  }

  return <section className="space-y-5">
    <header><h1 className="page-title">Internal task automation</h1>
      <p className="page-subtitle mt-1">Create a follow-up task whenever a new Person is recorded</p></header>
    <PreviewNotice />
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      These rules execute automatically **inside Leadveyra only** when a Person is created. They do not send messages,
      schedule external jobs, call AI services or perform outbound actions. Rules are limited to 10 per preview workspace.
      Use synthetic contacts until privacy and production security controls are certified.
    </p>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="card min-w-0 divide-y">
        {loading ? <p className="p-5 text-sm">Loading rules…</p> :
          rules.length ? rules.map((rule) => <section className="p-4" key={rule.id}>
            {editing?.id === rule.id ? <form className="grid gap-3" onSubmit={saveEdit}>
              <label className="text-sm font-medium">Edit rule name<input required maxLength={120} className="input mt-1"
                value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}/></label>
              <label className="text-sm font-medium">Edit task title template<input required maxLength={160} className="input mt-1"
                value={editing.taskTitleTemplate} onChange={(e) => setEditing({ ...editing, taskTitleTemplate: e.target.value })}/></label>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary disabled:opacity-50" disabled={busy}>Save rule</button>
                <button type="button" className="rounded-lg border px-3 py-2 text-sm" disabled={busy} onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </form> : <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{rule.name}</h2>
                <p className="mt-1 break-words text-sm text-slate-600">Task: {rule.taskTitleTemplate}</p>
                <p className="mt-2 text-xs text-slate-500">Trigger: new Person · {rule._count.runs} recorded runs
                  {rule.runs[0] && ` · Last run ${new Date(rule.runs[0].createdAt).toLocaleString()}`}</p>
                <span className={`mt-2 inline-block rounded-md px-2 py-1 text-xs ${rule.enabled ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700"}`}>
                  {rule.enabled ? "Enabled" : "Paused"}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <button type="button" disabled={busy} className="text-indigo-700 hover:underline" onClick={() => toggle(rule)}>
                  {rule.enabled ? "Pause" : "Enable"}
                </button>
                <button type="button" disabled={busy} className="text-indigo-700 hover:underline"
                  onClick={() => setEditing({ id: rule.id, name: rule.name, taskTitleTemplate: rule.taskTitleTemplate })}>Edit</button>
                {rule._count.runs === 0 && <button disabled={busy} type="button" onClick={() => remove(rule)}
                  className="text-red-700 hover:underline">Delete</button>}
              </div>
            </div>}
          </section>) : <p className="p-5 text-sm text-slate-500">No task automation rules yet.</p>}
      </div>
      <form className="card h-fit space-y-4 p-5" onSubmit={create}>
        <h2 className="font-semibold">Create a rule</h2>
        <label className="block text-sm font-medium">Rule name *<input required maxLength={120} className="input mt-1" value={name}
          onChange={(e) => setName(e.target.value)} placeholder="New lead follow-up"/></label>
        <label className="block text-sm font-medium">Task title template *<input required maxLength={160} className="input mt-1"
          value={taskTitleTemplate} onChange={(e) => setTaskTitleTemplate(e.target.value)}/></label>
        <p className="text-xs text-slate-500">Use <code>{"{name}"}</code> to insert the new Person's name.</p>
        <button disabled={busy || rules.length >= 10} type="submit" className="btn-primary disabled:opacity-50">Create rule</button>
        <p className="text-xs text-slate-500">To trigger an enabled rule, add a new record under <Link className="text-indigo-700 underline" href="/people">People</Link>. Resulting tasks appear under <Link className="text-indigo-700 underline" href="/tasks">Tasks</Link>.</p>
      </form>
    </div>
  </section>;
}
