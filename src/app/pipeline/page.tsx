"use client";
import { useState, useEffect } from "react";
import { TableSkeleton } from "@/components/Skeleton";
const pipeline = [{ stage: "New", items: [{ name: "Daniel Kim", company: "Innovate" }] }, { stage: "Contacted", items: [{ name: "Arjun Mehta", company: "TechNova" }] }];
export default function PipelinePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  if (loading) return <div><h1 className="page-title mb-4">Pipeline</h1><TableSkeleton rows={3} /></div>;
  return <div><h1 className="page-title mb-4">Pipeline</h1><div className="flex gap-4">{pipeline.map(col => <div key={col.stage} className="min-w-[200px] bg-slate-50 rounded-lg p-3"><div className="font-medium text-sm mb-3">{col.stage}</div>{col.items.map(item => <div key={item.name} className="card p-3 mb-2"><div className="font-medium text-sm">{item.name}</div><div className="text-xs text-slate-500">{item.company}</div></div>)}</div>)}</div></div>;
}
