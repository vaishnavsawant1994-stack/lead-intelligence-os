"use client";
import { useState, useEffect } from "react";
import { StatsSkeleton, TableSkeleton } from "@/components/Skeleton";
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);
  if (loading) return <div><h1 className="page-title mb-4">Dashboard</h1><StatsSkeleton /><div className="mt-6"><TableSkeleton rows={4} /></div></div>;
  return <div><h1 className="page-title mb-4">Dashboard</h1><div className="grid grid-cols-4 gap-4"><div className="card p-5"><div className="text-sm text-slate-500">Total People</div><div className="text-2xl font-bold">9,746</div></div></div></div>;
}
