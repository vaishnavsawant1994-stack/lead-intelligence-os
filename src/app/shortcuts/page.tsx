"use client";
export default function ShortcutsPage() {
  const shortcuts = [{ keys: "⌘ K", action: "Open search" }, { keys: "⌘ N", action: "New person" }, { keys: "⌘ E", action: "Compose email" }];
  return <div><h1 className="page-title mb-4">Keyboard Shortcuts</h1><div className="card"><table className="table"><thead><tr><th>Shortcut</th><th>Action</th></tr></thead><tbody>{shortcuts.map(s => <tr key={s.keys}><td><kbd className="px-2 py-1 bg-slate-100 rounded text-sm">{s.keys}</kbd></td><td>{s.action}</td></tr>)}</tbody></table></div></div>;
}
