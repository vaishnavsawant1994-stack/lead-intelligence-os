"use client";
import { useState, useEffect } from "react";
import { TableSkeleton } from "@/components/Skeleton";
const tasks = [{ id: "1", task: "Follow up with Arjun", due: "Today", done: false }];
export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);
  if (loading) return <div><h1 className="page-title mb-4">Tasks</h1><TableSkeleton rows={4} /></div>;
  return <div><h1 className="page-title mb-4">Tasks</h1><div className="card divide-y">{tasks.map(t => <div key={t.id} className="px-5 py-4 flex items-center gap-4"><input type="checkbox" /><span>{t.task}</span><span className="badge badge-neutral ml-auto">{t.due}</span></div>)}</div></div>;
}
