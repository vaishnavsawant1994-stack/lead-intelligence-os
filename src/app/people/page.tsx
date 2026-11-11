"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/Skeleton";
const people = [{ id: "1", name: "Arjun Mehta", company: "TechNova", tier: "A" }];
export default function PeoplePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);
  if (loading) return <div><h1 className="page-title mb-4">People</h1><TableSkeleton rows={5} /></div>;
  return <div><h1 className="page-title mb-4">People</h1><div className="card"><table className="table"><thead><tr><th>Name</th><th>Company</th></tr></thead><tbody>{people.map(p => <tr key={p.id}><td><Link href={`/people/${p.id}`} className="text-indigo-600">{p.name}</Link></td><td>{p.company}</td></tr>)}</tbody></table></div></div>;
}
