"use client";
import { useState } from "react";
export default function RemindersPage() {
  const [items, setItems] = useState([{ id: "1", person: "Arjun Mehta", note: "Follow up", done: false }]);
  return (<div><h1 className="page-title mb-4">Reminders</h1><div className="card divide-y">{items.map(r => <div key={r.id} className="px-5 py-4 flex gap-3"><input type="checkbox" checked={r.done} onChange={() => setItems(items.map(x => x.id === r.id ? { ...x, done: !x.done } : x))} /><div><div className="font-medium text-sm">{r.person}</div><div className="text-sm text-slate-500">{r.note}</div></div></div>)}</div></div>);
}
