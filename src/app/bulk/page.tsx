"use client";
import { useState } from "react";
export default function BulkPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const people = [{ id: "1", name: "Arjun Mehta", company: "TechNova" }];
  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return <div><h1 className="page-title mb-4">Bulk Actions</h1>{selected.length > 0 && <div className="bg-indigo-50 rounded-lg px-4 py-3 mb-4 text-sm">{selected.length} selected</div>}<div className="card"><table className="table"><thead><tr><th></th><th>Name</th><th>Company</th></tr></thead><tbody>{people.map(p => <tr key={p.id}><td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} /></td><td>{p.name}</td><td>{p.company}</td></tr>)}</tbody></table></div></div>;
}
