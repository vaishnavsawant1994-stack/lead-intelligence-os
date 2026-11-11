"use client";
import { useLoading } from "@/hooks/useLoading";
import { TableSkeleton } from "@/components/Skeleton";
const deals = [{ name: "TechNova Partnership", value: 25000, stage: "Negotiation" }];
export default function DealsPage() {
  const loading = useLoading(500);
  if (loading) return <div><h1 className="page-title mb-4">Deals</h1><TableSkeleton rows={4} /></div>;
  return <div><h1 className="page-title mb-4">Deals</h1><div className="card"><table className="table"><tbody>{deals.map(d => <tr key={d.name}><td>{d.name}</td><td>{d.stage}</td><td>${d.value}</td></tr>)}</tbody></table></div></div>;
}
