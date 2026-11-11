"use client";
export default function ScriptsPage() {
  const scripts = [{ name: "Intro Call", steps: ["Introduce yourself", "Ask about challenges", "Present solution"] }, { name: "Follow-up", steps: ["Reference previous", "Address concerns", "Next steps"] }];
  return <div><h1 className="page-title mb-4">Call Scripts</h1><div className="space-y-4">{scripts.map(s => <div key={s.name} className="card p-5"><h3 className="font-medium mb-3">{s.name}</h3><ol className="list-decimal list-inside text-sm">{s.steps.map(step => <li key={step}>{step}</li>)}</ol></div>)}</div></div>;
}
