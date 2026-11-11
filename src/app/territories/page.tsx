"use client";
export default function TerritoriesPage() {
  const territories = [{ name: "India", owner: "You", leads: 1247 }, { name: "US West", owner: "Sarah", leads: 856 }];
  return <div><h1 className="page-title mb-4">Territories</h1><div className="card"><table className="table"><thead><tr><th>Territory</th><th>Owner</th><th>Leads</th></tr></thead><tbody>{territories.map(t => <tr key={t.name}><td>{t.name}</td><td>{t.owner}</td><td>{t.leads}</td></tr>)}</tbody></table></div></div>;
}
