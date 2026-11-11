"use client";
import { useLoading } from "@/hooks/useLoading";
import { TableSkeleton } from "@/components/Skeleton";
export default function ScoringPage() {
  const loading = useLoading(500);
  if (loading) return <div><h1 className="page-title mb-4">Scoring</h1><TableSkeleton rows={4} /></div>;
  return <div><h1 className="page-title mb-4">Lead Scoring</h1><div className="card p-5">Tier A boost</div></div>;
}
