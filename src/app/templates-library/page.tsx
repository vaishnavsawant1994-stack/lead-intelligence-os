"use client";
export default function TemplatesPage() {
  const templates = [{ name: "Cold Outreach", category: "Sales", uses: 45 }];
  return (<div><h1 className="page-title mb-4">Email Templates</h1><div className="grid md:grid-cols-2 gap-4">{templates.map(t => <div key={t.name} className="card p-5"><div className="font-medium">{t.name}</div><div className="text-sm text-slate-500">Used {t.uses} times</div></div>)}</div></div>);
}
