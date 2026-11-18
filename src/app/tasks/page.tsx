"use client";

import { useEffect, useState, type FormEvent } from "react";
import PreviewNotice from "@/components/PreviewNotice";
import PaginationControls, { type Pagination } from "@/components/PaginationControls";
import { type Task, crmRequest, jsonOptions } from "@/lib/crm-client";

type EditTask = { id: string; title: string; dueAt: string };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState("all");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [editing, setEditing] = useState<EditTask | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const params = new URLSearchParams({ page: String(page), pageSize: "25", state });
    if (search.trim()) params.set("q", search.trim());
    crmRequest<{ tasks: Task[]; pagination: Pagination }>(`/api/tasks?${params.toString()}`)
      .then((result) => { if (active) { setTasks(result.tasks); setPagination(result.pagination); } })
      .catch((cause: unknown) => { if (active) { setTasks([]); setPagination(null); setError(cause instanceof Error ? cause.message : "Tasks unavailable"); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, search, state, refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await crmRequest("/api/tasks", jsonOptions("POST", { title, dueAt }));
      setTitle(""); setDueAt(""); setSearch(""); setState("all"); setPage(1); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to add task"); }
    finally { setBusy(false); }
  }
  async function toggle(task: Task) {
    setBusy(true); setError("");
    try { await crmRequest(`/api/tasks/${task.id}`, jsonOptions("PATCH", { completed: !task.completed })); setRefresh((n) => n + 1); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update task"); }
    finally { setBusy(false); }
  }
  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true); setError("");
    try {
      await crmRequest(`/api/tasks/${editing.id}`, jsonOptions("PATCH", { title: editing.title, dueAt: editing.dueAt }));
      setEditing(null); setRefresh((n) => n + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to edit task"); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this task?")) return;
    setBusy(true); setError("");
    try { await crmRequest(`/api/tasks/${id}`, { method: "DELETE" }); setEditing(null); setRefresh((n) => n + 1); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete task"); }
    finally { setBusy(false); }
  }
  return <section className="space-y-5">
    <header><h1 className="page-title">Tasks</h1><p className="page-subtitle mt-1">Create, edit and track work in your PostgreSQL workspace</p></header><PreviewNotice />
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-medium">Task title *<input required maxLength={240} className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      <label className="text-sm font-medium">Due date<input type="date" className="input mt-1" value={dueAt} onChange={(e) => setDueAt(e.target.value)} /></label>
      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">Add task</button>
    </form>
    <div className="card min-w-0 overflow-hidden">
      <div className="grid gap-3 border-b p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label htmlFor="task-search" className="text-sm font-medium">Search tasks
          <input id="task-search" maxLength={80} className="input mt-2" placeholder="Search task title" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></label>
        <label className="text-sm font-medium">State
          <select className="input mt-2" value={state} onChange={(e) => { setState(e.target.value); setPage(1); }}>
            <option value="all">All tasks</option><option value="pending">Pending</option><option value="completed">Completed</option>
          </select>
        </label>
      </div>
      {loading ? <p className="p-5">Loading tasks…</p> : tasks.length ? <div className="divide-y">{tasks.map((t) => <div key={t.id} className="p-4">
        {editing?.id === t.id ? <form onSubmit={saveEdit} className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(140px,1fr)]">
          <label className="text-sm font-medium">Edit task title<input required maxLength={240} className="input mt-1" value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
          <label className="text-sm font-medium">Edit due date<input type="date" className="input mt-1" value={editing.dueAt}
            onChange={(e) => setEditing({ ...editing, dueAt: e.target.value })} /></label>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button disabled={busy} type="submit" className="btn-primary disabled:opacity-50">Save task</button>
            <button disabled={busy} type="button" onClick={() => setEditing(null)} className="rounded-lg border px-3 py-2 text-sm">Cancel</button>
          </div>
        </form> : <div className="flex flex-wrap items-center gap-3">
          <input type="checkbox" aria-label={`Complete ${t.title}`} checked={t.completed} disabled={busy} onChange={() => toggle(t)} />
          <span className={`min-w-0 flex-1 text-sm ${t.completed ? "text-slate-400 line-through" : ""}`}>{t.title}</span>
          {t.dueAt && <span className="badge badge-neutral">Due {t.dueAt.slice(0, 10)}</span>}
          <button disabled={busy} type="button" className="text-sm text-indigo-700 hover:underline" onClick={() =>
            setEditing({ id: t.id, title: t.title, dueAt: t.dueAt?.slice(0, 10) || "" })
          }>Edit</button>
          <button disabled={busy} type="button" className="text-sm text-red-700 hover:underline" onClick={() => remove(t.id)}>Delete</button>
        </div>}
      </div>)}</div> : <p className="p-5 text-sm text-slate-500">No matching tasks.</p>}
      <PaginationControls pagination={pagination} onPageChange={setPage} disabled={loading}/>
    </div>
  </section>;
}
