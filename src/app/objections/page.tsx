"use client";
export default function ObjectionsPage() {
  const objections = [{ objection: "Too expensive", response: "Let me show you the ROI..." }, { objection: "Not the right time", response: "When would be better?" }];
  return <div><h1 className="page-title mb-4">Objection Handling</h1><div className="space-y-4">{objections.map(o => <div key={o.objection} className="card p-5"><div className="font-medium text-red-600 mb-2">"{o.objection}"</div><div className="text-sm text-slate-600">{o.response}</div></div>)}</div></div>;
}
