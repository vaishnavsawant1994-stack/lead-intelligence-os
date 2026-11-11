"use client";
import { useLoading } from "@/hooks/useLoading";
import { TableSkeleton } from "@/components/Skeleton";
export default function ReportsPage() {
  const loading = useLoading(600);
  if (loading) return <div><h1 className="page-title mb-4">Reports</h1><TableSkeleton rows={4} /></div>;
  return <div><h1 className="page-title mb-4">Reports</h1><div className="card p-5">Pipeline Summary</div></div>;
}
