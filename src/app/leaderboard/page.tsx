"use client";
export default function LeaderboardPage() {
  const team = [{ name: "You", emails: 45, calls: 12, meetings: 5 }, { name: "Sarah", emails: 38, calls: 8, meetings: 4 }];
  return <div><h1 className="page-title mb-4">Leaderboard</h1><div className="card"><table className="table"><thead><tr><th>Rank</th><th>Name</th><th>Emails</th><th>Calls</th><th>Meetings</th></tr></thead><tbody>{team.map((t, i) => <tr key={t.name}><td className="font-bold text-indigo-600">{i+1}</td><td>{t.name}</td><td>{t.emails}</td><td>{t.calls}</td><td>{t.meetings}</td></tr>)}</tbody></table></div></div>;
}
