"use client";
export default function ConditionalSequencesPage() {
  const branches = ["If opened → Send value email", "If not opened → Resend", "If replied → Stop"];
  return <div><h1 className="page-title mb-4">Conditional Sequences</h1><div className="card p-5"><h3 className="font-medium mb-4">Smart Follow-up</h3><div className="space-y-2">{branches.map((b, i) => <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded text-sm"><span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs">{i+1}</span>{b}</div>)}</div></div></div>;
}
