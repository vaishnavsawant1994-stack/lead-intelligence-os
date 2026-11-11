"use client";
export default function ExportTemplatesPage() {
  const templates = [{ name: "Full Export", fields: ["Name", "Email", "Company", "Tier"] }, { name: "Email List", fields: ["Name", "Email"] }];
  return <div><h1 className="page-title mb-4">Export Templates</h1><div className="space-y-4">{templates.map(t => <div key={t.name} className="card p-5 flex justify-between"><div><div className="font-medium">{t.name}</div><div className="text-sm text-slate-500">{t.fields.join(", ")}</div></div><button className="btn btn-secondary text-sm">Export</button></div>)}</div></div>;
}
