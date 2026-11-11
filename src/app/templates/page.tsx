"use client";
import { useLoading } from "@/hooks/useLoading";
import { TableSkeleton } from "@/components/Skeleton";
export default function TemplatesPage() {
  const loading = useLoading(500);
  if (loading) return <div><h1 className="page-title mb-4">Templates</h1><TableSkeleton rows={4} /></div>;
  return <div><h1 className="page-title mb-4">Templates</h1><div className="card p-5">Cold Outreach</div></div>;
}
