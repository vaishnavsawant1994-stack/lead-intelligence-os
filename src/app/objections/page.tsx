"use client";
export default function ObjectionsPage() {
  const objections = [{ objection: "Too expensive", response: "Let's look at the ROI." }];
  return (<div><h1 className="page-title mb-4">Objection Handling</h1><div className="space-y-4">{objections.map(o => <div key={o.objection} className="card p-5"><div className="font-medium text-red-600">"{o.objection}"</div><div className="text-sm text-slate-600 mt-1">{o.response}</div></div>)}</div></div>);
}
