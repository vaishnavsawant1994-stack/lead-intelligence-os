"use client";
export default function FormsPage() {
  const forms = [{ name: "Contact Form", submissions: 45 }, { name: "Demo Request", submissions: 23 }];
  return <div><h1 className="page-title mb-4">Web Forms</h1><div className="space-y-4">{forms.map(f => <div key={f.name} className="card p-5"><div className="flex justify-between mb-3"><h3 className="font-medium">{f.name}</h3><span className="text-sm text-slate-500">{f.submissions} submissions</span></div><button className="btn btn-secondary text-sm">Copy Embed</button></div>)}</div></div>;
}
