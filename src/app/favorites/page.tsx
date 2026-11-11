"use client";
export default function FavoritesPage() {
  const favorites = [{ name: "Arjun Mehta", company: "TechNova" }];
  return (<div><h1 className="page-title mb-4">Favorites</h1><div className="space-y-4">{favorites.map(f => <div key={f.name} className="card p-5"><div className="font-medium">{f.name}</div><div className="text-sm text-slate-500">{f.company}</div></div>)}</div></div>);
}
