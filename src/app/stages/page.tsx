"use client";
import { useState } from "react";
export default function StagesPage() {
  const [stages] = useState([{ name: "New", order: 1 }, { name: "Contacted", order: 2 }, { name: "Qualified", order: 3 }, { name: "Won", order: 4 }]);
  return <div><h1 className="page-title mb-4">Deal Stages</h1><div className="space-y-2">{stages.map(s => <div key={s.name} className="card px-5 py-3 flex items-center gap-4"><span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm">{s.order}</span><span className="font-medium">{s.name}</span></div>)}</div></div>;
}
