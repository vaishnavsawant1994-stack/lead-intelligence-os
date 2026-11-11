"use client";
export default function EngagementPage() {
  const leads = [{ name: "Arjun Mehta", score: 85, emails: 5, opens: 4 }, { name: "Sophia Reynolds", score: 72, emails: 3, opens: 2 }];
  return <div><h1 className="page-title mb-4">Engagement Scoring</h1><div className="card"><table className="table"><thead><tr><th>Person</th><th>Score</th><th>Emails</th><th>Opens</th></tr></thead><tbody>{leads.map(l => <tr key={l.name}><td>{l.name}</td><td className="font-bold text-emerald-600">{l.score}</td><td>{l.emails}</td><td>{l.opens}</td></tr>)}</tbody></table></div></div>;
}
