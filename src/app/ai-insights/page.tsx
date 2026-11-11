"use client";
export default function AIInsightsPage() {
  const insights = [{ person: "Arjun Mehta", insight: "High engagement. Recommend scheduling a call.", confidence: 92 }];
  return (<div><h1 className="page-title mb-4">AI Insights</h1><div className="space-y-4">{insights.map(i => <div key={i.person} className="card p-5"><div className="font-medium">{i.person}</div><p className="text-sm text-slate-600 mt-1">{i.insight}</p></div>)}</div></div>);
}
