"use client";
export default function SignaturesPage() {
  const signatures = [{ name: "Default", content: "Best regards,\nVaishnav" }, { name: "Sales", content: "Looking forward,\nSales Team" }];
  return <div><h1 className="page-title mb-4">Signatures</h1><div className="grid md:grid-cols-2 gap-4">{signatures.map(s => <div key={s.name} className="card p-5"><h3 className="font-medium mb-2">{s.name}</h3><pre className="text-sm text-slate-600 bg-slate-50 p-3 rounded">{s.content}</pre></div>)}</div></div>;
}
