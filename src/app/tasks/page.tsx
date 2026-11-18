"use client";

import { useCallback, useEffect, useState } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import { Task, crmRequest, jsonOptions } from "@/lib/crm-client";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => { const result = await crmRequest<{ tasks: Task[] }>("/api/tasks"); setTasks(result.tasks); }, []);
  useEffect(() => { reload().catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Tasks unavailable")).finally(() => setLoading(false)); }, [reload]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { await crmRequest("/api/tasks", jsonOptions("POST", { title, dueAt })); setTitle(""); setDueAt(""); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to add task"); }
    finally { setBusy(false); }
  }
  async function toggle(task: Task) {
    setBusy(true); setError("");
    try { await crmRequest(`/api/tasks/${task.id}`, jsonOptions("PATCH", { completed: !task.completed })); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update task"); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this task?")) return;
    setBusy(true); setError("");
    try { await crmRequest(`/api/tasks/${id}`, { method: "DELETE" }); await reload(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete task"); }
    finally { setBusy(false); }
  }
  return <section className="space-y-5">
    <header><h1 className="page-title">Tasks</h1><p className="page-subtitle mt-1">Track work in your PostgreSQL workspace</p></header><PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-medium">Task title *<input required maxLength={240} className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label className="text-sm font-medium">Due date<input type="date" className="input mt-1" value={dueAt} onChange={(e) => setDueAt(e.target.value)} /></label>
      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">Add task</button>
    </form>
    <div className="card divide-y">{loading ? <p className="p-5">Loading tasks…</p> : tasks.length ? tasks.map((t) => <div key={t.id} className="flex flex-wrap items-center gap-3 p-4">
      <input type="checkbox" aria-label={`Complete ${t.title}`} checked={t.completed} disabled={busy} onChange={() => toggle(t)} />
      <span className={`min-w-0 flex-1 text-sm ${t.completed ? "text-slate-400 line-through" : ""}`}>{t.title}</span>
      {t.dueAt && <span className="badge badge-neutral">Due {t.dueAt.slice(0, 10)}</span>}
      <button disabled={busy} type="button" className="text-xs text-red-700 hover:underline" onClick={() => remove(t.id)}>Delete</button>
    </div>) : <p className="p-5 text-sm text-slate-500">No tasks yet.</p>}</div>
  </section>;
}
