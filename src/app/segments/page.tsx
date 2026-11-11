"use client";
export default function SegmentsPage() {
  const segments = [{ name: "High Value", criteria: "Tier A + Score > 80", count: 156 }, { name: "India Focus", criteria: "Country = India", count: 1247 }];
  return <div><h1 className="page-title mb-4">Segments</h1><div className="space-y-4">{segments.map(s => <div key={s.name} className="card p-5 flex justify-between"><div><div className="font-medium">{s.name}</div><div className="text-sm text-slate-500">{s.criteria}</div></div><div className="text-2xl font-bold">{s.count}</div></div>)}</div></div>;
}
