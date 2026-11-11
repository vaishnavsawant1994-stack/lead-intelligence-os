"use client";
import { useLoading } from "@/hooks/useLoading";
import { TableSkeleton } from "@/components/Skeleton";
const companies = [{ name: "TechNova", industry: "Technology" }];
export default function CompaniesPage() {
  const loading = useLoading(600);
  if (loading) return <div><h1 className="page-title mb-4">Companies</h1><TableSkeleton rows={5} /></div>;
  return <div><h1 className="page-title mb-4">Companies</h1><div className="card"><table className="table"><tbody>{companies.map(c => <tr key={c.name}><td>{c.name}</td><td>{c.industry}</td></tr>)}</tbody></table></div></div>;
}
