"use client";

import Link from "next/link";
import { useState } from "react";

const stats = [
  { label: "Total People", value: "9,746", change: "+124 this week", color: "indigo" },
  { label: "Tier A Prospects", value: "464", change: "High priority", color: "amber" },
  { label: "Verified LinkedIns", value: "5,815", change: "59.7%", color: "emerald" },
  { label: "Outreach Active", value: "127", change: "In pipeline", color: "blue" },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back. Here's your overview.</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people..." className="w-72 border rounded-lg px-4 py-2 text-sm" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="text-sm text-slate-500">{s.label}</div>
            <div className="text-3xl font-bold mt-1">{s.value}</div>
            <div className="text-xs text-emerald-600 mt-2">{s.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
