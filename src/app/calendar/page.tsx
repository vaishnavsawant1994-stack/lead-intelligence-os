"use client";
import { useLoading } from "@/hooks/useLoading";
import { TableSkeleton } from "@/components/Skeleton";
export default function CalendarPage() {
  const loading = useLoading(400);
  if (loading) return <div><h1 className="page-title mb-4">Calendar</h1><TableSkeleton rows={4} /></div>;
  return <div><h1 className="page-title mb-4">Calendar</h1><div className="card p-5">Call with Arjun</div></div>;
}
