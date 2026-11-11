"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const companies: Record<string, any> = {
  "1": {
    name: "TechNova", industry: "Technology", employees: "40", funding: "$2.5M",
    website: "technova.com", location: "Bangalore, India",
    people: [
      { name: "Arjun Mehta", title: "Founder & CEO", tier: "A" },
      { name: "Priya Patel", title: "CTO", tier: "B" },
    ],
    news: ["Raised $2.5M seed", "Expanding to Southeast Asia"],
  },
};

export default function CompanyDetail() {
  const { id } = useParams();
  const company = companies[id as string] || companies["1"];

  return (
    <div>
      <Link href="/companies" className="text-sm text-slate-500 hover:text-indigo-600 mb-4 inline-block">← Back</Link>
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="text-slate-500">{company.industry} · {company.location}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">{company.funding}</div>
            <div className="text-xs text-slate-500">Funding</div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4"><div className="text-sm text-slate-500">Employees</div><div className="text-xl font-bold">{company.employees}</div></div>
        <div className="card p-4"><div className="text-sm text-slate-500">Website</div><div className="text-sm font-medium text-indigo-600">{company.website}</div></div>
        <div className="card p-4"><div className="text-sm text-slate-500">People</div><div className="text-xl font-bold">{company.people.length}</div></div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">People</div>
          <div className="divide-y">
            {company.people.map((p: any, i: number) => (
              <div key={i} className="px-5 py-3 flex justify-between items-center">
                <div><div className="font-medium text-sm">{p.name}</div><div className="text-xs text-slate-500">{p.title}</div></div>
                <span className={`badge ${p.tier === "A" ? "badge-warning" : "badge-neutral"}`}>{p.tier}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-sm mb-4">Recent News</h3>
          <ul className="text-sm space-y-2">{company.news.map((n: string, i: number) => <li key={i}>• {n}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
