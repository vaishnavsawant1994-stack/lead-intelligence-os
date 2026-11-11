"use client";
export default function WinLossPage() {
  return <div><h1 className="page-title mb-4">Win/Loss Analysis</h1><div className="grid grid-cols-3 gap-4 mb-6"><div className="card p-5 text-center"><div className="text-3xl font-bold text-emerald-600">65%</div><div className="text-sm text-slate-500">Win Rate</div></div><div className="card p-5 text-center"><div className="text-3xl font-bold">23</div><div className="text-sm text-slate-500">Won</div></div><div className="card p-5 text-center"><div className="text-3xl font-bold">12</div><div className="text-sm text-slate-500">Lost</div></div></div></div>;
}
