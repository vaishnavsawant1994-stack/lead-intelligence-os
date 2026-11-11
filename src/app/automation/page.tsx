"use client";
export default function AutomationPage() {
  const rules = [{ name: "Hot lead alert", if: "Score > 80", then: "Notify team", active: true }];
  return (<div><h1 className="page-title mb-4">Automation Rules</h1><div className="space-y-4">{rules.map(r => <div key={r.name} className="card p-5"><div className="font-medium">{r.name}</div><div className="text-sm">IF {r.if} THEN {r.then}</div></div>)}</div></div>);
}
