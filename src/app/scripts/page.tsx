"use client";
export default function ScriptsPage() {
  const scripts = [{ name: "Cold Call Intro", steps: ["Introduce yourself", "Ask about challenges", "Present value"] }];
  return (<div><h1 className="page-title mb-4">Call Scripts</h1><div className="space-y-4">{scripts.map(s => <div key={s.name} className="card p-5"><h3 className="font-medium mb-2">{s.name}</h3><ol className="text-sm">{s.steps.map((step, i) => <li key={i}>{i+1}. {step}</li>)}</ol></div>)}</div></div>);
}
