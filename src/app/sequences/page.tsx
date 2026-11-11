"use client";
import { useLoading } from "@/hooks/useLoading";
import { TableSkeleton } from "@/components/Skeleton";
export default function SequencesPage() {
  const loading = useLoading(500);
  if (loading) return <div><h1 className="page-title mb-4">Sequences</h1><TableSkeleton rows={3} /></div>;
  return <div><h1 className="page-title mb-4">Sequences</h1><div className="card p-5">Cold Outreach</div></div>;
}
