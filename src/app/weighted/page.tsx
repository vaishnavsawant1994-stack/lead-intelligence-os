"use client";
export default function WeightedPage() {
  const deals = [{ name: "TechNova", value: 25000, probability: 80, weighted: 20000 }];
  return <div><h1 className="page-title mb-4">Weighted Pipeline</h1><div className="grid grid-cols-2 gap-4 mb-6"><div className="card p-5"><div className="text-sm text-slate-500">Total</div><div className="text-2xl font-bold">$25,000</div></div><div className="card p-5"><div className="text-sm text-slate-500">Weighted</div><div className="text-2xl font-bold text-indigo-600">$20,000</div></div></div><div className="card"><table className="table"><thead><tr><th>Deal</th><th>Value</th><th>Probability</th><th>Weighted</th></tr></thead><tbody>{deals.map(d => <tr key={d.name}><td>{d.name}</td><td>${d.value}</td><td>{d.probability}%</td><td className="text-indigo-600">${d.weighted}</td></tr>)}</tbody></table></div></div>;
}
