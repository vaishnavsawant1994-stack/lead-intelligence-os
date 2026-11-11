"use client";
export default function NoteTemplatesPage() {
  const templates = [{ name: "Call Summary", content: "Discussed: \nNext steps: " }];
  return (<div><h1 className="page-title mb-4">Note Templates</h1><div className="grid md:grid-cols-3 gap-4">{templates.map(t => <div key={t.name} className="card p-5"><h3 className="font-medium mb-2">{t.name}</h3><pre className="text-xs text-slate-500">{t.content}</pre></div>)}</div></div>);
}
