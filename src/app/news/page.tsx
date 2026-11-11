"use client";
export default function NewsPage() {
  const news = [{ company: "TechNova", headline: "Raises $2.5M seed", source: "TechCrunch" }, { company: "Horizon", headline: "Closes $100M fund", source: "Forbes" }];
  return <div><h1 className="page-title mb-4">Company News</h1><div className="space-y-4">{news.map(n => <div key={n.headline} className="card p-5"><div className="text-indigo-600 font-medium">{n.company}</div><div className="font-medium">{n.headline}</div><div className="text-sm text-slate-500">{n.source}</div></div>)}</div></div>;
}
