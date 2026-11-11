"use client";
export default function TemplatesLibraryPage() {
  const templates = [{ name: "Intro Email", category: "Outreach" }, { name: "Follow-up", category: "Outreach" }, { name: "Meeting Request", category: "Scheduling" }];
  return <div><h1 className="page-title mb-4">Templates Library</h1><div className="grid md:grid-cols-3 gap-4">{templates.map(t => <div key={t.name} className="card p-5"><div className="font-medium">{t.name}</div><div className="text-sm text-slate-500">{t.category}</div></div>)}</div></div>;
}
