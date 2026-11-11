"use client";
export default function HeatmapPage() {
  return (<div><h1 className="page-title mb-4">Activity Heatmap</h1><div className="card p-6"><div className="grid grid-cols-7 gap-1">{Array.from({length: 28}).map((_, i) => <div key={i} className={`w-4 h-4 rounded ${i % 3 === 0 ? "bg-emerald-400" : "bg-slate-100"}`} />)}</div></div></div>);
}
