"use client";
export default function CleanupPage() {
  const issues = [{ type: "Missing email", count: 234 }, { type: "Duplicate names", count: 45 }, { type: "Invalid format", count: 12 }];
  return <div><h1 className="page-title mb-4">Data Cleanup</h1><div className="grid md:grid-cols-3 gap-4">{issues.map(i => <div key={i.type} className="card p-5"><div className="font-medium">{i.type}</div><div className="text-2xl font-bold text-amber-600">{i.count}</div></div>)}</div></div>;
}
