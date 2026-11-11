"use client";
export default function BillingPage() {
  const plans = [{ name: "Starter", price: 29, features: ["1,000 contacts", "Basic features"] }, { name: "Pro", price: 99, features: ["10,000 contacts", "All features"] }];
  return <div><h1 className="page-title mb-4">Billing</h1><div className="grid md:grid-cols-2 gap-4">{plans.map(p => <div key={p.name} className="card p-5"><div className="font-medium text-lg">{p.name}</div><div className="text-2xl font-bold text-indigo-600">${p.price}/mo</div><ul className="mt-3 text-sm">{p.features.map(f => <li key={f}>• {f}</li>)}</ul></div>)}</div></div>;
}
