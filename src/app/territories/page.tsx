"use client";
export default function TerritoriesPage() {
  const territories = [{ name: "India", assignee: "Sarah", leads: 1247 }];
  return (<div><h1 className="page-title mb-4">Territories</h1><div className="card"><table className="table"><thead><tr><th>Territory</th><th>Assignee</th><th>Leads</th></tr></thead><tbody>{territories.map(t => <tr key={t.name}><td>{t.name}</td><td>{t.assignee}</td><td>{t.leads}</td></tr>)}</tbody></table></div></div>);
}
