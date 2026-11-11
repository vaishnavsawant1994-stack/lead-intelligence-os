"use client";
export default function PredictivePage() {
  return <div><h1 className="page-title mb-4">Predictive Analytics</h1><div className="grid grid-cols-3 gap-4"><div className="card p-5"><div className="text-sm text-slate-500">Predicted</div><div className="text-2xl font-bold text-indigo-600">15</div></div><div className="card p-5"><div className="text-sm text-slate-500">Confidence</div><div className="text-2xl font-bold">78%</div></div><div className="card p-5"><div className="text-sm text-slate-500">Trend</div><div className="text-2xl font-bold text-emerald-600">↑ 20%</div></div></div></div>;
}
